import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { Check } from "lucide-react";

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-gray-500 font-bold mb-4 border-b pb-2">Labels</p>
      <div className="space-y-2">
        {labels.map(({ label: lbl, checked }, idx) => (
          <label 
            key={idx} 
            className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center">
              <div 
                className={`
                  w-5 h-5 mr-3 rounded border flex items-center justify-center
                  ${checked ? `bg-${lbl}-400 border-${lbl}-400` : 'bg-white border-gray-300'}
                `}
              >
                {checked && <Check className="text-white" size={16} />}
              </div>
              <span className="text-gray-700 capitalize">{lbl}</span>
            </div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => updateLabel({ label: lbl, checked: !checked })}
              className="hidden"
            />
            <div 
              className={`
                w-4 h-4 rounded-full 
                ${checked ? `bg-${lbl}-400` : 'bg-gray-200'}
              `}
            />
          </label>
        ))}
      </div>
    </div>
  );
}