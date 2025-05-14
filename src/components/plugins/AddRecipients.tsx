import React, { useState } from "react";

interface AddRecipientsProps {
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const isValidEvmAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address.trim());

const extractAddresses = (input: string): string[] => {
  return input
    .split(/[\s,]+/)
    .map((addr) => addr.trim())
    .filter((addr) => isValidEvmAddress(addr));
};

const AddRecipients: React.FC<AddRecipientsProps> = ({ addresses, setAddresses }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handlePasteOrEnter = (value: string) => {
    const extracted = extractAddresses(value);
    if (extracted.length) {
      setAddresses(prev => [...new Set([...prev, ...extracted])]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePasteOrEnter(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    handlePasteOrEnter(pastedText);
  };

  const removeAddress = (addr: string) => {
    setAddresses(prev => prev.filter(a => a !== addr));
  };

  return (
    <div className="w-full max-w-md">
      <label className="text-white font-semibold mb-2 block text-left">
        Add Recipients <span className="text-xs">(Optional for whitelisting)</span>
      </label>

      <div className="space-y-2">
        {addresses.map((addr) => (
          <div key={addr} className="flex items-center justify-between bg-[#050505] border border-white text-white px-3 py-2 rounded-md text-sm">
            <span className="truncate">{addr}</span>
            <button
              onClick={() => removeAddress(addr)}
              className="text-red-500 hover:text-red-300 font-bold text-lg"
              aria-label={`Remove ${addr}`}
            >
              ✕
            </button>
          </div>
        ))}

        <div className="relative">
          <input
            type="text"
            placeholder="0x..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="w-full bg-[#191818] border border-gray-600 text-white rounded-md px-3 py-2 outline-none"
            aria-label="Add recipient addresses"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
              aria-label="Clear input"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRecipients;