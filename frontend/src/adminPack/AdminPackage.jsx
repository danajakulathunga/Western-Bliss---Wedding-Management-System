import { useState, useEffect } from "react";

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editPackage, setEditPackage] = useState({ 
        packageName: "", 
        price: "", 
        description: "", 
        image: "" 
    });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [newPackage, setNewPackage] = useState({
        pckCode: "",
        packageName: "",
        price: "",
        description: "",
        image: "",
    });

    // Fetch packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getpck");
                const data = await response.json();
                if (data.success) setPackages(data.data);
                else setError("Failed to load packages");
            } catch (err) {
                console.error("Error fetching packages:", err);
                setError("Error fetching packages");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    // Delete Package
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this package?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/deletepck/${id}`, { 
                method: "DELETE" 
            });
            const data = await response.json();
            if (data.success) setPackages(packages.filter((pkg) => pkg._id !== id));
            else alert("Failed to delete package");
        } catch (err) {
            console.error("Error deleting package:", err);
            alert("Error deleting package");
        }
    };

    // Open Edit Modal
    const handleEdit = (id) => {
        const pkg = packages.find((p) => p._id === id);
        setEditPackage(pkg);
        setEditingId(id);
        setShowEditModal(true);
    };

    // Save Edit
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/updatepck/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editPackage),
            });

            const data = await response.json();
            if (data.success) {
                setPackages(packages.map((pkg) => (pkg._id === editingId ? data.data : pkg)));
                setShowEditModal(false);
            } else {
                alert("Failed to update package");
            }
        } catch (err) {
            console.error("Error updating package:", err);
            alert("Error updating package");
        }
    };

    // Add New Package
    const handleAddPackage = async () => {
        if (!newPackage.pckCode || !newPackage.packageName || !newPackage.price || 
            !newPackage.description || !newPackage.image) {
            alert("Please fill all fields!");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/addPack", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPackage),
            });
            const data = await response.json();
            if (data.success) {
                setPackages([...packages, data.data]);
                setShowModal(false);
                setNewPackage({ 
                    pckCode: "", 
                    packageName: "", 
                    price: "", 
                    description: "", 
                    image: "" 
                });
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Error adding package:", err);
            alert("Error adding package");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Add Package Button */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-rose-800 font-serif">Wedding Packages Management</h2>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg shadow-md transition flex items-center"
                    >
                        <span className="mr-2">+</span> Add New Package
                    </button>
                </div>

                {/* Package List */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold text-rose-700 mb-6 font-serif">Existing Packages</h3>

                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-rose-600">Loading packages...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-rose-600">No packages found. Add your first package!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {packages.map((pkg) => (
                                <div key={pkg._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg border border-rose-100 shadow-sm hover:shadow-md transition">
                                    <div className="mb-3 md:mb-0">
                                        <h4 className="text-lg font-medium text-rose-800">{pkg.packageName}</h4>
                                        <p className="text-rose-600">Rs. {pkg.price.toLocaleString()}</p>
                                        {pkg.description && (
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">{pkg.description}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEdit(pkg._id)}
                                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-4 py-1 rounded-md text-sm transition"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg._id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-1 rounded-md text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Package Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-rose-800 mb-4">Add New Package</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Package Code</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="PKG001"
                                    value={newPackage.pckCode}
                                    onChange={(e) => setNewPackage({...newPackage, pckCode: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Package Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="Premium Package"
                                    value={newPackage.packageName}
                                    onChange={(e) => setNewPackage({...newPackage, packageName: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Price (Rs.)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="250000"
                                    value={newPackage.price}
                                    onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Description</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    rows="3"
                                    placeholder="Package details..."
                                    value={newPackage.description}
                                    onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="https://example.com/image.jpg"
                                    value={newPackage.image}
                                    onChange={(e) => setNewPackage({...newPackage, image: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddPackage}
                                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                            >
                                Add Package
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Package Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-rose-800 mb-4">Edit Package</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Package Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    value={editPackage.packageName}
                                    onChange={(e) => setEditPackage({...editPackage, packageName: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Price (Rs.)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    value={editPackage.price}
                                    onChange={(e) => setEditPackage({...editPackage, price: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Description</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    rows="3"
                                    value={editPackage.description}
                                    onChange={(e) => setEditPackage({...editPackage, description: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    value={editPackage.image}
                                    onChange={(e) => setEditPackage({...editPackage, image: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPackages;