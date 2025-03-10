/**
 * SKUs Management Page Component
 * 
 * This component provides a complete interface for managing SKU (Stock Keeping Unit) data including:
 * - Viewing a paginated list of SKUs
 * - Adding new SKUs via a drawer form
 * - Deleting existing SKUs
 * - Searching SKUs by name
 * - Pagination controls
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
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
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { iSKUFormData, iSKU } from '@/lib/utils';


// API base URL - should be in environment variable in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const SKUs = () => {
    // State management for SKU data and UI controls
    const [allSKUs, setAllSKUs] = useState<iSKU[]>([]); // Stores all SKU data from API
    const [loading, setLoading] = useState(true); // Tracks loading state for API calls
    const [submitting, setSubmitting] = useState(false); // Tracks form submission state
    const [deleting, setDeleting] = useState<string | null>(null); // Tracks which SKU is being deleted
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [searchQuery, setSearchQuery] = useState(''); // Stores search input for filtering
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Controls add SKU drawer visibility
    const itemsPerPage = 10; // Number of SKUs to display per page


    const debouncedSearchQuery = searchQuery;

    // Form handling with react-hook-form
    const { register, handleSubmit, reset, formState: { errors } } = useForm<iSKUFormData>();

    // Memoize filtered SKUs to avoid recalculation on every render
    const filteredSKUs = useMemo(() => {
        return allSKUs.filter(sku =>
            sku.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [allSKUs, debouncedSearchQuery]);

    // Calculate total pages based on filtered SKUs for pagination
    const totalPages = useMemo(() => {
        return Math.ceil(filteredSKUs.length / itemsPerPage);
    }, [filteredSKUs, itemsPerPage]);

    // Get current page data for rendering - memoized to avoid recalculation
    const currentSKUs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSKUs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSKUs, currentPage, itemsPerPage]);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    /**
     * Fetches all SKUs from the API
     * Sets loading state during API call and updates SKU data on success
     */
    const fetchSKU = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/skus`);
            setAllSKUs(data.skus || data);
        } catch (error) {
            console.error('Error fetching SKU:', error);
            toast.error('Failed to load SKUs. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load SKUs data on component mount
    useEffect(() => {
        fetchSKU();
    }, [fetchSKU]);

    /**
     * Creates a new SKU by sending data to the API
     * @param skuData - The SKU data to be created
     * @returns The response data from the API
     */
    const createSKU = useCallback(async (skuData: iSKUFormData) => {
        try {
            setSubmitting(true);
            const response = await axios.post(`${API_URL}/skus`, skuData);
            toast.success('SKU added successfully');
            return response.data;
        } catch (error) {
            console.error('Error adding SKU:', error);
            toast.error('Failed to add SKU');
            throw error;
        } finally {
            setSubmitting(false);
        }
    }, []);

    /**
     * Handles form submission for creating a new SKU
     * Formats numeric values and calls createSKU with form data
     * Refreshes the SKU list on success
     * @param data - The form data from react-hook-form
     */
    const onSubmit = useCallback(async (data: iSKUFormData) => {
        try {
            const formattedData = {
                ...data,
                price: parseFloat(data.price as unknown as string), // Ensures price is a float
                cost: parseFloat(data.cost as unknown as string)   // Ensures cost is a float
            };

            await createSKU(formattedData);
            setIsDrawerOpen(false);
            reset();
            fetchSKU();
        } catch (error) {
            // Error is already handled in createSKU
        }
    }, [createSKU, fetchSKU, reset]);

    /**
     * Deletes a SKU by ID
     * Refreshes the SKU list after successful deletion
     * @param id - The ID of the SKU to delete
     */
    const handleDelete = useCallback(async (id: string) => {
        try {
            setDeleting(id);
            await axios.delete(`${API_URL}/skus/${id}`);
            // Refresh the SKUs list after deletion
            fetchSKU();
            toast.success('SKU deleted successfully');
        } catch (error) {
            console.error('Error deleting SKU:', error);
            toast.error('Failed to delete SKU');
        } finally {
            setDeleting(null);
        }
    }, [fetchSKU]);

    /**
     * Updates the current page for pagination
     * @param page - The page number to navigate to
     */
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Show loading indicator while fetching initial data
    if (loading && allSKUs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading SKUs...</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Page title */}
            <h2 className="text-2xl font-bold">SKUs</h2>
            
            {/* Search and Add SKU controls */}
            <div className="flex justify-between items-center mb-4">
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search SKUs..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Add SKU Drawer */}
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button className='cursor-pointer'>Add New SKU</Button>
                    </DrawerTrigger>
                    <DrawerContent >
                        <form onSubmit={handleSubmit(onSubmit)} className='overflow-auto'>
                            <DrawerHeader>
                                <DrawerTitle>Add New SKU</DrawerTitle>
                                <DrawerDescription>
                                    Fill in the details to add a new SKU.
                                </DrawerDescription>
                            </DrawerHeader>
                            
                            {/* Dynamic form fields for SKU data */}
                            <div className="p-4 space-y-4">
                                {['id', 'label', 'class', 'department', 'price', 'cost'].map((field) => (
                                    <div className="space-y-2" key={field}>
                                        <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                                        <Input
                                            id={field}
                                            type={field === 'price' || field === 'cost' ? 'number' : 'text'}
                                            step={field === 'price' || field === 'cost' ? '0.01' : undefined}
                                            {...register(field as keyof iSKUFormData, { required: `${field} is required` })}
                                            placeholder={`Enter ${field}`}
                                        />
                                        {errors[field as keyof iSKUFormData] && (
                                            <p className="text-sm text-red-500">{errors[field as keyof iSKUFormData]?.message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <DrawerFooter>
                                <Button 
                                    type="submit" 
                                    className='cursor-pointer'
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add SKU'
                                    )}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" type="button" className='cursor-pointer'>Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>
            
            {/* SKUs Table with loading state */}
            {loading && allSKUs.length > 0 ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Refreshing SKUs...</span>
                </div>
            ) : (
                <>
                    <Table>
                        <TableCaption>List of Available SKUs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>SKU ID</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentSKUs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-4">
                                        No SKUs found matching your search criteria
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentSKUs.map((sku, index) => (
                                    <TableRow key={sku.id}>
                                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell className="font-medium">{sku.id}</TableCell>
                                        <TableCell>{sku.label}</TableCell>
                                        <TableCell>{sku.class}</TableCell>
                                        <TableCell>{sku.department}</TableCell>
                                        <TableCell>${sku.price.toFixed(2)}</TableCell>
                                        <TableCell>${sku.cost.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button 
                                                className='cursor-pointer' 
                                                onClick={() => handleDelete(sku.id)}
                                                disabled={deleting === sku.id}
                                            >
                                                {deleting === sku.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <X />
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    
                    {/* Pagination Controls */}
                    {currentSKUs.length > 0 && (
                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='cursor-pointer'
                            >
                                Previous
                            </Button>
                            {totalPages <= 7 ? (
                                // Show all pages if there are 7 or fewer
                                [...Array(totalPages)].map((_, index) => (
                                    <Button
                                        key={index + 1}
                                        variant={currentPage === index + 1 ? "default" : "outline"}
                                        onClick={() => handlePageChange(index + 1)}
                                        className='cursor-pointer'
                                    >
                                        {index + 1}
                                    </Button>
                                ))
                            ) : (
                                // Show limited pages with ellipsis for many pages
                                <>
                                    {/* First page */}
                                    <Button
                                        variant={currentPage === 1 ? "default" : "outline"}
                                        onClick={() => handlePageChange(1)}
                                        className='cursor-pointer'
                                    >
                                        1
                                    </Button>
                                    
                                    {/* Ellipsis if not near start */}
                                    {currentPage > 3 && <span>...</span>}
                                    
                                    {/* Pages around current page */}
                                    {[...Array(5)].map((_, i) => {
                                        const pageNum = Math.max(2, currentPage - 2) + i;
                                        if (pageNum > 1 && pageNum < totalPages) {
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className='cursor-pointer'
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        }
                                        return null;
                                    }).filter(Boolean)}
                                    
                                    {/* Ellipsis if not near end */}
                                    {currentPage < totalPages - 2 && <span>...</span>}
                                    
                                    {/* Last page */}
                                    <Button
                                        variant={currentPage === totalPages ? "default" : "outline"}
                                        onClick={() => handlePageChange(totalPages)}
                                        className='cursor-pointer'
                                    >
                                        {totalPages}
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className='cursor-pointer'
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SKUs;