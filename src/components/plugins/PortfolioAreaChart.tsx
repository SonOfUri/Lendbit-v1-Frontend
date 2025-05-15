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

/*const data = Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (79 - i)); // 80 days ago to today
    const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const baseCollateral = 3000 + i * 40 + Math.floor(Math.random() * 100);
    const baseSupply = baseCollateral * 0.66 + Math.floor(Math.random() * 50);
    const baseBorrow = baseCollateral * 0.33 + Math.floor(Math.random() * 50);

    return {
        name: formattedDate,
        collateral: Math.round(baseCollateral),
        supply: Math.round(baseSupply),
        borrow: Math.round(baseBorrow)
    };
});*/


const data = [
    { name: "Jan", collateral: 3000, supply: 2000, borrow: 1000 },
    { name: "Feb", collateral: 4000, supply: 2500, borrow: 1400 },
    { name: "Mar", collateral: 4700, supply: 3000, borrow: 1700 },
    { name: "Apr", collateral: 5200, supply: 3300, borrow: 2100 },
    { name: "May", collateral: 6000, supply: 4000, borrow: 2400 },
    { name: "Jun", collateral: 5700, supply: 3800, borrow: 2100 },
    { name: "Jul", collateral: 5300, supply: 3600, borrow: 2000 },
];

const PortfolioAreaChart = () => {
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
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="collateral"
                        stroke="#00C49F"
                        fillOpacity={1}
                        fill="url(#colorCollateral)"
                    />
                    <Area
                        type="monotone"
                        dataKey="supply"
                        stroke="#0088FE"
                        fillOpacity={1}
                        fill="url(#colorSupply)"
                    />
                    <Area
                        type="monotone"
                        dataKey="borrow"
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

