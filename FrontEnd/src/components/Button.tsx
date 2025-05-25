import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'blue' | 'purple';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  color = 'blue', 
  type = 'button',
  disabled = false,
  icon,
  fullWidth = false
}) => {
  const baseClasses = "py-3 px-4 rounded-md font-medium text-white transition-all flex items-center justify-center gap-2";
  
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    purple: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses[color]} ${widthClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;