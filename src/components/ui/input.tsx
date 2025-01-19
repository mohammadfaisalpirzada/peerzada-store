// components/ui/input.tsx
import React from "react";

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-black focus:border-black ${className || ""}`}
    />
  );
};
