import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "text-base font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const sizeClasses = {
    sm: "px-4 py-1 text-sm",
    md: "px-6 py-2 text-base", 
    lg: "px-8 py-3 text-lg"
  };
  
  const variantClasses = variant === 'primary'
    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500"
    : "text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-400";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {loading ? 'Loading...' : children}
      </span>
    </button>
  );
};

export default Button;