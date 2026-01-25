import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContent } from "@/libs/hooks/useContent";
import { useAppDispatch } from "@/libs/stores";
import { getTikTokCreatorInfo } from "@/libs/stores/contentManager/thunk";
import {
  Clock,
  MessageSquareOff,
  Users,
  Video,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Eye,
  Shield,
} from "lucide-react";

const TikTokGuidelineCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tikTokCreatorInfo, loading, error } = useContent();

  // Auto-fetch creator info when component mounts
  useEffect(() => {
    dispatch(getTikTokCreatorInfo());
  }, [dispatch]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-2 text-sm text-gray-600">Loading TikTok guidelines...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="w-full border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-700">
          Failed to load TikTok creator information. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full border-pink-200">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-pink-700">
          <Video className="h-5 w-5" />
          TikTok Content Guidelines
        </CardTitle>
        <CardDescription className="text-gray-700">
          Review your account settings and TikTok's content requirements before posting
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {tikTokCreatorInfo ? (
          <>
            {/* Creator Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={tikTokCreatorInfo.creator_avatar_url}
                    alt={tikTokCreatorInfo.creator_nickname}
                  />
                  <AvatarFallback className="bg-pink-100 text-pink-700">
                    {tikTokCreatorInfo.creator_nickname?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {tikTokCreatorInfo.creator_nickname}
                  </h3>
                  <p className="text-sm text-gray-600">@{tikTokCreatorInfo.creator_username}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Connected
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Video Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Video Requirements
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Maximum Duration</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    {formatDuration(tikTokCreatorInfo.max_video_post_duration_sec)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Privacy Options</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tikTokCreatorInfo.privacy_level_options?.join(", ").replace(/_/g, " ") ||
                      "PUBLIC"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Interaction Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Interaction Settings
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <MessageSquareOff
                      className={`h-4 w-4 ${tikTokCreatorInfo.comment_disabled ? "text-red-500" : "text-green-500"}`}
                    />
                    <span className="text-sm font-medium">Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tikTokCreatorInfo.comment_disabled ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={tikTokCreatorInfo.comment_disabled ? "destructive" : "default"}>
                      {tikTokCreatorInfo.comment_disabled ? "Disabled" : "Enabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Users
                      className={`h-4 w-4 ${tikTokCreatorInfo.duet_disabled ? "text-red-500" : "text-green-500"}`}
                    />
                    <span className="text-sm font-medium">Duets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tikTokCreatorInfo.duet_disabled ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={tikTokCreatorInfo.duet_disabled ? "destructive" : "default"}>
                      {tikTokCreatorInfo.duet_disabled ? "Disabled" : "Enabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Zap
                      className={`h-4 w-4 ${tikTokCreatorInfo.stitch_disabled ? "text-red-500" : "text-green-500"}`}
                    />
                    <span className="text-sm font-medium">Stitches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tikTokCreatorInfo.stitch_disabled ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={tikTokCreatorInfo.stitch_disabled ? "destructive" : "default"}>
                      {tikTokCreatorInfo.stitch_disabled ? "Disabled" : "Enabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content Guidelines */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-500" />
                Content Guidelines
              </h4>

              <div className="space-y-3">
                <Alert className="border-orange-200 bg-orange-50">
                  <Info className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 text-sm">
                    <strong>Required:</strong> You must manually select privacy status - no default
                    values allowed.
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Watermarks:</strong> Do not add promotional watermarks, logos, or
                    branding to your content.
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50">
                  <Users className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800 text-sm">
                    <strong>Interactions:</strong> Users must manually enable comment, duet, and
                    stitch settings - none are checked by default.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <Separator />

            {/* Legal Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Legal Requirements
              </h4>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  By posting, you agree to TikTok's:
                </p>
                <ul className="text-sm text-red-700 space-y-1 ml-4">
                  <li>
                    •{" "}
                    <a
                      href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-red-900"
                    >
                      Music Usage Confirmation
                    </a>
                  </li>
                  <li>• Content must be original and authentic</li>
                  <li>• Commercial content must be properly disclosed</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">TikTok creator information unavailable</p>
            <p className="text-xs text-gray-400 mt-1">
              Please ensure your TikTok account is properly connected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TikTokGuidelineCard;
