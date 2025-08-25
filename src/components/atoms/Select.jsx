import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  helper,
  required = false,
  disabled = false,
  children,
  placeholder = "Select an option",
  ...props 
}, ref) => {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg",
            "text-gray-900 appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "transition-colors duration-200",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-red-300 focus:ring-red-500",
            className
          )}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon 
            name="ChevronDown" 
            className="w-4 h-4 text-gray-400" 
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500 mt-1">
          {helper}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;