import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input, Button } from "../components"; 
import { registerService, sendOTPService, checkUsernameService } from "../services/auth.services";
import toast from "react-hot-toast";
import { 
    User, 
    Mail, 
    Lock, 
    CheckCircle2, 
    Smartphone, 
    Timer,
    ArrowRight,
    Loader2,
    XCircle,
    RefreshCw
} from "lucide-react";

function Register() {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();

    // Form State
    const [fullName, setFullName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Username Availability State
    const [usernameAvailable, setUsernameAvailable] = useState(null); 
    const [checkingUsername, setCheckingUsername] = useState(false);

    // OTP State
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false); 
    const [otpLoading, setOtpLoading] = useState(false); 

    // --- USERNAME CHECK LOGIC (Debounced) ---
    useEffect(() => {
        const checkUsername = async () => {
            // if (username.length < 3) {
            //     setUsernameAvailable(null);
            //     return;
            // }

            // Regex for valid username (alphanumeric, underscores,. , 3-20 chars)
            const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

            if (!usernameRegex.test(username)) {
                setUsernameAvailable(false);  // Reset or show invalid format error
                return;
            }

            setCheckingUsername(true);
            try {
                
                if(username.trim().toLowerCase() === 'admin') throw new Error("Taken");
                const data = await checkUsernameService(username);
                setUsernameAvailable(data.isAvailable);
            } catch (error) {
                console.error("Username check failed", error);
                setUsernameAvailable(false);
            } finally {
                setCheckingUsername(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (username) checkUsername();
            else setUsernameAvailable(null);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username]);


    // --- TIMER LOGIC ---
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // --- HANDLERS ---
    const handleSendOtp = async () => {
        if (!email.includes("@")) return toast.error("Please enter a valid email");
        
        try {
            setOtpLoading(true);
            const res = await sendOTPService(email)
            await new Promise(r => setTimeout(r, 1000)); // Simulate API
            setIsOtpSent(true);
            setTimer(30); // Start 30s timer
            toast.success(isOtpSent ? "OTP Resent!" : "OTP sent to " + email);
        } catch (error) {
            toast.error("Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION
        if(!fullName || !username || !email || !password || !confirmPassword || !otp) {
            return toast.error("Please fill in all fields");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (usernameAvailable === false) {
            return toast.error("Username is already taken");
        }
        if (!isOtpSent) {
            return toast.error("Please verify your email first");
        }
        if (!otp || otp.length < 6) {
            return toast.error("Please enter a valid OTP");
        }

        try {
            setLoading(true);
            // Verify OTP logic here...
            await new Promise(r => setTimeout(r, 1000));
            
            const newUser = { fullName, username, email, password, otp };
            const response = await registerService(newUser);

            if(response?.errorCode === 201 || response?.user){
                toast.success("Account created successfully!");
                navigate('/user/login');
            }
            setFullName("")
            setEmail('')
            setUserName("")
            setPassword('')
            setConfirmPassword('')
            setOtp('')
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(containerRef.current, { opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out" });
        tl.from(formRef.current.children, { opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: "power2.out" }, "-=0.4");
    }, { scope: containerRef });


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div ref={containerRef} className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10">
        
        {/* LEFT (Branding) */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative border-r border-slate-800">
           <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dsl9ygthf/image/upload/v1769642848/x4zraifwwtjfmks78wz3.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
           <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                Join <span className="text-blue-500">ReviClash</span> today.
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Practice smarter. Compete harder. <br/> Track real performance.
              </p>
           </div>
        </div>

        {/* RIGHT (Form) */}
        <div className="p-8 md:p-12 bg-slate-950/50 backdrop-blur-sm overflow-y-auto max-h-[90vh]">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
            <p className="text-slate-400 mb-8">Enter your details to get started.</p>

            <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-2 gap-4">
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    label="Full Name" 
                    placeholder="John Doe" 
                  />
                  
                  {/* USERNAME FIELD */}
                  <div className="relative">
                      <Input 
                        value={username}
                        onChange={(e) => {
                            setUserName(e.target.value);
                            setUsernameAvailable(null);
                        }}
                        leftIcon={<User size={18} />}
                        label="Username" 
                        placeholder="john_doe" 
                        className={
                            usernameAvailable === true ? "border-green-500/50 focus:border-green-500" :
                            usernameAvailable === false ? "border-red-500/50 focus:border-red-500" : ""
                        }
                      />
                      <div className="absolute right-3 top-[2.3rem] pointer-events-none">
                          {checkingUsername && <Loader2 size={16} className="text-slate-500 animate-spin" />}
                          {!checkingUsername && usernameAvailable === true && <CheckCircle2 size={16} className="text-green-500" />}
                          {!checkingUsername && usernameAvailable === false && <XCircle size={16} className="text-red-500" />}
                      </div>
                      {!checkingUsername && usernameAvailable === false && (
                          <p className="text-xs text-red-400 mt-1 ml-1">Username is taken</p>
                      )}
                  </div>
              </div>

              {/* Email + Send OTP Section */}
              <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Email Verification</label>
                  <div className="flex gap-2">
                      <div className="relative flex-1 group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                              <Mail size={18} />
                          </div>
                          <input 
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                      </div>
                      
                      {/* OTP BUTTON LOGIC */}
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        // Disable if: Timer active OR Loading OR No Email. We ENABLE it if timer is 0 (even if sent previously)
                        disabled={timer > 0 || otpLoading || !email}
                        className={`
                            bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl text-sm font-medium transition-colors 
                            disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[110px] flex items-center justify-center
                            ${timer > 0 ? "text-blue-400" : ""}
                        `}
                      >
                        {otpLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : timer > 0 ? (
                            <span className="font-mono flex items-center gap-1"><Timer size={14}/> {timer}s</span>
                        ) : isOtpSent ? (
                            <div className="flex text-xs text-center gap-1 font-semibold">
                                <RefreshCw size={16}/>
                                Resend OTP
                            </div>
                            
                        ) : (
                            "Send OTP"
                        )}
                      </button>
                  </div>
              </div>

              {/* OTP Input (Conditionally Visible) */}
              {isOtpSent && (
                   <div className="animate-in fade-in slide-in-from-top-2">
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            label="Enter OTP"
                            placeholder="6-digit code"
                            leftIcon={<Smartphone size={18} />}
                            className="tracking-widest"
                        />
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={12}/> OTP sent to {email}
                        </p>
                   </div>
              )}

              {/* Password & Confirm Password */}
              <div className="space-y-4">
                <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password" 
                    type="password" 
                    placeholder="Create password" 
                    leftIcon={<Lock size={18} />}
                />
                <Input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Confirm Password" 
                    type="password" 
                    placeholder="Repeat password" 
                    leftIcon={<Lock size={18} />}
                />
              </div>

              {/* Final Submit Button - Only Visible if OTP Sent */}
              {isOtpSent && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                    <Button 
                        type="submit"
                        variant="blue" 
                        size="lg"
                        loading={loading}
                        className="w-full group"
                    >
                        {!loading && (
                            <>
                            Verify & Sign Up <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
              )}

            </form>

            {/* Social Logins */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-950 px-2 text-slate-500">Or join with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span className="text-sm font-medium text-slate-300">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                        <img src="https://www.svgrepo.com/show/475647/github-color.svg" className="w-5 h-5 invert" alt="Github" />
                        <span className="text-sm font-medium text-slate-300">Github</span>
                    </button>
                </div>
            </div>

            <p className="text-sm text-slate-400 mt-8 text-center">
                Already have an account?{" "}
                <NavLink
                to="/user/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                Log in
                </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;