import api from "@/libs/api";

export const manageChannel = {
  channelList: () => api.get("/channels"),
};
