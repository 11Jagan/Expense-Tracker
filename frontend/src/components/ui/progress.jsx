import * as React from "react";
import { cn } from "../../utils/cn";

const Progress = React.forwardRef(({ className, value, max = 100, variant = "default", ...props }, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", getVariantClass())}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };