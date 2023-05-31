import { get, post } from "./baseRequests";

const sendPing = (data: any) => {
  return post("send-ping", data, { withCredentials: true });
};
const resetSession = () => {
  return post("reset-session", {}, { withCredentials: true });
};

const getTopFive = () => {
  return get("top-five", {
    withCredentials: true,
    "Content-Type": "application/json",
  });
};

export { sendPing, getTopFive, resetSession };
