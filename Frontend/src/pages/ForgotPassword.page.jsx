import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import toast from "react-hot-toast";
import { Mail, Lock, KeyRound, ArrowRight, Timer, CheckCircle2, ChevronLeft } from "lucide-react";

import { Input, Button } from "../components/index";
import { sendForgotPasswordOtpService, verifyForgotPasswordOtpService, resetPasswordService } from "../services/auth.services.js";


function ForgotPassword() {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // UI State
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Form Data
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    // --- ANIMATIONS ---
    useGSAP(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    // --- TIMER LOGIC ---
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // --- HANDLERS ---

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        try {
            setLoading(true);
            await sendForgotPasswordOtpService(email);
            toast.success("OTP sent to your email!");
            setStep(2);
            setTimer(30); // Start 30s cooldown
        } catch (error) {
            toast.error(error?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < 6) return toast.error("Enter valid 6-digit OTP");

        try {
            setLoading(true);
            
            const response = await verifyForgotPasswordOtpService({ email, otp });
            
            // CRITICAL: Save the token from backend
            const token = response.data.resetToken; 
            setResetToken(token);
            
            // Simulation for UI demo:
            await new Promise(r => setTimeout(r, 1000)); 
            
            toast.success("OTP Verified!");
            setStep(3);
        } catch (error) {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        if (newPassword.length < 6) return toast.error("Password too short");

        try {
            setLoading(true);
            // await resetPasswordService({ email, otp, newPassword }); // UNCOMMENT WHEN API READY
            await resetPasswordService({ 
                email, 
                newPassword, 
                resetToken 
            });
            // Simulation:
            await new Promise(r => setTimeout(r, 1500));

            toast.success("Password reset successfully!");
            navigate("/user/login");
        } catch (error) {

            toast.error(error?.response?.data?.message || "Session expired. Try again.");
            if(error?.response?.status === 400) {
                // If token expired, force user back to start
                setStep(1); 
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500/30">
            
            {/* Background Ambience */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div ref={containerRef} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                
                {/* Header / Progress Bar */}
                <div className="h-1.5 bg-slate-800 w-full">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                        style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                    ></div>
                </div>

                <div className="p-8">
                    
                    {/* --- STEP 1: ENTER EMAIL --- */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                                    <KeyRound size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    No worries! Enter your email and we'll send you a recovery code.
                                </p>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leftIcon={<Mail size={18} />}
                                    autoFocus
                                />
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    variant="blue" 
                                    loading={loading}
                                >
                                    Send Verification Code
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* --- STEP 2: VERIFY OTP --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
                                    <Lock size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Enter OTP</h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    We sent a code to <span className="text-white font-medium">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="text-center tracking-widest text-lg font-mono"
                                        maxLength={6}
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center text-xs">
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(1)}
                                            className="text-slate-500 hover:text-white"
                                        >
                                            Change Email
                                        </button>
                                        
                                        {timer > 0 ? (
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Timer size={12} /> Resend in {timer}s
                                            </span>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={handleSendOtp}
                                                className="text-blue-400 hover:text-blue-300 font-medium"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    variant="blue" 
                                    loading={loading}
                                >
                                    Verify & Proceed
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* --- STEP 3: RESET PASSWORD --- */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    Create a strong password for your account.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    leftIcon={<Lock size={18} />}
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    leftIcon={<Lock size={18} />}
                                />

                                <Button 
                                    type="submit" 
                                    className="w-full mt-2" 
                                    variant="blue" 
                                    loading={loading}
                                >
                                    Reset Password
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer Back Link */}
                <div className="bg-slate-950/50 border-t border-slate-800 p-4 text-center">
                    <NavLink 
                        to="/user/login" 
                        className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2"
                    >
                        <ChevronLeft size={16} /> Back to Login
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;