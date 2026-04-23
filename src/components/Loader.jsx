import { motion } from "framer-motion";

export default function Loader({ fullScreen = true, size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "w-8 h-8 border-2",
    md: "w-14 h-14 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`${sizes[size]} border-t-[#113757] border-[#e8e5dc] rounded-full`}
      />
      {text && <p className="text-gray-900 font-medium text-lg animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}