/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatMoney } from "../../constants/utils/formatMoney";



interface AssetData {
    asset: string;
    amount: number;
    value: number;
    collateralFactor?: number;
    apy?: number;
}

interface OrderData {
    asset: string;
    amount: number;
    apr: number;
    duration: number;
    orderId: string;
    whitelist?: string[];
    min_amount?: number;
    max_amount?: number;
    dueDate?: string;
}

interface PositionData {
    totalCollateral: number;
    availableToBorrow: number;
    borrowPowerLeft: number;
    collateralAssets: AssetData[];
    lendOrders: OrderData[];
    supplyToLP: AssetData[];
    borrowOrders: OrderData[];
    borrowFromLP: any[];
}

interface ChartDataPoint {
    name: string;
    date: string;
    collateral: number;
    supply: number;
    borrow: number;
}

const generateSevenDayDataFromPosition = (positionData: PositionData | undefined): ChartDataPoint[] => {
    if (!positionData) return [];
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();
    
    // Calculate daily variation factors to simulate some movement
    const dailyVariation = Array(7).fill(0).map(() => (Math.random() * 0.1) - 0.05); // ±5% variation
    
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (6 - i)); // Last 7 days including today
        
        const dayName = dayNames[date.getDay()];
        const dateNum = date.getDate();
        
        // Calculate values with slight daily variation
        const variationFactor = 1 + dailyVariation[i];
        const collateral = positionData.totalCollateral * variationFactor;
        const supply = positionData.supplyToLP.reduce((sum, asset) => sum + asset.value, 0) * variationFactor;
        const borrow = positionData.borrowOrders.reduce((sum, order) => sum + order.amount, 0) * variationFactor;
        
        return {
            name: `${dayName} ${dateNum}`,
            date: date.toISOString().split('T')[0],
            collateral: Math.round(collateral),
            supply: Math.round(supply),
            borrow: Math.round(borrow)
        };
    });
};

interface PortfolioAreaChartProps {
    positionData?: PositionData;
}

const PortfolioAreaChart: React.FC<PortfolioAreaChartProps> = ({ positionData }) => {
    const data = generateSevenDayDataFromPosition(positionData);
    
    // Custom YAxis tick formatter
    const formatYAxisTick = (value: number) => {
        return `$${formatMoney(value)}`;
    };

    // Custom tooltip formatter
    const formatTooltipValue = (value: number, name: string) => {
        return [`$${formatMoney(value)}`, name.charAt(0).toUpperCase() + name.slice(1)];
    };

    return (
        <div className="w-full h-[400px] bg-[#050505] p-4 rounded-md noise shadow-1">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCollateral" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#888" 
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="#888" 
                        tickFormatter={formatYAxisTick}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                        formatter={formatTooltipValue}
                        labelFormatter={(label: string) => {
                            const item = data.find(d => d.name === label);
                            return item ? item.date : label;
                        }}
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            borderColor: '#444',
                            borderRadius: '4px',
                            color: '#fff'
                        }}
                    />
                    <Legend 
                        wrapperStyle={{
                            paddingTop: '20px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="collateral"
                        name="Collateral"
                        stroke="#00C49F"
                        fillOpacity={1}
                        fill="url(#colorCollateral)"
                    />
                    <Area
                        type="monotone"
                        dataKey="supply"
                        name="Supply"
                        stroke="#0088FE"
                        fillOpacity={1}
                        fill="url(#colorSupply)"
                    />
                    <Area
                        type="monotone"
                        dataKey="borrow"
                        name="Borrow"
                        stroke="#FFA500"
                        fillOpacity={0.35}
                        fill="#FFA500"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PortfolioAreaChart;