/**
 * Planning Page Component
 * 
 * This component provides an interface for viewing planning data for different stores:
 * - Store selection via a dropdown
 * - Fetching and displaying planning data for the selected store
 * - Rendering planning data through the PlanningSKU component
 */
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import PlanningSKU from "@/components/PlanningSKU";
import { iStore } from "@/lib/utils";

// API base URL - should be in environment variable in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Planning = () => {
    // State management for store selection and data
    const [open, setOpen] = useState(false); // Controls dropdown open state
    const [value, setValue] = useState(""); // Selected store ID
    const [stores, setStores] = useState<iStore[]>([]); // List of available stores
    const [loading, setLoading] = useState(true); // Tracks loading state for API calls
    const [planningData, setPlanningData] = useState(null); // Planning data for selected store
    const [dataLoading, setDataLoading] = useState(false); // Tracks loading state for planning data

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
            setStores(data.stores || data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetches planning data for a specific store
     * @param storeId - The ID of the store to fetch planning data for
     */
    const fetchPlanningData = useCallback(async (storeId: string) => {
        try {
            setDataLoading(true);
            const { data } = await axios.get(`${API_URL}/planning/${storeId}`);
            setPlanningData(data);
        } catch (error) {
            console.error('Error fetching planning data:', error);
        } finally {
            setDataLoading(false);
        }
    }, []);

    // Memoize the selected store for display
    const selectedStore = useMemo(() => {
        return stores.find(store => store.id === value);
    }, [stores, value]);

    // Handle store selection
    const handleStoreSelect = useCallback((storeId: string) => {
        setValue(storeId);
        setOpen(false);
        fetchPlanningData(storeId);
    }, [fetchPlanningData]);

    // Show loading indicator while fetching initial store list
    if (loading) {
        return <div>Loading stores...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Planning</h2>
            
            {/* Store selection dropdown */}
            <div className="flex flex-col space-y-1.5">
                <label htmlFor="store-select" className="text-sm font-medium">Select Store</label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between"
                        >
                            {selectedStore ? selectedStore.label : "Select store..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandList>
                                <CommandEmpty>No stores found.</CommandEmpty>
                                <CommandGroup>
                                    {stores.map((store) => (
                                        <CommandItem
                                            key={store.id}
                                            value={store.id}
                                            onSelect={() => handleStoreSelect(store.id)}
                                        >
                                            {store.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            
            {/* Planning data display */}
            {dataLoading ? (
                <div>Loading planning data...</div>
            ) : planningData ? (
                <PlanningSKU skuData={planningData} />
            ) : (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">Select a store to view planning data</p>
                </div>
            )}
        </div>
    );
};

export default Planning;
