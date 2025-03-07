import  { useEffect, useState } from 'react';
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

interface Store {
    id: string;
    label: string;
    city: string;
    state: string;
}

interface FormData {
    id: string;
    label: string;
    city: string;
    state: string;
}

const Store = () => {
    const [allStores, setAllStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const itemsPerPage = 10;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    // Calculate total pages based on all stores
    const totalPages = Math.ceil(allStores.length / itemsPerPage);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:4000/stores`);
            setAllStores(data.stores || data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const createStore = async (storeData: FormData) => {
        try {
            const response = await axios.post('http://localhost:4000/stores', storeData);
            toast.success('Store added successfully');
            return response.data;
        } catch (error) {
            console.error('Error adding store:', error);
            throw new Error('Failed to add store');
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createStore(data);
            setIsDrawerOpen(false);
            reset();
            fetchStores();
        } catch (error) {
            toast.error('Failed to add store');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:4000/stores/${id}`);
            // Refresh the stores list after deletion
            fetchStores();
            toast.success('Store deleted successfully');
        } catch (error) {
            console.error('Error deleting store:', error);
            toast.error('Failed to delete store');
        }

    };

    // Get current page data
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allStores.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div>Loading stores...</div>;
    }

    const currentStores = getCurrentPageData();

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Stores</h2>
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
                    {currentStores.map((store, index) => (
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