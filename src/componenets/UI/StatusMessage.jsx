import React from "react";

const StatusMessage = ({ message, isAIThinking }) => {
  return (
    <div className={`status-message ${isAIThinking ? "ai-thinking" : ""}`}>
      {message}
    </div>
  );
};

export default StatusMessage;
