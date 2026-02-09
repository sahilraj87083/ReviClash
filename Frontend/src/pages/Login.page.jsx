import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input, Button } from "../components/index";
import { loginService } from "../services/auth.services";
import { useUserContext } from "../contexts/UserContext";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Mail } from "lucide-react";

function Login() {
  const containerRef = useRef(null);
  const formRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const { setUser } = useUserContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
    }

    try {
        setLoading(true);
        const response = await loginService({ email, password });
        
        if (response?.user) {
            setUser(response.user);
            toast.success(`Welcome back, ${response.user.username}!`);

            // window.location.href = "/"; // for refresh : window.location.href to force a page reload.
            navigate("/");
            setEmail("");
            setPassword("");
        }
    } catch (error) {
        toast.error(error?.message || "Login failed. Please check your credentials.");
    } finally {
        setLoading(false);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    // Container Scale In
    tl.from(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
    });

    // Form Elements Stagger
    tl.from(
        formRef.current.children,
        {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div
        ref={containerRef}
        className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10"
      >
        
        {/* LEFT SIDE (Visual Branding) */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative border-r border-slate-800">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dsl9ygthf/image/upload/v1769642848/x4zraifwwtjfmks78wz3.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold text-white tracking-tight">ReviClash</span>
             </div>
             
             <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
               Master your craft.<br/>
               <span className="text-blue-500">Compete globally.</span>
             </h1>
             <p className="text-slate-400 text-lg max-w-md">
               Join thousands of developers solving real-world coding challenges and climbing the leaderboard.
             </p>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex -space-x-3">
                {[19,21,11,1].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                        {String.fromCharCode(64 + i)}
                    </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400 font-medium">
                    +2k
                </div>
             </div>
             <p className="text-sm text-slate-500 font-medium">Join the community today.</p>
          </div>
        </div>

        {/* RIGHT SIDE (Login Form) */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-slate-950/50 backdrop-blur-sm">
          <div ref={formRef} className="w-full max-w-sm mx-auto space-y-8">
            
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
              />

              <div className="space-y-1.5">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={18} />}
                />
                <div className="flex justify-end">
                    <NavLink to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-1">
                        Forgot Password?
                    </NavLink>
                </div>
              </div>

              <Button
                type="submit"
                variant="blue" // Using our new blue variant
                size="lg"
                loading={loading}
                className="w-full group"
              >
                 {!loading && (
                    <>
                     Sign in <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                 )}
              </Button>

            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    <span className="text-sm font-medium text-slate-300">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                    <img src="https://www.svgrepo.com/show/475647/github-color.svg" className="w-5 h-5 invert" alt="Github" />
                    <span className="text-sm font-medium text-slate-300">Github</span>
                </button>
            </div>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <NavLink to="/user/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Create account
              </NavLink>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;