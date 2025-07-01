// components/ui/button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded focus:outline-none focus:ring ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black text-white hover:bg-gray-800"
      } ${className || ""}`}
    >
      {children}
    </button>
  );
};
