import { useState, useRef , useEffect} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, Input } from "../components";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateContestModal, CreateCollectionModal, EmptyState, CollectionCard } from '../components';
import { createCollection, getMyCollections, deleteCollection } from "../services/collection.service";
import toast from "react-hot-toast";
import { createContestService } from '../services/contest.services';
import { Search, Plus, Layers, FolderOpen } from "lucide-react";

function Collections() {
  
    const containerRef = useRef(null);
    const createRef = useRef(null);
    const listRef = useRef(null);

    const [showCreate, setShowCreate] = useState(false);
    const [collections, setCollections] = useState([]);
    const [search, setSearch] = useState("");
  
    const [openContestModal, setOpenContestModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    const navigate = useNavigate();

    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");

    useEffect(() => {
      (async () => {
        const response = await getMyCollections();
        setCollections(response);
      })();
    },[]);

    useEffect(() => {
      if (action === "create") {
        createRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowCreate(true); // Auto-open modal if action is create
      } else {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [action]);


    const handleCreateCollection = async (data) => {
      try {
          const newCollection = await createCollection(data);
          setCollections((prev) => [newCollection, ...prev]);
          setShowCreate(false);
          toast.success("Collection created successfully");
      } catch (error) {
          console.log(error);
          toast.error("Failed to create new collection. Please try again");
      }
    }

    const handleDeleteCollection = async (collectionId) => {
      try {
        await deleteCollection(collectionId);
        setCollections((prev) =>
          prev.filter((c) => c._id !== collectionId)
        );
        toast.success("Collection deleted successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete the collection. Please try again");
      }
    }

    const handleCreateContestClick = (collection) => {
        setSelectedCollection(collection);
        setOpenContestModal(true);
    };

    const handleCreateContest = async (data) => {
        const contest = await createContestService(data);
        if (contest.visibility === "private") {
          navigate(`/user/contests/private/${contest._id}`);
        } else {
          navigate(`/user/contests/public/${contest._id}`);
        }
        setOpenContestModal(false);
    };

    useGSAP(() => {
        gsap.from(containerRef.current.children, {
          opacity: 0,
          y: 25,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
        });
    }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-slate-950 px-4 md:px-6 pt-20 md:pt-24 pb-10 selection:bg-red-500/30">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6" ref={createRef}>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Layers size={24} />
                </div>
                <h1 className="text-3xl font-bold text-white">Collections</h1>
            </div>
            <p className="text-slate-400 max-w-lg">
              Curate your personal problem sets. Use them to practice specific topics or host contests for your friends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                <input
                    placeholder="Search collections..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
            </div>

            <Button 
                variant="secondary" 
                onClick={() => setShowCreate(true)}
                className="whitespace-nowrap shadow-lg shadow-blue-900/20"
            >
              <Plus size={18} className="mr-2" /> New Collection
            </Button>
          </div>
        </section>

        {/* COLLECTIONS GRID */}
        {collections.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : filteredCollections.length === 0 ? (
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
              <p className="text-slate-400">No collections match your search.</p>
           </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={listRef}>
            {filteredCollections.map((c) => (
              <CollectionCard 
                key={c._id} 
                collection={c} 
                onCreateContest={handleCreateContestClick} 
                onDelete={handleDeleteCollection}
              />
            ))}
          </section>
        )}

      </div>

      {/* MODALS */}
      {showCreate && (
        <CreateCollectionModal 
            onCreate={handleCreateCollection}
            onClose={() => setShowCreate(false)} 
        />
      )}

      <CreateContestModal
        open={openContestModal}
        collection={selectedCollection}
        onClose={() => setOpenContestModal(false)}
        onSubmit={handleCreateContest}
      />

    </div>
  );
}

export default Collections;