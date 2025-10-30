// ========== FRONTEND PIPELINE HELPERS ==========

// ---------- Git Checkout ----------
def checkoutRepo(url, branchRegex) {
    checkout([
        $class: 'GitSCM',
        branches: [[name: branchRegex]],
        userRemoteConfigs: [[
            url: url,
            credentialsId: 'github-ssh'
        ]]
    ])
}

// ---------- Fetch DevOps Config ----------
def fetchDevOpsConfig(devOpsUrl) {
    dir('devops') {
        checkout([
            $class: 'GitSCM',
            branches: [[name: 'master']],
            userRemoteConfigs: [[
                url: devOpsUrl,
                credentialsId: 'github-ssh'
            ]]
        ])
    }
}

// ---------- Inject .env ----------
def injectEnvFile(environment) {
    def envFile = "devops/applications/sep490/overlays/${environment.toLowerCase()}/frontend/.env"
    if (!fileExists(envFile)) {
        error "FATAL: Environment file not found: ${envFile}"
    }

    echo "📦 Using environment file: ${envFile}"
    sh """
        cp ${envFile} .env
        echo '✅ Environment file injected:'
        cat .env
    """
}

// ---------- Run Frontend Tests ----------
def runTests() {
    sh 'npm ci && npm test -- --watchAll=false'
}

// ---------- Build Frontend ----------
def buildFrontend() {
    sh 'npm run build'
}

// ---------- Docker Build ----------
def buildDockerfile(appName, sha) {
    def tag = (sha == null || sha.trim() == '') ? 'latest' : sha
    def imageName = "ghcr.io/sep490-project/${appName}"

    echo "🐳 Building Docker image: ${imageName}:${tag}"

    // Clean old local images (same as backend logic)
    sh """
        old_images=\$(docker images --format '{{.Repository}}:{{.Tag}}' | grep '^${imageName}:${tag}' || true)
        if [ -n "\$old_images" ]; then
            echo "🗑 Removing old images with prefix ${imageName}:${tag}"
            docker rmi -f \$old_images || true
        fi
    """

    sh """
        docker build \\
            --build-arg APP_NAME=${appName} \\
            --label "org.opencontainers.image.source=https://github.com/SEP490-Project/frontend" \\
            -t ${imageName}:${tag} .
    """
}

// ---------- Archive & Push Artifacts (mirroring backend logic) ----------
def archiveArtifacts(appName, sha, branchName) {
    if (!sha?.trim()) {
        error "FATAL: Commit SHA is required for archiving artifacts."
    }

    def registry = "ghcr.io"
    def imageName = "ghcr.io/sep490-project/${appName}"
    def sanitizedBranchName = branchName.replaceAll('/', '-')

    def imageWithShaTag = "${imageName}:${sha}"
    def imageWithBranchTag = "${imageName}:${sanitizedBranchName}"
    def imageWithLatestTag = "${imageName}:latest"

    withCredentials([usernamePassword(credentialsId: 'ghcr-access',
                                      usernameVariable: 'GH_USER',
                                      passwordVariable: 'GH_PAT')]) {
        sh """
          set -e

          echo "🔐 Logging in to Docker registry at ${registry}..."
          echo "\$GH_PAT" | docker login ${registry} -u "\$GH_USER" --password-stdin

          echo "🏷️ Tagging image ${imageWithShaTag} with additional tags..."
          docker tag ${imageWithShaTag} ${imageWithBranchTag}
          docker tag ${imageWithShaTag} ${imageWithLatestTag}

          echo "🚀 Pushing image tags to ${registry}..."
          docker push ${imageWithShaTag}
          docker push ${imageWithBranchTag}
          docker push ${imageWithLatestTag}
        """
    }
}

// ---------- Discord Notifications ----------
def sendDiscordNotification(String status, int color) {
    def statusText = (status == 'SUCCESS') ? '✅ Build Success' : '❌ Build Failed'
    def jsonPayload = """
    {
      "username": "Jenkins CI",
      "avatar_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png",
      "embeds": [{
          "title": "${statusText}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
          "url": "${env.BUILD_URL}",
          "color": ${color},
          "description": "The latest build has completed. See details below.",
          "fields": [
              {"name": "Branch", "value": "${env.BRANCH_NAME}", "inline": true},
              {"name": "Environment", "value": "${params.ENVIRONMENT}", "inline": true},
              {"name": "Commit SHA", "value": "`${GIT_COMMIT.take(7)}`", "inline": false},
              {"name": "Build Logs", "value": "[Click here to view the console output](${env.BUILD_URL}console)", "inline": false}
          ],
          "footer": {"text": "Job: ${env.JOB_NAME}"},
          "timestamp": "${new Date().format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getTimeZone('UTC'))}"
      }]
    }
    """

    withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK_URL')]) {
        writeFile file: 'discord_payload.json', text: jsonPayload
        sh 'curl -X POST -H "Content-Type: application/json" --data @discord_payload.json "$DISCORD_WEBHOOK_URL"'
    }
}

def sendSuccessNotification() { sendDiscordNotification('SUCCESS', 3066993) }
def sendFailureNotification() { sendDiscordNotification('FAILURE', 15158332) }

return this
