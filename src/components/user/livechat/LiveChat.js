// src/components/user/livechat/LiveChat.js
import { useEffect } from "react";

const liveChatURLs = {
  medical: "https://example.com/livechat/medical_team", // replace with actual URL
  welfare: "https://example.com/livechat/welfare_team",
  media: "https://direct.lc.chat/18286317/4", 
  ask_it: "https://example.com/livechat/ask_it" // replace with actual URL
};

const LiveChat = ({ team }) => {
  useEffect(() => {
    const liveChatURL = liveChatURLs[team];
    if (liveChatURL) {
      if (window.LiveChatWidget) {
        window.LiveChatWidget.call("set_session_variables", { Team: team });
        window.LiveChatWidget.call("open_chat_window");
        window.LiveChatWidget.call("update_url", liveChatURL);
      }
    }
  }, [team]);

  return (
    <div className="livechat-container">
      <h2>Live Chat - {team.charAt(0).toUpperCase() + team.slice(1).replace("_", " ")}</h2>
      {/* The LiveChat widget will appear here automatically */}
    </div>
  );
};

export default LiveChat;
