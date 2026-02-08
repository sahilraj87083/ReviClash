import { Loader2 } from "lucide-react";
import logo from "../../assets/logo3.png"; // Make sure this path is correct

function LoadingState({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        
        {/* Animated Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-ping"></div>
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
             <img src={logo} alt="Loading" className="w-8 h-8 object-contain animate-pulse" />
          </div>
          
          {/* Spinner Ring around logo (Optional) */}
          <div className="absolute -inset-4 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-lg font-semibold tracking-wide text-slate-200">ReviClash</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={14} className="animate-spin" />
                <span>{message}</span>
            </div>
        </div>

      </div>
    </div>
  );
}

export default LoadingState;