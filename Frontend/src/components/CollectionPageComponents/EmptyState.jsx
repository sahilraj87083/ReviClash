import {Button} from '../'

function EmptyState({ onCreate }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-10 text-center">
      <h3 className="text-xl font-semibold text-white">
        No collections yet
      </h3>
      <p className="text-slate-400 mt-2">
        Create your first collection to start organizing questions.
      </p>
      <Button
        variant="primary"
        className="mt-6"
        onClick={onCreate}
      >
        Create Collection
      </Button>
    </div>
  );
}

export default EmptyState