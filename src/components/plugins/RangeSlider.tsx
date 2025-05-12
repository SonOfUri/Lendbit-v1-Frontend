import React, { useState } from "react";

type RangeSliderProps = {
	min?: number;
	max?: number;
	initialMin?: number;
	initialMax?: number;
	onChange?: (range: { min: number; max: number }) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
	min = 0,
	max = 10000,
	initialMin = 0,
	initialMax = 8000,
	onChange,
}) => {
	const clamp = (val: number) => Math.min(Math.max(val, min), max);

	const [inputMin, setInputMin] = useState(initialMin.toString());
	const [inputMax, setInputMax] = useState(initialMax.toString());

	const parsedMin = clamp(Number(inputMin) || 0);
	const parsedMax = clamp(Number(inputMax) || 0);

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setInputMin(val);

		const num = clamp(Number(val));
		if (!isNaN(num) && num <= parsedMax) {
			onChange?.({ min: num, max: parsedMax });
		}
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setInputMax(val);

		const num = clamp(Number(val));
		if (!isNaN(num) && num >= parsedMin) {
			onChange?.({ min: parsedMin, max: num });
		}
	};

	return (
		<div className="w-full max-w-md text-white">
			<label className="text-xs mb-1 block text-start">Borrow Allocation</label>
			<div className="relative h-2 bg-[#191818] rounded-full">
				<div
					className="absolute h-2 bg-white rounded-full"
					style={{
						left: `${(parsedMin / max) * 100}%`,
						width: `${((parsedMax - parsedMin) / max) * 100}%`,
					}}
				/>
				<div
					className="absolute w-4 h-4 bg-[#050505] border-2 border-white rounded-full -top-1"
					style={{
						left: `${(parsedMin / max) * 100}%`,
						transform: "translateX(-50%)",
					}}
				/>
				<div
					className="absolute w-4 h-4 bg-[#050505] border-2 border-white rounded-full -top-1"
					style={{
						left: `${(parsedMax / max) * 100}%`,
						transform: "translateX(-50%)",
					}}
				/>
			</div>

			<div className="flex justify-between mt-4 gap-4">
				<div className="flex flex-col items-start w-1/2">
					<input
						type="text"
						value={inputMin}
						onChange={handleMinChange}
						className="bg-transparent border border-white text-white text-sm px-2 py-1 rounded w-full"
					/>
					<span className="text-xs text-white mt-1">Lower Limit</span>
				</div>

				<div className="flex flex-col items-start w-1/2">
					<input
						type="text"
						value={inputMax}
						onChange={handleMaxChange}
						className="bg-transparent border border-white text-white text-sm px-2 py-1 rounded w-full"
					/>
					<span className="text-xs text-white mt-1">Upper Limit</span>
				</div>
			</div>
		</div>
	);
};

export default RangeSlider;
