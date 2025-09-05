import React from "react";

function Feedback({ message }) {
  const isSuccess = String(message).toLowerCase().includes("correct");
  const typeClass = isSuccess ? "feedback-success" : "feedback-error";
  return <div className={`feedback ${typeClass}`}>{message}</div>;
}

export default Feedback;