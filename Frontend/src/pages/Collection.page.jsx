import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, Input, } from "../components";
import { useNavigate } from "react-router-dom";
import {CreateContestModal, CreateCollectionModal, EmptyState, CollectionCard} from '../components'

function Collections() {
    const containerRef = useRef(null);
    const [showCreate, setShowCreate] = useState(false);
  
    const [openContestModal, setOpenContestModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const handleCreateContestClick = (collection) => {
        setSelectedCollection(collection);
        setOpenContestModal(true);
    };

    const handleCreateContest = async (data) => {
        await createContest(data); // POST /contests
        setOpenContestModal(false);
    };


    // mock data
    const collections = [
        {
            id: "1",
            name: "DSA Core",
            description: "Must-do DSA questions",
            questionsCount: 120,
            isPublic: false,
        },
        {
            id: "2",
            name: "Binary Search",
            description: "Binary search patterns",
            questionsCount: 45,
            isPublic: true,
        },
    ];

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
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Collections
            </h1>
            <p className="text-slate-400">
              Organize questions and create contests from them.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowCreate(true)}
          >
            + Create Collection
          </Button>
        </section>

        {/* COLLECTIONS GRID */}
        {collections.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </section>
        )}

      </div>

      {/* CREATE COLLECTION MODAL */}
      {showCreate && (
        <CreateCollectionModal onClose={() => setShowCreate(false)} />
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


