import React from "react";
import Iframe from "react-iframe";

const LiveChat = ({ team }) => {
  let chatUrl;
  let teamName;

  switch (team) {
    case "medical_team":
      chatUrl = "https://direct.lc.chat/18336834/2";
      teamName = "Medical Team";
      break;
    case "welfare_team":
      chatUrl = "https://direct.lc.chat/18336834/3";
      teamName = "Welfare Team";
      break;
      case "protocol_team":
        chatUrl = "https://direct.lc.chat/18336834/4";
        teamName = "Protocol Team";
        break;
    case "media_team":
      chatUrl = "https://direct.lc.chat/18336834/1";
      teamName = "Media Team";
      break;
    case "ask_it":
      chatUrl = "https://direct.lc.chat/18336834/5";
      teamName = "Ask It";
      break;
    default:
      chatUrl = "";
      teamName = "Unknown Team";
      break;
  }
  return (

      <div className="bg-white shadow-lg rounded-lg w-full  p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Live Chat - {teamName}</h2>
        <div className="h-full w-full rounded-lg overflow-hidden">
          <Iframe
            url={chatUrl}
            width="100%"
            height="100%"
            id="chatIframe"
            styles={{height: "500px"}}
            display="block"
            position="relative"
          />
        </div>
      </div>
  );
};

export default LiveChat;
