export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Settings</h1>
      
      <div className="bg-white p-6 rounded-md border border-border max-w-2xl">
        <h2 className="text-xl font-bold text-navy mb-4">Profile Settings</h2>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-navy mb-1">Display Name</label>
                <input type="text" className="w-full p-2 border border-border rounded-md" defaultValue="User Name" />
            </div>
            <div>
                <label className="block text-sm font-medium text-navy mb-1">Email</label>
                <input type="email" className="w-full p-2 border border-border rounded-md" defaultValue="user@example.com" disabled />
            </div>
             <button className="bg-navy text-white px-4 py-2 rounded-md font-medium">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
