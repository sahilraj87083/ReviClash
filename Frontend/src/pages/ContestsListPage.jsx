import { useEffect } from "react";
import { useContestList } from "../hooks/useContestList";
import ContestList from "../components/ContestPageComponents/ContestList"; // Adjust import path
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ContestListPage({ type }) {
    const { contests, fetchMore, loading, hasMore, totalContest } = useContestList(type);
    const navigate = useNavigate();

    // Initial fetch when component mounts or type changes
    useEffect(() => {
        fetchMore();
    }, [type]); // We rely on the hook's internal logic, but triggering fetchMore here ensures data loads

    // Dynamic Title Logic
    const getPageTitle = () => {
        switch(type) {
            case 'created': return "Created Contests";
            case 'joined': return "Joined Contests";
            default: return "All Contests";
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 pt-10 pb-20 text-white font-sans selection:bg-red-500/30">
            {/* Background pattern */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-6 h-screen flex flex-col">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/user/contests')}
                            className="p-2 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-400 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                {getPageTitle()}
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {totalContest} result{totalContest !== 1 && 's'} found
                            </p>
                        </div>
                    </div>

                    {/* Decorative Icon (Hidden on small screens) */}
                    <div className="hidden md:flex p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                        <Trophy size={28} />
                    </div>
                </div>

                {/* The List Container */}
                <ContestList
                    contests={contests}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={fetchMore}
                />
            </div>
        </div>
    );
}

export default ContestListPage;