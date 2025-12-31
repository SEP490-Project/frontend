import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Channel } from "@/libs/types/channel";

interface ChannelSidebarProps {
  channels: Channel[];
  selectedChannel: string;
  onChannelChange: (channelId: string) => void;
  isLoading?: boolean;
  allowedChannelTypes?: string[];
  contentType?: "blog" | "video";
  children?: React.ReactNode; // For additional sidebar content like AI Generator
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  channels,
  selectedChannel,
  onChannelChange,
  isLoading = false,
  allowedChannelTypes = [],
  contentType = "blog",
  children,
}) => {
  // Filter channels based on allowed types
  const filteredChannels = React.useMemo(() => {
    if (allowedChannelTypes.length === 0) return channels;
    return channels.filter((channel) =>
      allowedChannelTypes.some((type) => channel.name.toLowerCase().includes(type.toLowerCase())),
    );
  }, [channels, allowedChannelTypes]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Channel Selection Card */}
      <Card className="flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF9DB0]" />
              Publish Channel
            </span>
            {selectedChannel && (
              <Badge variant="secondary" className="bg-[#FF9DB0]/10 text-[#FF9DB0]">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF9DB0]" />
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No channels available for {contentType} content
            </div>
          ) : (
            <RadioGroup
              value={selectedChannel}
              onValueChange={onChannelChange}
              className="space-y-2"
            >
              {filteredChannels.map((channel) => {
                const isSelected = selectedChannel === channel.id;
                return (
                  <div key={channel.id}>
                    <Label
                      htmlFor={`channel-${channel.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#FF9DB0] bg-[#FF9DB0]/5"
                          : "border-gray-200 hover:border-[#FF9DB0]/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={channel.id}
                        id={`channel-${channel.id}`}
                        className="data-[state=checked]:border-[#FF9DB0] data-[state=checked]:text-[#FF9DB0]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{channel.name}</p>
                        {channel.code && (
                          <p className="text-xs text-gray-500 truncate">{channel.code}</p>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-[#FF9DB0] flex-shrink-0" />
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}

          {/* Help Text */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500">
              {contentType === "blog"
                ? "Select the channel where your blog post will be published."
                : "Select the channel where your video will be published."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional sidebar content (AI Generator, etc.) */}
      {children}
    </div>
  );
};

export default ChannelSidebar;
