import React from "react";

type MetricStatCardProps = {
    label: string;
    value: string | number;
};

const MetricStatCard: React.FC<MetricStatCardProps> = ({ label, value }) => {
    return (
        <div className="bg-black rounded-md p-4 w-full text-center text-white shadow-sm noise shadow-1">
            <p className="text-sm font-medium text-gray-300 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

export default MetricStatCard;
