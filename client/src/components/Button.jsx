import { motion } from "framer-motion";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  mobileFullWidth = true, // New prop to control mobile full-width
  as: Component = "button"
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#0F766E] text-white shadow-sm hover:bg-opacity-90 shadow-[#0F766E]/20",
    secondary: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50",
    danger: "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100",
  };
  
  const sizes = {
    sm: "py-2.5 px-4 text-[0.9rem] min-h-[44px]",
    md: "py-3.5 px-6 text-[1rem] min-h-[48px]",
    lg: "py-4 px-8 text-lg min-h-[56px]",
  };
  
  const widthClass = fullWidth 
    ? "w-full" 
    : (mobileFullWidth ? "w-full sm:w-auto" : "w-auto");
  
  // If it's a motion element, we use motion[Component]
  const MotionComponent = motion[Component] || motion.button;
  
  return (
    <MotionComponent
      type={Component === "button" ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </MotionComponent>
  );
}
