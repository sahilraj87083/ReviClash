import { useNavigate } from "react-router-dom";
import {Button} from '../'


function CollectionCard({ collection, onCreateContest, onDelete }) {

  const navigate = useNavigate();
  return (
    <div
      className="relative p-5 rounded-xl border border-slate-800
      bg-slate-900/60 hover:border-red-500/40
      transition flex flex-col justify-between"
    >
      {/* Delete Button */}
      <Button
        onClick={() => onDelete(collection._id)}
        className="absolute top-3 right-3 text-slate-400 transition"
        title="Delete collection"
      >
        <i className="ri-delete-bin-5-line text-lg hover:text-black"></i>
      </Button>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold mb-1 text-white">
          {collection.name}
        </h3>

        <p className="text-slate-400 text-sm line-clamp-2">
          {collection.description || "No description"}
        </p>

        <div className="mt-3 flex gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 bg-slate-800 rounded">
            {collection.questionsCount} Questions
          </span>
          <span className="px-2 py-0.5 bg-slate-800 rounded">
            {collection.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/collections/${collection._id}/questions`)}
          className="flex-1 text-center px-3 py-2 text-white
          border border-slate-700 rounded-md hover:text-slate-200
          text-sm hover:border-white transition"
        >
          View
        </Button>

        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/user/questions?collectionId=${collection._id}`)}
        >
          Import Questions
        </Button>
        <Button
          onClick={() => onCreateContest(collection)}
          className="flex-1 px-3 py-2 text-white
          bg-red-600 hover:bg-red-500
          rounded-md text-sm font-semibold transition"
        >
          Create Contest
        </Button>

      </div>
    </div>
  );
}


export default CollectionCard;
