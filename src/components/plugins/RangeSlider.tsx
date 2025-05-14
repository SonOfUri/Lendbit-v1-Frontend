import React, { useState, useEffect } from "react";

type RangeSliderProps = {
  min?: number;
  max?: number;
  initialMin?: number;
  initialMax?: number;
  step?: number;
  onChange?: (range: { min: number; max: number }) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 10000,
  initialMin = 0,
  initialMax = 8000,
  step = 1,
  onChange,
}) => {
  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  const [inputMin, setInputMin] = useState(initialMin.toString());
  const [inputMax, setInputMax] = useState(initialMax.toString());

  // Update internal state when props change
  useEffect(() => {
    setInputMin(initialMin.toString());
    setInputMax(initialMax.toString());
  }, [initialMin, initialMax]);

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
      <label className="text-xs mb-1 block text-start">Allocation Range</label>
      <div className="relative h-2 bg-[#191818] rounded-full">
        <div
          className="absolute h-2 bg-white rounded-full"
          style={{
            left: `${((parsedMin - min) / (max - min)) * 100}%`,
            width: `${((parsedMax - parsedMin) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={parsedMin}
          onChange={(e) => {
            const val = Number(e.target.value);
            setInputMin(val.toString());
            onChange?.({ min: val, max: parsedMax });
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer -top-1"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={parsedMax}
          onChange={(e) => {
            const val = Number(e.target.value);
            setInputMax(val.toString());
            onChange?.({ min: parsedMin, max: val });
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer -top-1"
        />
      </div>

      <div className="flex justify-between mt-4 gap-4">
        <div className="flex flex-col items-start w-1/2">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputMin}
            onChange={handleMinChange}
            className="bg-transparent border border-white text-white text-sm px-2 py-1 rounded w-full"
          />
          <span className="text-xs text-white mt-1">Minimum</span>
        </div>

        <div className="flex flex-col items-start w-1/2">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputMax}
            onChange={handleMaxChange}
            className="bg-transparent border border-white text-white text-sm px-2 py-1 rounded w-full"
          />
          <span className="text-xs text-white mt-1">Maximum</span>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;