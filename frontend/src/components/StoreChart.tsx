import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ChartOptions
} from "chart.js";
import { Bar } from "react-chartjs-2";

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

const generateAllWeeks = (): string[] => {
    const weeks = [];
    for (let i = 1; i <= 52; i++) {
        weeks.push(`W${i.toString().padStart(2, "0")}`);
    }
    return weeks;
};

const StoreChart = ({ skuData }: { skuData: SKUData }) => {
    if (!skuData || !skuData.data) {
        return <p>No data available</p>;
    }

    const skuArray = Object.values(skuData.data);

    // Generate all 52 weeks
    const allWeeks = generateAllWeeks();

    // Initialize data map with zeros
    const salesMap: Record<string, { gmDollars: number; gmPercent: number; revenue: number; cost: number }> = {};
    allWeeks.forEach((week) => {
        salesMap[week] = { gmDollars: 0, gmPercent: 0, revenue: 0, cost: 0 };
    });

    // Populate the sales map with actual data
    skuArray.forEach((sku) => {
        const { price, cost, salesData } = sku;
        salesData.forEach(({ week, salesUnits }) => {
            const revenue = salesUnits * price;
            const totalCost = salesUnits * cost;
            const gmDollars = revenue - totalCost;

            // Accumulate totals
            salesMap[week].gmDollars += gmDollars;
            salesMap[week].revenue += revenue;
            salesMap[week].cost += totalCost;
        });
    });

    // Compute GM % after all revenue/costs are aggregated
    allWeeks.forEach((week) => {
        const revenue = salesMap[week].revenue;
        const gmDollars = salesMap[week].gmDollars;
        salesMap[week].gmPercent = revenue ? (gmDollars / revenue) * 100 : 0;
    });

    // Convert data to chart format
    const gmDollarsData = allWeeks.map((week) => salesMap[week].gmDollars);
    const gmPercentData = allWeeks.map((week) => salesMap[week].gmPercent);

    // Create chart configuration
    const chartData = {
        labels: allWeeks,
        datasets: [
            {
                type: "bar" as const,
                label: "GM Dollars",
                data: gmDollarsData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                yAxisID: "y",
            },
            {
                type: "line" as const,
                label: "GM %",
                data: gmPercentData,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                fill: false,
                yAxisID: "y1",
            },
        ],
    };

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
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gross Margin Trends</CardTitle>
            </CardHeader>
            <CardContent style={{ height: "400px" }}>
                {/* @ts-ignore */}
                <Bar data={chartData} options={options} />
            </CardContent>
        </Card>
    );
};

export default StoreChart;
