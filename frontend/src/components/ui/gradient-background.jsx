import React from "react";
import { cn } from "../../utils/cn";

export const GradientBackground = ({
  className,
  containerClassName,
  children,
  ...props
}) => {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)} {...props}>
      <div className="absolute inset-0 z-0">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-50 blur-3xl",
            className
          )}
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};