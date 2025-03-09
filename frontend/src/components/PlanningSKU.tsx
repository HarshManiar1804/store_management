import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalesData {
    week: string;
    salesUnits: number;
}

interface SKU {
    sku_id: string;
    sku_name: string;
    price: number;
    cost: number;
    salesData: SalesData[];
}

interface SKUData {
    data: Record<string, SKU>;
}

// Function to get color coding for GM%
const getGMColor = (gmPercent: number) => {
    if (gmPercent >= 50) return "bg-green-500 text-white"; // High margin
    if (gmPercent >= 30) return "bg-yellow-500 text-black"; // Medium margin
    if (gmPercent >= 10) return "bg-orange-500 text-black"; // Low margin
    return "bg-red-500 text-white"; // Very low margin
};

const PlanningSKU = ({ skuData }: { skuData: SKUData }) => {
    console.log("SKU Data:", skuData);

    if (!skuData || !skuData.data) {
        return <p>No data available</p>;
    }

    const skuArray = Object.values(skuData.data);

    // Extract and sort weeks
    const allWeeks = Array.from(new Set(skuArray.flatMap((sku) => sku.salesData.map((sale) => sale.week))))
        .sort((a, b) => a.localeCompare(b)); // Sorting weeks chronologically

    return (
        <Card>
            <CardHeader>
                <CardTitle>SKU Planning</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-x-auto" style={{ maxHeight: "80vh" }}>
                    <Table className="border-collapse">
                        <TableHeader className="sticky top-0 z-20 bg-white">
                            <TableRow>
                                <TableHead
                                    className="sticky left-0 bg-white z-30 shadow-md whitespace-nowrap"
                                    style={{ minWidth: "180px" }}
                                >
                                    SKU Name
                                </TableHead>
                                {allWeeks.map((week, index) => (
                                    <TableHead key={index} className="text-center whitespace-nowrap min-w-[220px]">
                                        {week}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skuArray.map((sku) => (
                                <TableRow key={sku.sku_id}>
                                    {/* Sticky SKU Name Column */}
                                    <TableCell
                                        className="sticky left-0 bg-white z-10 font-bold shadow-md"
                                        style={{ minWidth: "180px" }}
                                    >
                                        {sku.sku_name}
                                    </TableCell>

                                    {/* Week-wise Data */}
                                    {allWeeks.map((week, index) => {
                                        const weekData = sku.salesData.find((sale) => sale.week === week);
                                        const salesUnits = weekData?.salesUnits || 0;
                                        const grossSales = salesUnits * (sku.price || 0);
                                        const grossMarginDollars = salesUnits * ((sku.price || 0) - (sku.cost || 0));
                                        const grossMarginPercent =
                                            grossSales > 0
                                                ? ((grossMarginDollars / grossSales) * 100).toFixed(2)
                                                : "0.00";

                                        return (
                                            <TableCell key={index} className="p-1 min-w-[400px]">
                                                <div className="border rounded-md shadow-sm p-3">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="text-xs text-muted-foreground font-medium p-2 text-left">Sales Units</th>
                                                                <th className="text-xs text-muted-foreground font-medium p-2 text-left">Sales Dollars</th>
                                                                <th className="text-xs text-muted-foreground font-medium p-2 text-left">GM Dollars</th>
                                                                <th className="text-xs text-muted-foreground font-medium p-2 text-center">GM %</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="border-b">
                                                                <td className="p-2">{salesUnits}</td>
                                                                <td className="p-2">${grossSales.toFixed(2)}</td>
                                                                <td className="p-2">${grossMarginDollars.toFixed(2)}</td>
                                                                <td className={`p-2 text-center font-medium ${getGMColor(parseFloat(grossMarginPercent))}`}>
                                                                    {grossMarginPercent}%
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlanningSKU;
