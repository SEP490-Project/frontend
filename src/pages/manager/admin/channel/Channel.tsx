import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  channelList,
  connectFacebookChannel,
  connectTikTokChannel,
} from "@/libs/stores/channelManager/thunk";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaFacebook, FaGlobe, FaTiktok } from "react-icons/fa6";

const Channel = () => {
  const dispatch = useAppDispatch();
  const channels = useSelector((state: RootState) => state?.manageChannel?.channel);

  const currentDate = new Date();

  useEffect(() => {
    dispatch(channelList());
  }, [dispatch]);

  // Channel configuration with icons and colors
  const channelConfig = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      description: "Connect with customers on Facebook",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "bg-black",
      hoverColor: "hover:bg-gray-800",
      description: "Engage audiences on TikTok",
      gradient: "from-gray-800 to-black",
    },
    {
      name: "Website",
      icon: FaGlobe,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      description: "Manage your online store",
      gradient: "from-green-400 to-green-600",
    },
  ];

  const handleResetToken = (channelName: string) => {
    const currentUrl = window.location.origin + window.location.pathname;
    const redirectUrl = currentUrl;
    const cancelUrl = currentUrl;

    if (channelName === "Facebook") {
      dispatch(
        connectFacebookChannel({
          redirect_url: redirectUrl,
          cancel_url: cancelUrl,
          is_internal: true,
        }),
      );
    } else if (channelName === "TikTok") {
      dispatch(
        connectTikTokChannel({
          redirect_url: redirectUrl,
          cancel_url: cancelUrl,
          is_internal: true,
        }),
      );
    }
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Channels</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sales channels and connections</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        {channelConfig.map((channel) => {
          const Icon = channel.icon;
          const channelData = channels?.find(
            (ch) => ch.name.toLowerCase() === channel.name.toLowerCase(),
          );

          return (
            <div
              key={channel.name}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Gradient background header */}
              <div className={`h-24 bg-gradient-to-r ${channel.gradient} relative`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-md">
                    <Icon className="w-6 h-6" style={{ color: channel.color.replace("bg-", "") }} />
                  </div>
                  <h2 className="text-xl font-bold text-white drop-shadow-md">
                    {channelData?.name || channel.name}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {channelData?.description || channel.description}
                </p>

                {/* Stats or Status */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${channelData?.is_active ? "bg-green-500" : "bg-gray-300"} animate-pulse`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {channelData?.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {(channel.name === "Facebook" ||
                    (channel.name === "TikTok" &&
                      new Date(channelData?.token_info?.access_token_expires_at as string) <
                        currentDate)) && (
                    <button
                      onClick={() => handleResetToken(channel.name)}
                      className={`text-xs font-medium px-4 py-2 rounded-lg ${channel.color} text-white ${channel.hoverColor} transition-colors duration-200`}
                    >
                      Reset Token
                    </button>
                  )}
                  {channel.name === "Website" && (
                    <button
                      className={`text-xs font-medium px-4 py-2 rounded-lg ${channel.color} text-white ${channel.hoverColor} transition-colors duration-200`}
                    >
                      Manage
                    </button>
                  )}
                </div>

                {/* Additional info if available */}
                {channelData?.home_page_url && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaGlobe className="w-3 h-3" />
                        URL
                      </span>
                      <a
                        href={channelData.home_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline truncate max-w-[150px]"
                      >
                        {channelData.home_page_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Channel;
