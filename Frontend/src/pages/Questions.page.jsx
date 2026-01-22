import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Input, AddQuestionPanel } from "../components";
import {QuestionRow, AddToCollectionModal} from "../components";
import toast from "react-hot-toast";
import {
    getAllQuestionsService,
    deleteQuestionService,
    uploadQuestionService
} from "../services/question.services";
import {
    bulkAddQuestions,
    bulkRemoveQuestions,
} from "../services/collection.service";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [openAddQuestionPanel, setOpenAddQuestionPanel] = useState(false);
    const [openAddToCollection, setOpenAddToCollection] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const collectionId = searchParams.get("collectionId"); // optional

    const fetchQuestions = async () => {
        setLoading(true);
        const data = await getAllQuestionsService(Object.fromEntries(searchParams));
        setQuestions(data.questions);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuestions();
    }, [searchParams.toString()]);

    const updateParams = (setSearchParams, searchParams, patch) => {
        setSearchParams({
            ...Object.fromEntries(searchParams),
            ...patch,
        });
    };


    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
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


    const handleBulkAdd = async () => {
        await bulkAddQuestions(collectionId, [...selected]);
        setSelected(new Set());
    };

    const handleBulkDelete = async () => {
        if (!confirm("Delete selected questions?")) return;
        await Promise.all([...selected].map(deleteQuestionService));
        setSelected(new Set());
        fetchQuestions();
    };

    const deleteQuestionHandler = async (questionId) => {
        await deleteQuestionService(questionId)
        await fetchQuestions()
    }

    const handleUploadQuestion = async (formData) => {
        try {
            const uploadedQuestion = await uploadQuestionService(formData)
            setQuestions(prev => [
                {...uploadedQuestion , topics : uploadedQuestion.topics || [],},
                ...prev,
            ]);
            toast.success("Question uploaded successfully")
        } catch (error) {
            console.error("Add question failed:", error);
            toast.error('Failed to upload question')
        }
        setOpenAddQuestionPanel(false);
    }

    return (
    <main className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4">

            {/* Add */}
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-5">
                <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setOpenAddQuestionPanel(true)}>
                    + Add Question
                </Button>

                {selected.size > 0 && (
                    <Button
                        variant="secondary"
                        onClick={() => setOpenAddToCollection(true)}
                    >
                        Add to Collection
                    </Button>
                    )
                }

                </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-3 justify-center bg-slate-800/60 p-3 rounded-lg">
                <Input
                    placeholder="Search questions..."
                    value={searchParams.get("search") || ""}
                    onChange={(e) =>
                        updateParams(setSearchParams, searchParams, {
                        search: e.target.value,
                        page: 1,
                        })
                    }
                    className="w-full md:w-72"
                />
                <select
                value={searchParams.get("difficulty") || ""}
                onChange={(e) =>
                    updateParams(setSearchParams, searchParams, {
                    difficulty: e.target.value,
                    page: 1,
                    })
                }
                className="bg-slate-900 border border-slate-700 p-2 rounded"
                >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                </select>

                <select
                value={searchParams.get("platform") || ""}
                onChange={(e) =>
                    updateParams(setSearchParams, searchParams, {
                    platform: e.target.value,
                    page: 1,
                    })
                }
                className="bg-slate-900 border border-slate-700 p-2 rounded"
                >
                <option value="">All Platforms</option>
                <option>LeetCode</option>
                <option>GFG</option>
                <option>Codeforces</option>
                <option>Other</option>
                </select>

                <Input
                placeholder="Topics (comma separated)"
                value={searchParams.get("topic") || ""}
                onChange={(e) =>
                    updateParams(setSearchParams, searchParams, {
                    topic: e.target.value,
                    page: 1,
                    })
                }
                className="w-60"
                />

                <Button
                variant="ghost"
                onClick={() => setSearchParams({})}
                >
                Reset
                </Button>
            </div>
        </div>


        {/* BULK BAR */}
        {selected.size > 0 && (
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-md">
            <p className="text-sm text-slate-300">
                {selected.size} selected
            </p>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                Delete Questions
            </Button>
            </div>
        )}

        {/* LIST */}
        {loading ? (
            <p className="text-slate-400">Loading...</p>
        ) : (
            <div className="space-y-3">
            {questions.map((q, index) => (
                <div
                    key={q._id}
                    className={`rounded-lg ${
                        selected.has(q._id) ? "ring-2 ring-red-500" : ""
                    }`}
                    >
                    <div className="flex items-start gap-3 w-full">
                        <input
                        type="checkbox"
                        checked={selected.has(q._id)}
                        onChange={() => toggleSelect(q._id)}
                        className="mt-6 ml-3"
                        />

                        <div className="flex-1">
                        <QuestionRow
                            q={q}
                            index={index}
                            removeQuestion={() => {deleteQuestionHandler(q._id)}}
                        />
                        </div>
                    </div>
                    </div>

            ))}
            </div>
        )}

            {/* ADD PANEL */}
            {openAddQuestionPanel && (
            <AddQuestionPanel
                open={openAddQuestionPanel}
                onClose={() => setOpenAddQuestionPanel(false)}
                onSubmit = {handleUploadQuestion}
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
