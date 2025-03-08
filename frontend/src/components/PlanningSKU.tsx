
interface SKUDate {
    store_id: string;
    store_name: string;
    sku_id: string;
    sku_name: string;
    price: number;
    cost: number;
    week: string;
    month: string;
    salesUnits: number;
}

const PlanningSKU = ({ skuData }: { skuData: SKUDate[] }) => {
    console.log("aave che k nai :", skuData);
    return (
        <div>
            sku
        </div>
    )
}

export default PlanningSKU
