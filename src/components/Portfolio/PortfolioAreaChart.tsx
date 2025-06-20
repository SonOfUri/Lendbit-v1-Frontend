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
import { AnalyticsData } from "../../constants/types/analyticsData";

interface PortfolioAreaChartProps {
    analyticsData?: AnalyticsData;
}

const PortfolioAreaChart: React.FC<PortfolioAreaChartProps> = ({ analyticsData }) => {
    
    // Use actual chart data from analytics or empty array if not available
    const data = analyticsData?.chartData || [];

    // Custom YAxis tick formatter
    const formatYAxisTick = (value: number) => {
        return `$${formatMoney(value)}`;
    };

    // Custom tooltip formatter
    const formatTooltipValue = (value: number, name: string) => {
        return [`$${formatMoney(value)}`, name.charAt(0).toUpperCase() + name.slice(1)];
    };

 

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[400px] bg-[#050505] p-4 rounded-md noise shadow-1 flex items-center justify-center">
                <p className="text-gray-400">No chart data available</p>
            </div>
        );
    }

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


