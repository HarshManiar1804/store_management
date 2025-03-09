/**
 * PlanningSKU Component
 * 
 * This component displays SKU (Stock Keeping Unit) planning data in a tabular format.
 * It shows sales and gross margin metrics for each SKU across different weeks.
 * 
 * Features:
 * - Displays SKU data in a responsive table with sticky headers and first column
 * - Shows weekly sales metrics including units, dollars, gross margin dollars, and gross margin percentage
 * - Color-codes gross margin percentages based on performance thresholds
 * - Handles empty data states
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { iSKUData } from "@/lib/utils";
import { useMemo, memo } from "react";

/**
 * Helper function to determine the background color for gross margin percentages
 * Returns appropriate CSS classes based on the GM percentage value:
 * - Green (>=50%): High margin
 * - Yellow (>=30%): Medium margin
 * - Orange (>=10%): Low margin
 * - Red (<10%): Very low margin
 */
const getGMColor = (gmPercent: number) => {
    if (gmPercent >= 50) return "bg-green-500 text-white"; // High margin
    if (gmPercent >= 30) return "bg-yellow-500 text-black"; // Medium margin
    if (gmPercent >= 10) return "bg-orange-500 text-black"; // Low margin
    return "bg-red-500 text-white"; // Very low margin
};

// Memoized cell component to prevent unnecessary re-renders
const WeekDataCell = memo(({ sku, week }: { sku: any; week: string }) => {
    // Find sales data for this specific week, or use defaults if not found
    const weekData = sku.salesData.find((sale: any) => sale.week === week);
    const salesUnits = weekData?.salesUnits || 0;
    
    // Calculate financial metrics
    const grossSales = salesUnits * (sku.price || 0);
    const grossMarginDollars = salesUnits * ((sku.price || 0) - (sku.cost || 0));
    const grossMarginPercent =
        grossSales > 0
            ? ((grossMarginDollars / grossSales) * 100).toFixed(2)
            : "0.00";

    return (
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
                        {/* Color-coded cell for gross margin percentage */}
                        <td className={`p-2 text-center font-medium ${getGMColor(parseFloat(grossMarginPercent))}`}>
                            {grossMarginPercent}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

// Add display name for debugging purposes
WeekDataCell.displayName = 'WeekDataCell';

const PlanningSKU = ({ skuData }: { skuData: iSKUData }) => {
    // Handle empty data state
    if (!skuData || !skuData.data) {
        return <p>No data available</p>;
    }

    // Memoize the SKU array and weeks to prevent recalculation on every render
    const { skuArray, allWeeks } = useMemo(() => {
        // Convert SKU data object to array for easier processing
        const skuArray = Object.values(skuData.data);

        // Extract and sort weeks chronologically from all SKU sales data
        const allWeeks = Array.from(new Set(skuArray.flatMap((sku) => sku.salesData.map((sale) => sale.week))))
            .sort((a, b) => a.localeCompare(b));
            
        return { skuArray, allWeeks };
    }, [skuData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>SKU Planning</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Scrollable table container with fixed height */}
                <div className="relative overflow-x-auto" style={{ maxHeight: "80vh" }}>
                    <Table className="border-collapse">
                        {/* Sticky header that remains visible when scrolling vertically */}
                        <TableHeader className="sticky top-0 z-20 bg-white">
                            <TableRow>
                                {/* Sticky first column that remains visible when scrolling horizontally */}
                                <TableHead
                                    className="sticky left-0 bg-white z-30 shadow-md whitespace-nowrap"
                                    style={{ minWidth: "180px" }}
                                >
                                    SKU Name
                                </TableHead>
                                {/* Generate column headers for each week */}
                                {allWeeks.map((week, index) => (
                                    <TableHead key={index} className="text-center whitespace-nowrap min-w-[220px]">
                                        {week}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Generate a row for each SKU */}
                            {skuArray.map((sku) => (
                                <TableRow key={sku.sku_id}>
                                    {/* Sticky SKU Name Column */}
                                    <TableCell
                                        className="sticky left-0 bg-white z-10 font-bold shadow-md"
                                        style={{ minWidth: "180px" }}
                                    >
                                        {sku.sku_name}
                                    </TableCell>

                                    {/* Generate cells for each week's data */}
                                    {allWeeks.map((week, index) => (
                                        <TableCell key={index} className="p-1 min-w-[400px]">
                                            <WeekDataCell sku={sku} week={week} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

// Wrap the component with memo to prevent unnecessary re-renders
export default memo(PlanningSKU);
