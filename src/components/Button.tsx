"use client";

import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  variant?: "success" | "danger" | "default" | "primary"; // Add "primary" here
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean; // New prop for loading state
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "default",
  className = "",
  onClick,
  disabled = false,
  loading = false, // Default to false
  children,
}) => {
  // Define variant styles
  const variantClass = {
    success: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
    default: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white",
    primary: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white", // Add primary styles
  }[variant];

  // Define disabled styles
  const disabledClass = "bg-gray-300 cursor-not-allowed";

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`w-full sm:w-auto py-2 px-4 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClass} ${
        isDisabled ? disabledClass : ""
      } ${className}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0115.99 1.12A4.97 4.97 0 0012 4v4l-2-2-2 2V4a8 8 0 000 8z"
          ></path>
        </svg>
      ) : (
        <span className="block text-center">{children}</span>
      )}
    </button>
  );
};
