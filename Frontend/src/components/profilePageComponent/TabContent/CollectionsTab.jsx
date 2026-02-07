import { CollectionCard } from '../../index'

function CollectionsTab({ collections }) {
  // if(!collections) return 
  console.log(collections)

  if ( !collections.length) {
    return <p className="text-slate-400">No public collections</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {collections?.map(c => (
        <CollectionCard key={c._id} collection={c} mode="public" />
      ))}
    </div>
  );
}

export {
    CollectionsTab
}