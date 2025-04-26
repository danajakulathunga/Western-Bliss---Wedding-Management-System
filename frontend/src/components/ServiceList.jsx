import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import ServiceFilter from "./ServiceFilter"; // Import the enhanced filter component

const ServiceList = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch services from backend
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/services");
                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }
                const data = await response.json();
                setServices(data);
                setFilteredServices(data); // Initialize filtered services with all services
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [refreshTrigger]);

    // Delete service function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/services/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete service");
            }

            const updatedServices = services.filter((service) => service._id !== id);
            setServices(updatedServices);
            setFilteredServices(updatedServices);
            alert("Service deleted successfully!");
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service.");
        }
    };

    // Update service function
    const handleUpdate = async () => {
        try {
            // Note: The actual API call is handled in the ServiceCard component
            // This function is passed down to trigger a refresh of the service list
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error updating service:", error);
        }
    };

    // Function to handle navigation to the add service page
    const navigateToAddService = () => {
        navigate("/add-service"); // Make sure this matches your route configuration
    };

    return (
        <div className="min-w-300 bg-gradient-to-b from-pink-200 to-pink-100 p-4 rounded-lg">
        {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/floral-corner.png')" }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-contain bg-no-repeat transform rotate-90" style={{ backgroundImage: "url('/floral-corner.png')" }}></div>

            {/* Header with elegant styling */}
            <div className="text-center mb-6">
                <h2 className="text-5xl font-serif text-rose-800 mb-2 italic">Wedding Services</h2>
                <div className="w-64 h-1 bg-rose-300 mx-auto"></div>
                <p className="text-gray-600 mt-3 text-2xl font-light">Find the perfect services for your special day</p>
            </div>

            {/* Filter Component */}
            {!loading && services.length > 0 && (
                <ServiceFilter
                    services={services}
                    setFilteredServices={setFilteredServices}
                />
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                </div>
            ) : (
                <>
                    {/* Service Count */}
                    <div className="text-center mb-6">
                        <p className="text-pink-600 font-serif">
                            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                        </p>
                    </div>

                    {/* Service Grid using ServiceCard component */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mx-auto max-w-6xl">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <ServiceCard
                                    key={service._id}
                                    service={service}
                                    onDelete={handleDelete}
                                    onUpdate={handleUpdate}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 bg-white bg-opacity-70 rounded-lg">
                                <p className="text-gray-600 text-xl font-light">
                                    {services.length > 0
                                        ? "No services found in this category."
                                        : "No services found."}
                                </p>
                                <button
                                    className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-md"
                                    onClick={navigateToAddService}
                                >
                                    Add a New Service
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Action Buttons */}
            <div className="mt-12 text-center">
                <button
                    className="px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 font-medium mr-4"
                    onClick={navigateToAddService}
                >
                    Add New Service
                </button>
                <button
                    className="px-8 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 font-medium"
                    onClick={() => navigate("/dashboard")}
                >
                    Return to Dashboard
                </button>
            </div>

            {/* Decorative footer element */}
            <div className="h-12 w-full flex justify-center mt-16">
                <div className="w-64 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            </div>
        </div>
    );
};

export default ServiceList;