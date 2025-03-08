import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalesData {
    week: string;
    salesUnits: number;
}

interface SKUData {
    sku_id: string;
    sku_name: string;
    price: number;
    cost: number;
    salesData: SalesData[];
}

const PlanningSKU = ({ skuData }: { skuData: SKUData }) => {

    return (
        <Card className="p-4 w-full">
            <CardContent>
                <h2 className="text-xl font-bold mb-4">{skuData.sku_name}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Week</TableHead>
                            <TableHead>Sales Units</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Gross Margin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skuData.salesData?.map((data, index) => {
                            console.log(data);
                            const revenue = data.salesUnits * skuData.price;
                            const grossMargin = ((skuData.price - skuData.cost) / skuData.price) * 100;
                            let bgColor = "bg-green-500";

                            if (grossMargin < 10) bgColor = "bg-red-500";
                            else if (grossMargin < 30) bgColor = "bg-yellow-500";

                            return (
                                <TableRow key={index}>
                                    <TableCell>{data.week}</TableCell>
                                    <TableCell>{data.salesUnits}</TableCell>
                                    <TableCell>${revenue.toFixed(2)}</TableCell>
                                    <TableCell className={`${bgColor} text-white p-2 rounded-md`}>
                                        {grossMargin.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default PlanningSKU;