import React from "react";

type CustomBtnProps = {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
};

const CustomBtn1: React.FC<CustomBtnProps> = ({ label, onClick, variant = "primary" }) => {
    const base = "px-3 py-1 rounded text-sm font-medium cursor-pointer";
    const styles =
        variant === "primary"
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-[#333] text-white hover:bg-[#444]";

    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {label}
        </button>
    );
};

export default CustomBtn1;