import { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown/dropdown";

type datasetType = {
  name: string;
  value: string;
}[];

export default function InputSelect({
  name, dataset, value, onChange
}: {
  name: string;
  dataset: datasetType;
  value: string;
  onChange: (e: string) => void;
}) {
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!hidden) {
          setHidden(true);
          console.log("Clicked outside");
        }
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [hidden]);

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <label className="text-[16px] uppercase tracking-[0.2em] font-bold text-secondary px-1">
          {name}
        </label>

        <select className="w-full bg-[#1c2731] border-0 rounded-full py-4 px-6 text-on-surface text-lg appearance-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {dataset.map((data) => (
            <option key={data.name} value={data.value}>{data.name}</option>
          ))}
        </select>

        <span className="material-symbols-outlined absolute right-4 top-13 text-on-surface-variant pointer-events-none">
          expand_more
        </span>

        <Dropdown value={value} dataset={dataset} onChange={onChange} />
      </div>
    </>
  )
}