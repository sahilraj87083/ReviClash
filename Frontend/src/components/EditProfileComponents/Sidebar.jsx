function Sidebar({ active, setActive }) {
    const items = [
        { id: "profile", label: "Profile" },
        { id: "account", label: "Account" },
        { id: "security", label: "Security" },
        { id: "email", label: "Email" },
        { id: "danger", label: "Danger Zone" },
    ];

    return (
        <div className="w-64 border-r border-slate-800 p-6 my-10 space-y-2">
        {items.map(i => (
            <button
            key={i.id}
            onClick={() => setActive(i.id)}
            className={`block w-full text-left px-3 py-2 rounded
                ${active === i.id ? "bg-red-600" : "hover:bg-slate-800"}`}
            >
            {i.label}
            </button>
        ))}
        </div>
    );
}

export default Sidebar;
