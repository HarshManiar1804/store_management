/**
 * Store Management Page Component
 * 
 * This component provides a complete interface for managing store data including:
 * - Viewing a paginated list of stores
 * - Adding new stores via a drawer form
 * - Deleting existing stores
 * - Searching stores by name
 * - Pagination controls
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { iStore, iStoreFormData, } from '@/lib/utils';

// API base URL - should be in environment variable in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Store = () => {
    // State management for store data and UI controls
    const [allStores, setAllStores] = useState<iStore[]>([]); // Stores all store data from API
    const [loading, setLoading] = useState(true); // Tracks loading state for API calls
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Controls add store drawer visibility
    const [searchQuery, setSearchQuery] = useState(''); // Stores search input for filtering
    const itemsPerPage = 10; // Number of stores to display per page

    // Form handling with react-hook-form
    const { register, handleSubmit, reset, formState: { errors } } = useForm<iStoreFormData>();

    // Calculate total pages based on filtered stores for pagination
    const filteredStores = useMemo(() => {
        return allStores.filter(store =>
            store.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allStores, searchQuery]);

    // Calculate total pages based on filtered stores
    const totalPages = useMemo(() => {
        return Math.ceil(filteredStores.length / itemsPerPage);
    }, [filteredStores, itemsPerPage]);

    // Load stores data on component mount
    useEffect(() => {
        fetchStores();
    }, []);

    /**
     * Fetches all stores from the API
     * Sets loading state during API call and updates store data on success
     */
    const fetchStores = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/stores`);
            setAllStores(data.stores || data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Creates a new store by sending data to the API
     * @param storeData - The store data to be created
     * @returns The response data from the API
     */
    const createStore = useCallback(async (storeData: iStoreFormData) => {
        try {
            const response = await axios.post(`${API_URL}/stores`, storeData);
            toast.success('Store added successfully');
            return response.data;
        } catch (error) {
            console.error('Error adding store:', error);
            throw new Error('Failed to add store');
        }
    }, []);

    /**
     * Handles form submission for creating a new store
     * Calls createStore with form data and refreshes the store list on success
     * @param data - The form data from react-hook-form
     */
    const onSubmit = useCallback(async (data: iStoreFormData) => {
        try {
            await createStore(data);
            setIsDrawerOpen(false);
            reset();
            fetchStores();
        } catch (error) {
            toast.error('Failed to add store');
        }
    }, [createStore, fetchStores, reset]);

    /**
     * Deletes a store by ID
     * Refreshes the store list after successful deletion
     * @param id - The ID of the store to delete
     */
    const handleDelete = useCallback(async (id: string) => {
        try {
            await axios.delete(`${API_URL}/stores/${id}`);
            // Refresh the stores list after deletion
            fetchStores();
            toast.success('Store deleted successfully');
        } catch (error) {
            console.error('Error deleting store:', error);
            toast.error('Failed to delete store');
        }
    }, [fetchStores]);

    /**
     * Filters and paginates store data for the current page
     * @returns Array of stores for the current page
     */
    const getCurrentPageData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStores.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStores, currentPage, itemsPerPage]);

    /**
     * Updates the current page for pagination
     * @param page - The page number to navigate to
     */
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Show loading indicator while fetching data
    if (loading) {
        return <div>Loading stores...</div>;
    }

    return (
        <div className="space-y-3">
            {/* Page title */}
            <h2 className="text-2xl font-bold">Stores</h2>
            
            {/* Search and Add Store controls */}
            <div className="flex justify-between items-center mb-4">
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search stores..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Add Store Drawer */}
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button className='cursor-pointer'>Add New Store</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DrawerHeader>
                                <DrawerTitle>Add New Store</DrawerTitle>
                                <DrawerDescription>
                                    Fill in the details to add a new store.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                                {/* Store ID field */}
                                <div className="space-y-2">
                                    <Label htmlFor="id">Store ID</Label>
                                    <Input
                                        id="id"
                                        {...register("id", { required: "Store ID is required" })}
                                        placeholder="Enter store ID"
                                    />
                                    {errors.id && (
                                        <p className="text-sm text-red-500">{errors.id.message}</p>
                                    )}
                                </div>
                                
                                {/* Store Name field */}
                                <div className="space-y-2">
                                    <Label htmlFor="label">Store Name</Label>
                                    <Input
                                        id="label"
                                        {...register("label", { required: "Store name is required" })}
                                        placeholder="Enter store name"
                                    />
                                    {errors.label && (
                                        <p className="text-sm text-red-500">{errors.label.message}</p>
                                    )}
                                </div>
                                
                                {/* City field */}
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        {...register("city", { required: "City is required" })}
                                        placeholder="Enter city"
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500">{errors.city.message}</p>
                                    )}
                                </div>
                                
                                {/* State field */}
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        {...register("state", { required: "State is required" })}
                                        placeholder="Enter state"
                                    />
                                    {errors.state && (
                                        <p className="text-sm text-red-500">{errors.state.message}</p>
                                    )}
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button type="submit" className='cursor-pointer'>Add Store</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" type="button" className='cursor-pointer'>Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>
            
            {/* Stores Table */}
            <Table>
                <TableCaption>List of Available Stores</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Store ID</TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>State</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getCurrentPageData.map((store: iStore, index: number) => (
                        <TableRow key={store.id}>
                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                            <TableCell className="font-medium">{store.id}</TableCell>
                            <TableCell>{store.label}</TableCell>
                            <TableCell>{store.city}</TableCell>
                            <TableCell>{store.state}</TableCell>
                            <TableCell>
                                <Button className='cursor-pointer'
                                    // variant="destructive"
                                    onClick={() => handleDelete(store.id)}
                                >
                                    <X />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='cursor-pointer'
                >
                    Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        onClick={() => handlePageChange(index + 1)}
                        className='cursor-pointer'
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Store;