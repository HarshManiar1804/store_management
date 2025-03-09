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
import { useState, useEffect } from "react";
import axios from "axios";
import PlanningSKU from "@/components/PlanningSKU";
import { iStore } from "@/lib/utils";


const Planning = () => {
    // State management for store selection and data
    const [open, setOpen] = useState(false); // Controls dropdown open state
    const [value, setValue] = useState(""); // Selected store ID
    const [stores, setStores] = useState<iStore[]>([]); // List of available stores
    const [loading, setLoading] = useState(true); // Tracks loading state for API calls
    const [skuData, setSkuData] = useState<{ data: Record<string, any> }>({ data: {} }); // Planning data for selected store

    /**
     * Fetches all stores from the API
     * Sets loading state during API call and updates store data on success
     */
    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:4000/stores`);
            setStores(data.stores || data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load stores data on component mount
    useEffect(() => {
        fetchStores();
    }, []);

    /**
     * Fetches planning data for a specific store
     * @param storeId - The ID of the store to fetch planning data for
     */
    const fetchPlanningData = async (storeId: string) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:4000/planning/${storeId}`);
            setSkuData(data);
        } catch (error) {
            console.error('Error fetching planning data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch planning data when a store is selected
    useEffect(() => {
        if (value) {
            fetchPlanningData(value);
        }
    }, [value]);

    return (
        <>
            {/* Show loading indicator or store selection UI */}
            {loading ? (
                <div>Loading stores...</div>
            ) : (
                <div className="flex items-center  gap-4 ">
                    {/* Store selection section */}
                    <h2 className="text-2xl font-bold">Store</h2>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[250px] justify-between"
                            >
                                {/* Display selected store name or placeholder */}
                                {value
                                    ? stores.find((store) => store.id === value)?.label
                                    : "Select store..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandList>
                                    <CommandEmpty>No store found.</CommandEmpty>
                                    <CommandGroup>
                                        {/* Map through stores for selection */}
                                        {stores.map((store) => (
                                            <CommandItem
                                                key={store.id}
                                                value={store.id}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue);
                                                    setOpen(false);
                                                    console.log("Selected Store ID:", store.id);
                                                }}
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
            )}

            {/* Display selected store name as heading */}
            <h2 className="text-2xl font-bold mb-4">
                {value
                    ? stores.find((store) => store.id === value)?.label
                    : ""}
            </h2>

            {/* Display planning data or prompt to select a store */}
            <div className="w-full">
                {value
                    ? <PlanningSKU skuData={skuData} />
                    : <p className="text-gray-500">Please select a store to view planning data</p>}
            </div>
        </>
    );
};

export default Planning;
