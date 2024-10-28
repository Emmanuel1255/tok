// src/components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        <input
          ref={ref}
          className={`block w-full appearance-none rounded-md px-3 py-2
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 border-2' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 border'
            }
            bg-white text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 sm:text-sm`}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;