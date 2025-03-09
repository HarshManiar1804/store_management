/**
 * StoreChart Component
 * 
 * This component visualizes gross margin data across all SKUs using Chart.js.
 * It displays a combination chart with:
 * - Bar chart showing gross margin dollars
 * - Line chart showing gross margin percentage
 * 
 * Features:
 * - Aggregates financial data across all SKUs by week
 * - Displays dual Y-axes for dollars and percentages
 * - Shows all 52 weeks of the year with appropriate formatting
 * - Provides interactive tooltips with formatted values
 * - Handles empty data states
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iSKUData } from "@/lib/utils";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Helper function to generate an array of all 52 weeks in the format W01, W02, etc.
 * This ensures the chart displays a consistent timeline even if data is missing for some weeks.
 */
const generateAllWeeks = (): string[] => {
    const weeks = [];
    for (let i = 1; i <= 52; i++) {
        weeks.push(`W${i.toString().padStart(2, "0")}`);
    }
    return weeks;
};

// Memoize the weeks array to prevent regeneration on every render
const allWeeks = generateAllWeeks();

const StoreChart = ({ skuData }: { skuData: iSKUData }) => {
    // Handle empty data state
    if (!skuData || !skuData.data) {
        return <p>No data available</p>;
    }

    // Use useMemo to process the data only when skuData changes
    const { chartData, options } = useMemo(() => {
        // Convert SKU data object to array for processing
        const skuArray = Object.values(skuData.data);

        // Initialize data map with zeros for all weeks
        const salesMap: Record<string, { gmDollars: number; gmPercent: number; revenue: number; cost: number }> = {};
        allWeeks.forEach((week) => {
            salesMap[week] = { gmDollars: 0, gmPercent: 0, revenue: 0, cost: 0 };
        });

        // Aggregate sales data across all SKUs by week
        skuArray.forEach((sku) => {
            const { price, cost, salesData } = sku;
            salesData.forEach(({ week, salesUnits }) => {
                // Calculate financial metrics for this SKU and week
                const revenue = salesUnits * price;
                const totalCost = salesUnits * cost;
                const gmDollars = revenue - totalCost;

                // Accumulate totals in the sales map
                salesMap[week].gmDollars += gmDollars;
                salesMap[week].revenue += revenue;
                salesMap[week].cost += totalCost;
            });
        });

        // Calculate GM percentage for each week after all revenue/costs are aggregated
        allWeeks.forEach((week) => {
            const revenue = salesMap[week].revenue;
            const gmDollars = salesMap[week].gmDollars;
            salesMap[week].gmPercent = revenue ? (gmDollars / revenue) * 100 : 0;
        });

        // Extract data series for the chart
        const gmDollarsData = allWeeks.map((week) => salesMap[week].gmDollars);
        const gmPercentData = allWeeks.map((week) => salesMap[week].gmPercent);

        // Configure chart data with two datasets (bar and line)
        const chartData = {
            labels: allWeeks,
            datasets: [
                {
                    type: "bar" as const,
                    label: "GM Dollars",
                    data: gmDollarsData,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    yAxisID: "y",  // Associate with left y-axis (dollars)
                },
                {
                    type: "line" as const,
                    label: "GM %",
                    data: gmPercentData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: "y1",  // Associate with right y-axis (percentages)
                },
            ],
        };

        // Configure chart options including axes, tooltips, and responsiveness
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false, // Prevent automatic skipping of labels
                        maxRotation: 90, // Rotate labels to fit more
                        minRotation: 45
                    }
                },
                y: {
                    type: "linear" as const,
                    display: true,
                    position: "left" as const,
                    title: {
                        display: true,
                        text: "GM Dollars ($)"
                    },
                },
                y1: {
                    type: "linear" as const,
                    display: true,
                    position: "right" as const,
                    title: {
                        display: true,
                        text: "GM %"
                    },
                    grid: {
                        drawOnChartArea: false, // Only draw grid lines for the primary y-axis
                    },
                },
            },
            plugins: {
                // Configure tooltips to display formatted values
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            // Format values based on whether they're percentages or dollars
                            if (context.dataset.yAxisID === 'y1') {
                                label += context.parsed.y.toFixed(2) + '%';
                            } else {
                                label += '$' + context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: true
                },
            },
        };

        return { chartData, options };
    }, [skuData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gross Margin Trends</CardTitle>
            </CardHeader>
            <CardContent style={{ height: "400px" }}>
                {/* @ts-ignore is used to bypass type checking issues with Chart.js */}
                <Bar data={chartData} options={options} />
            </CardContent>
        </Card>
    );
};

export default StoreChart;
