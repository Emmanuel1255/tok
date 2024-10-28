// src/components/common/Button.jsx
import React from 'react';

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  className = "",
  ...props
}) {
  const baseStyles = "relative flex justify-center items-center px-4 py-2 rounded-md text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600",
    secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  };

  return (
    <button
      type={type}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isLoading ? 'cursor-not-allowed opacity-70' : ''
      }`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}