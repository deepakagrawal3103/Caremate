import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Input = forwardRef(({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = "",
  icon: Icon,
  helperText,
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-6 py-4 rounded-2xl  transition-all duration-200 font-medium
            ${Icon ? 'pl-11' : ''}
            ${error ? 'bg-red-50 text-red-500 focus:ring-1 focus:ring-[#c04847]' : 'bg-white border border-border text-gray-900 focus:ring-1 focus:ring-[#113757]'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            placeholder:text-gray-400 placeholder:font-medium text-lg focus:outline-none
          `}
        />
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 text-base mt-1 flex items-center gap-1"
            >
              <span>⚠️</span> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {helperText && !error && (
        <p className="text-gray-500 text-base mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;