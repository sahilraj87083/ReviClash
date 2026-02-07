import { useState, useEffect } from "react";
import { 
    AddQuestionPanel, 
    QuestionRow, 
    EmptyQuestionsState 
} from '../components';
import { 
    addQuestionToCollection, 
    getCollectionAllQuestions, 
    removeQuestionFromCollection, 
    getPublicCollectionQuestionsService 
} from "../services/collection.service";
import { useParams, useNavigate } from "react-router-dom";
import { uploadQuestionService } from "../services/question.services";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Search, 
    Globe, 
    Lock, 
    Layers, 
    Calendar, 
    Plus,
    MoreHorizontal
} from "lucide-react";

function CollectionQuestions({ mode = 'owner' }) {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    
    const [openAddQuestionPanel, setOpenAddQuestionPanel] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const normalizedSearch = search.trim().toLowerCase();
    
    // Filter logic handling nested question object
    const filteredQuestions = questions.filter(item =>
        item.question?.title?.toLowerCase().includes(normalizedSearch)
    );

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const service = mode === 'owner' ? getCollectionAllQuestions : getPublicCollectionQuestionsService;
            const response = await service(collectionId);
            
            setQuestions(response.questions || []);
            setCollection(response.collection || {});
        } catch (error) {
            console.error(error);
            toast.error("Failed to load collection");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [collectionId, mode]);

    const handleAddQuestion = async (formData) => {
        try {
            // 1. Upload new question
            const uploadedQuestion = await uploadQuestionService(formData);
            
            // 2. Add to this collection
            await addQuestionToCollection(collectionId, uploadedQuestion._id);

            // 3. Update UI
            setQuestions(prev => [
                { 
                    question: uploadedQuestion, 
                    addedAt: new Date().toISOString(), 
                    order: 0 
                },
                ...prev,
            ]);

            toast.success("Question created and added to collection");
            setOpenAddQuestionPanel(false);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error("This question already exists");
            } else {
                toast.error("Failed to add question");
            }
        }
    };

    const handleRemoveQuestionFromCollection = async (colId, questionId) => {
        try {
            await removeQuestionFromCollection(colId, questionId);
            toast.success("Question removed");
            // Optimistic update
            setQuestions(prev => prev.filter(q => q.question._id !== questionId));
        } catch (error) {
            toast.error("Failed to remove question");
        }
    };

    // Date formatter
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-slate-950 px-4 pt-10 pb-20 text-white selection:bg-red-500/30">
            
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Collection Icon / Cover */}
                    <div className="w-full md:w-48 h-32 md:h-48 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                        <Layers size={64} className="text-slate-600" strokeWidth={1} />
                    </div>

                    {/* Meta Data */}
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex items-start justify-between">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-2 md:mb-0"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Back
                            </button>
                            
                            {/* Visibility Badge */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${collection.isPublic ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                                {collection.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                                {collection.isPublic ? "Public" : "Private"}
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                                {collection.name}
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                {collection.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-500 pt-2">
                            <div className="flex items-center gap-2">
                                <Layers size={16} />
                                <span className="text-slate-300 font-medium">{questions.length} Questions</span>
                            </div>
                            {collection.updatedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Updated {formatDate(collection.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- ACTIONS BAR --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
                    
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Search in this collection..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Add Button (Owner Only) */}
                    {mode === 'owner' && (
                        <button
                            onClick={() => setOpenAddQuestionPanel(true)}
                            className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Add New Question
                        </button>
                    )}
                </div>

                {/* --- QUESTIONS LIST --- */}
                <div className="space-y-4 min-h-[400px]">
                    {isLoading ? (
                         <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-16 bg-slate-900/50 rounded-lg animate-pulse"></div>
                            ))}
                         </div>
                    ) : filteredQuestions.length === 0 ? (
                        <EmptyQuestionsState onAdd={() => setOpenAddQuestionPanel(true)} />
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                            <div className="divide-y divide-slate-800/50">
                                {filteredQuestions.map((item, index) => (
                                    <QuestionRow 
                                        key={item.question?._id || index} 
                                        q={item.question} // Pass nested question object
                                        index={index} 
                                        removeQuestion={() => handleRemoveQuestionFromCollection(collectionId, item.question._id)}
                                        mode={mode} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {openAddQuestionPanel && (
                <AddQuestionPanel
                    open={openAddQuestionPanel}
                    onClose={() => setOpenAddQuestionPanel(false)}
                    onSubmit={handleAddQuestion}
                />
            )}
        </main>
    );
}

export default CollectionQuestions;