import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
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
import StoreChart from "@/components/StoreChart";
// import PlanningSKU from "@/components/PlanningSKU";

interface Store {
    id: string;
    label: string;
    city: string;
    state: string;
}

const Chart = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [skuData, setSkuData] = useState<{ data: Record<string, any> }>({ data: {} });
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
    useEffect(() => {
        fetchStores();
    }, []);

    const fetchChartData = async (storeId: string) => {
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

    useEffect(() => {
        if (value) {
            fetchChartData(value);
        }
    }, [value]);

    return (
        <>
            {loading ? (
                <div>Loading stores...</div>
            ) : (
                <div className="flex items-center  gap-4 ">
                    <h2 className="text-2xl font-bold">Store</h2>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[250px] justify-between"
                            >
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
            <h2 className="text-2xl font-bold mb-4">
                {value
                    ? stores.find((store) => store.id === value)?.label
                    : ""}
            </h2>
            <div className="w-full">
                {value
                    ? <StoreChart skuData={skuData} />
                    : <p className="text-gray-500">Please select a store to view planning data</p>}
            </div>
        </>
    );
};

export default Chart;
