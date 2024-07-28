import React from "react";
import Iframe from "react-iframe";

const LiveChat = ({ team }) => {
  let chatUrl;

  switch (team) {
    case "medical_team":
      chatUrl = "https://example.com/livechat/medical_team";
      break;
    case "welfare_team":
      chatUrl = "https://example.com/livechat/welfare_team";
      break;
    case "media_team":
      chatUrl = "https://example.com/livechat/media_team";
      break;
    case "ask_it":
      chatUrl = "https://example.com/livechat/ask_it";
      break;
    default:
      chatUrl = "";
      break;
  }

  return (
    <div className="iframe-container">
      <Iframe
        url={chatUrl}
        width="100%"
        height="100%"
        id="chatIframe"
        className="h-full w-full border-none"
        display="block"
        position="relative"
      />
    </div>
  );
};

export default LiveChat;
