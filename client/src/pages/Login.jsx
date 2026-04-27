import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!isLogin && !formData.name) newErrors.name = "Full name is required";
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (errors.general) {
      setErrors({ ...errors, general: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({ name: formData.name, email: formData.email, password: formData.password });
        toast.success("Account created successfully!");
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ ...formData, password: "" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg  overflow-hidden">
          <div className="px-8 py-10 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6eff6] text-gray-900 mb-6">
                <span className="text-3xl" aria-hidden="true">⚕️</span>
              </div>
              <h1 className="text-4xl font-sans text-gray-900 font-bold tracking-tight">The Safety Hub</h1>
              <p className="text-base font-medium text-secondary mt-2 uppercase tracking-widest">Medical Safety Companion</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Input
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="e.g. John Doe"
                      className="mb-0"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
                className="mb-0"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                className="mb-0"
              />

              <AnimatePresence>
                {errors.general && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-4 bg-red-50  text-red-500 rounded-2xl text-base font-bold flex gap-3 items-start"
                  >
                    <span aria-hidden="true" className="shrink-0 mt-0.5">⚠️</span>
                    <span>{errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  className="py-3.5"
                >
                  {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="bg-white border border-border px-8 py-6 text-center">
            <p className="text-base text-secondary font-medium whitespace-nowrap">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-3 text-gray-900 font-bold tracking-wide transition-colors focus:outline-none hover:opacity-80"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-base text-gray-400 font-bold tracking-widest uppercase">Secured by Medical Safety Standards.</p>
        </div>
      </motion.div>
    </div>
  );
}