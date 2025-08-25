import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  padding = "md",
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-100";
  
  const variants = {
    default: "card-shadow",
    elevated: "shadow-lg hover:shadow-xl transition-shadow duration-200",
    outlined: "border-2 border-gray-200",
    gradient: "bg-gradient-to-br from-white to-gray-50 card-shadow"
  };
  
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;