def utils

pipeline {
    agent any

    tools {
        nodejs 'NodeJS_22.21.0'
    } 

    triggers {
        githubPush()
    }

    parameters {
        booleanParam(name: 'RUN_TESTS', defaultValue: false, description: 'Run tests before build')
        choice(name: 'ENVIRONMENT', choices: ['STAGING', 'PRODUCTION'], description: 'Environment to inject .env file for')
        choice(name: 'BRANCH_NAME', choices: ['-- Select --','main', 'staging', 'pre-staging'], description: 'Select branch to build')
    }

    environment {
        APP_NAME = 'frontend'
        FRONTEND_REPO = 'git@github.com:SEP490-Project/frontend.git'
        DEVOPS_REPO   = 'git@github.com:SEP490-Project/private-server-application-devops.git'
        GIT_CREDENTIALS_ID = 'ssh-github-key'
        EFFECTIVE_ENVIRONMENT = ''
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    utils = load 'script.groovy'
                    def commitSHA = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(7)

                    def branchName = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    env.BRANCH_NAME = branchName
                    if (branchName == 'main') {
                        env.EFFECTIVE_ENVIRONMENT = 'PRODUCTION'
                    } else if (branchName == 'staging') {
                        env.EFFECTIVE_ENVIRONMENT = 'STAGING'
                    } else {
                        env.EFFECTIVE_ENVIRONMENT = 'STAGING'
                    }

                    currentBuild.displayName = "${branchName}-${commitSHA}"
                    echo "🔧 Build Display Name set to: ${currentBuild.displayName}"
                }
                sshagent (credentials: ["${env.GIT_CREDENTIALS_ID}"]) {
                    sh 'ssh -o StrictHostKeyChecking=no -T git@github.com || true'
                }
            }
        }

        stage('Checkout Frontend Repo') {
            steps {
                script {
                    cleanWs()
                    def checkoutBranch = env.BRANCH_NAME ?: 'main'
                    utils.checkoutRepo(env.FRONTEND_REPO, "*/${checkoutBranch}")
                }
            }
        }

        stage('Fetch DevOps Config') {
            steps {
                script {
                    utils.fetchDevOpsConfig(env.DEVOPS_REPO)
                }
            }
        }

        stage('Inject .env File') {
            steps {
                script {
                    def environment = (env.EFFECTIVE_ENVIRONMENT == 'PRODUCTION') ? 'main' : 'staging'
                    utils.injectEnvFile(params.ENVIRONMENT)
                }
            }
        }

        stage('Install & Build Frontend') {
            steps {
                script {
                    try {
                        unstash 'node_modules_cache'
                        echo 'Restored node_modules from stash.'
                    } catch (Exception e) {
                        echo 'No previous cache found, running npm ci...'
                        sh 'npm ci'
                        stash name: 'node_modules_cache', includes: 'node_modules/**'
                    }
                    utils.buildFrontend()
                }
            }
        }

        stage ('Testing Frontend') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                script {
                    utils.runTests()
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    utils.buildDockerfile(env.APP_NAME, env.GIT_COMMIT.take(7))
                }
            }
        }

        stage('Archive & Push Artifacts') {
            steps {
                script {
                    utils.archiveArtifacts(env.APP_NAME, env.GIT_COMMIT.take(7), env.BRANCH_NAME)
                }
            }
        }
    }

    post {
        success {
            script {
                utils.sendSuccessNotification()
            }
        }
        failure {
            script {
                utils.sendFailureNotification()
            }
        }
    }
}

