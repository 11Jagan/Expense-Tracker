import React from "react";
import { cn } from "../../utils/cn";

export const FloatingAnimation = ({
  children,
  className,
  containerClassName,
  duration = "5s",
  delay = "0s",
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
    >
      <div
        className={cn("animate-float", className)}
        style={{
          animationDuration: duration,
          animationDelay: delay,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};