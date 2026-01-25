import { useState, useRef , useEffect} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, Input, } from "../components";
import { useNavigate, useLocation } from "react-router-dom";
import {CreateContestModal, CreateCollectionModal, EmptyState, CollectionCard} from '../components'
import { createCollection, getMyCollections, deleteCollection } from "../services/collection.service";
import toast from "react-hot-toast";
import {createContestService} from '../services/contest.services'

function Collections() {
  
    const containerRef = useRef(null);
    const createRef = useRef(null);
    const listRef = useRef(null);

    const [showCreate, setShowCreate] = useState(false);
    const [collections, setCollections] = useState([])
    const [search, setSearch] = useState("");
  
    const [openContestModal, setOpenContestModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    const navigate = useNavigate()

    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");

    useEffect(() => {
      (async () => {
        const response = await getMyCollections()
        setCollections(response)
      })()
    },[])

    useEffect(() => {
      if (action === "create") {
        createRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [action]);


    const handleCreateCollection = async (data) => {
      try {
          const newCollection = await createCollection(data)
          setCollections((prev) => [newCollection, ...prev]);
          setShowCreate(false)
          toast.success("Collection created successfully")
      } catch (error) {
          console.log(error)
          toast.error("Failed to create new collection. Please try again")
      }
    }

    const handleDeleteCollection = async (collectionId) => {
      try {
        await deleteCollection(collectionId)
        setCollections((prev) =>
          prev.filter((c) => c._id !== collectionId)
        );
        toast.success("Collection deleted successfully")
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete the collection. Please try again")
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


    useGSAP(
      () => {
        gsap.from(containerRef.current.children, {
          opacity: 0,
          y: 25,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
        });
      },
      { scope: containerRef }
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" ref={createRef}>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Collections
            </h1>
            <p className="text-slate-400">
              Organize questions and create contests from them.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search collections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />

            <Button variant="primary" onClick={() => setShowCreate(true)}>
              + New Collection
            </Button>
          </div>
        </section>

        {/* COLLECTIONS GRID */}
        {collections.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={listRef}>
            {filteredCollections.map((c) => (
              <CollectionCard key={c._id} collection={c} onCreateContest = {handleCreateContestClick} onDelete={handleDeleteCollection}/>
            ))}
          </section>
        )}

      </div>

      {/* CREATE COLLECTION MODAL */}
      {showCreate && (
        <CreateCollectionModal 
        onCreate = {handleCreateCollection}
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


