import { ExternalLink } from "lucide-react";
import {Button} from '../'
import { useParams } from "react-router-dom";


function QuestionRow({ q , index, removeQuestion , mode = 'owner' }) {
  // console.log(q)
  const {collectionId} = useParams()

  const HandleRemove = async (e) => {
    await removeQuestion(collectionId, q._id)
  }


  return (
    <div
      className="flex items-center justify-between
      p-3 rounded-lg
      bg-slate-800/60 border border-slate-700
      hover:border-red-500/40 hover:bg-slate-800
      transition"
    >
      {/* LEFT */}
      <div className="flex items-start gap-4">

        {/* Index */}
        <span className="text-slate-500 w-6">
          {index + 1}.
        </span>

        {/* Title & Meta */}
        <div>
          <h3 className="font-semibold text-lg">
            {q.title}
          </h3>

          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className={difficultyBadge(q.difficulty)}>
              {q.difficulty}
            </span>

            <span className="px-2 py-0.25 rounded bg-slate-700">
              {q.platform}
            </span>

            {q.topics.map((t) => (
              <span
                key={t}
                className="px-2 py-0.25 rounded bg-slate-700/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-5">
        
        <a
          href={q.problemUrlOriginal}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2
          px-4 py-2 rounded-md
          bg-green-600 hover:bg-green-500
          text-sm font-semibold transition"
        >
          Solve
          <ExternalLink size={16} />
        </a>

        {mode === 'owner' && <Button 
        onClick = {(e) => {
          HandleRemove(e)
        }}
        variant = "primary" size = 'sm'>
          <i className="ri-delete-bin-2-line"></i>
          <p>Remove</p>
        </Button>}

      </div>
    </div>
  );
}

function difficultyBadge(difficulty) {
  switch (difficulty) {
    case "easy":
      return "px-2 py-0.5 rounded bg-green-500/20 text-green-400";
    case "medium":
      return "px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400";
    case "hard":
      return "px-2 py-0.5 rounded bg-red-500/20 text-red-400";
    default:
      return "";
  }
}

export default QuestionRow;
