import React from "react";
import "./MovieCarousel.css";

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return <div className="error-container">{message}</div>;
};

export default Error;
