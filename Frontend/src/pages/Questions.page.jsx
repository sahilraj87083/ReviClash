import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    QuestionRow, 
    AddToCollectionModal, 
    EmptyQuestionsState, 
    Button, 
    AddQuestionPanel 
} from "../components";
import toast from "react-hot-toast";
import {
    getAllQuestionsService,
    deleteQuestionService,
    uploadQuestionService
} from "../services/question.services";
import {
    bulkAddQuestions,
} from "../services/collection.service";
import { 
    Search, 
    Filter, 
    Plus, 
    Trash2, 
    Layers, 
    RefreshCcw,
    X
} from "lucide-react";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [openAddQuestionPanel, setOpenAddQuestionPanel] = useState(false);
    const [openAddToCollection, setOpenAddToCollection] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    
    // Local state for client-side search
    const [searchTerm, setSearchTerm] = useState("");
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // 1. Client-side filtering for Title (Fast & Static)
    // Note: Assuming 'q' structure might be direct or nested based on your previous input. 
    // If 'q' has 'title' directly, use q.title. If it's q.question.title, use that.
    // Based on your previous QuestionRow props, it seemed to be 'q.title'.
    const filteredQuestions = questions.filter(q => 
        (q.title || q.question?.title)?.toLowerCase().includes(normalizedSearch)
    );

    const hasActiveFilters = ["difficulty", "platform", "topic"].some(k => searchParams.get(k));
    const activeFilterCount = ["difficulty", "platform", "topic"].filter(k => searchParams.get(k)).length;

    const fetchQuestions = async () => {
        setLoading(true);
        // We only send backend filters (difficulty, platform, topic), NOT search
        const params = {};
        ["difficulty", "platform", "topic"].forEach(key => {
            const val = searchParams.get(key);
            if (val) params[key] = val;
        });

        const data = await getAllQuestionsService(params);
        setQuestions(data.questions);
        setLoading(false);
    };

    // Refetch only when backend filters change
    useEffect(() => {
        fetchQuestions();
    }, [searchParams]);

    // Update URL params helper
    const updateParams = (patch) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        setSearchParams(params);
    };

    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === filteredQuestions.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredQuestions.map(q => q._id)));
        }
    };

    const handleConfirmAddToCollection = async (collectionId) => {
        try {
            await bulkAddQuestions(collectionId, [...selected]);
            setSelected(new Set());
            toast.success("Questions added to collection");
        } catch (error) {
            toast.error("Failed to add questions");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selected.size} selected questions?`)) return;
        try {
            await Promise.all([...selected].map(deleteQuestionService));
            setSelected(new Set());
            fetchQuestions();
            toast.success("Questions deleted successfully")
        } catch (error) {
            toast.error("Failed to delete questions")
        }
    };

    const deleteQuestionHandler = async (questionId) => {
        try {
            await deleteQuestionService(questionId)
            toast.success("Question deleted")
            fetchQuestions()
        } catch (error) {
            toast.error("Failed to delete question")
        }
    }

    const handleUploadQuestion = async (formData) => {
        try {
            const uploadedQuestion = await uploadQuestionService(formData)
            setQuestions(prev => [
                {...uploadedQuestion , topics : uploadedQuestion.topics || [],},
                ...prev,
            ]);
            toast.success("Question created")
            setOpenAddQuestionPanel(false);
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("This question already exists");
            } else {
                toast.error("Failed to Upload question");
            }
        }
    }

    return (
    <main className="min-h-screen bg-slate-950 px-4 pt-10 pb-20 text-white selection:bg-red-500/30">
        
        {/* Background Texture */}
        <div className="fixed inset-0 pointer-events-none">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">

            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Question Bank</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage and organize your coding problems.</p>
                </div>

                <div className="flex items-center gap-3">
                    {selected.size > 0 && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-sm font-medium text-red-400">{selected.size} Selected</span>
                            <div className="h-4 w-[1px] bg-red-500/20 mx-1"></div>
                            <button onClick={() => setOpenAddToCollection(true)} className="p-1 hover:bg-red-500/20 rounded text-red-400" title="Add to Collection">
                                <Layers size={18} />
                            </button>
                            <button onClick={handleBulkDelete} className="p-1 hover:bg-red-500/20 rounded text-red-400" title="Delete Selected">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}

                    <Button variant="primary" onClick={() => setOpenAddQuestionPanel(true)} className="shadow-lg shadow-red-900/20">
                        <Plus size={18} className="mr-2" /> Add Question
                    </Button>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
                
                {/* Search Input (Local State) */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    
                    <div className="h-8 w-[1px] bg-slate-800 hidden md:block"></div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm mr-1">
                        <Filter size={16} /> Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>

                    <select
                        value={searchParams.get("difficulty") || ""}
                        onChange={(e) => updateParams({ difficulty: e.target.value })}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500 cursor-pointer hover:bg-slate-900 transition-colors"
                    >
                        <option value="">Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select
                        value={searchParams.get("platform") || ""}
                        onChange={(e) => updateParams({ platform: e.target.value })}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500 cursor-pointer hover:bg-slate-900 transition-colors"
                    >
                        <option value="">Platform</option>
                        <option>LeetCode</option>
                        <option>GFG</option>
                        <option>Codeforces</option>
                    </select>

                    <div className="relative">
                         <input 
                            placeholder="Topic..." 
                            value={searchParams.get("topic") || ""}
                            onChange={(e) => updateParams({ topic: e.target.value })}
                            className="w-32 bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button 
                            onClick={() => setSearchParams({})}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto md:ml-0"
                            title="Reset Filters"
                        >
                            <RefreshCcw size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* QUESTIONS LIST */}
            {loading ? (
                <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-16 bg-slate-900/50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredQuestions.length === 0 ? (
                // Determine if empty because of filters/search OR genuinely empty
                (hasActiveFilters || searchTerm) ? (
                    <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No matching questions</h3>
                        <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => {
                                setSearchParams({});
                                setSearchTerm("");
                            }}
                            className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <EmptyQuestionsState onAdd={() => setOpenAddQuestionPanel(true)} />
                )
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_2fr_1fr] gap-4 px-6 py-3 bg-slate-950/50 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="w-6">
                             <input 
                                type="checkbox" 
                                checked={selected.size === filteredQuestions.length && filteredQuestions.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-slate-700 bg-slate-900 focus:ring-red-500/50 text-red-600"
                            />
                        </div>
                        <div>Question</div>
                        <div className="hidden md:block">Tags</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-800/50">
                        {filteredQuestions.map((q, index) => (
                            <QuestionRow
                                key={q._id}
                                q={q}
                                index={index}
                                isSelected={selected.has(q._id)}
                                onSelect={() => toggleSelect(q._id)}
                                removeQuestion={() => deleteQuestionHandler(q._id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ADD PANEL */}
            {openAddQuestionPanel && (
                <AddQuestionPanel
                    open={openAddQuestionPanel}
                    onClose={() => setOpenAddQuestionPanel(false)}
                    onSubmit={handleUploadQuestion}
                />
            )}

            <AddToCollectionModal
                open={openAddToCollection}
                onClose={() => setOpenAddToCollection(false)}
                onConfirm={handleConfirmAddToCollection}
            />
        </div>
    </main>
    );
}

export default Questions;

