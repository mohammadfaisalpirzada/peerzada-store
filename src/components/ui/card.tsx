// components/ui/card.tsx
import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-xl font-semibold ${className || ""}`}>{children}</h2>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4">{children}</div>;
};

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`mt-4 ${className || ""}`}>{children}</div>;
};
