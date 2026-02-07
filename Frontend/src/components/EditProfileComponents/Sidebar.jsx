import { 
    User, 
    Settings, 
    Shield, 
    Mail, 
    AlertOctagon, 
    Menu, 
    X,
    ChevronRight
} from "lucide-react";
function Sidebar({ active, setActive, isOpen, onClose }) {
    const items = [
        { id: "profile", label: "Edit Profile", icon: User },
        { id: "account", label: "Account Settings", icon: Settings },
        { id: "security", label: "Password & Security", icon: Shield },
        { id: "email", label: "Email Verification", icon: Mail },
        { id: "danger", label: "Danger Zone", icon: AlertOctagon },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-6 shadow-2xl transition-transform duration-300 ease-in-out
                md:relative md:transform-none md:w-72 md:bg-transparent md:border-none md:shadow-none md:p-0 md:z-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center justify-between mb-8 md:hidden">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = active === item.id;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActive(item.id)}
                                className={`
                                    w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
                                    ${isActive 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white"} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
export default Sidebar;
