import { Button } from '../';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';

function DangerZone() {
    const navigate = useNavigate();

    const handleClick = () => {
        toast.success("Feature Under Development");
        // navigate('/user/dashboard');
    };

    return (
        <div className="space-y-8">
             <h2 className="text-2xl font-bold text-red-500 border-b border-slate-800 pb-4 flex items-center gap-2">
                <AlertTriangle size={24} /> Danger Zone
            </h2>

            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Deactivate Account</h3>
                    <p className="text-slate-400 text-sm mt-1 max-w-md">
                        This will temporarily disable your account. Your data will be kept for 30 days before permanent deletion.
                    </p>
                </div>

                <Button 
                    className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto border border-red-500 shadow-lg shadow-red-900/20"
                    onClick={handleClick}
                >
                    <Trash2 size={18} className="mr-2" /> Deactivate Account
                </Button>
            </div>
        </div>
    );
}

export default DangerZone;