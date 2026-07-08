import { useEffect, useRef, useState } from "react";

type datasetType = {
  name: string;
  value: string;
}[];


export default function Dropdown({
  value, dataset, onChange
}: {
  value: string;
  dataset: datasetType;
  onChange: (e: string) => void;
}) {
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!hidden) {
          setHidden(true);
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
      <div className="relative">
        <button
          className="flex justify-between items-center w-full max-h-15 bg-surface-container-highest border border-surface-container-highestest rounded-[1.75rem] py-4 pl-6 pr-4 text-on-surface text-lg appearance-none hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
          onClick={() => setHidden(false)}
        >
          {value}
          
          <span
            className={
              (!hidden && '-rotate-z-180') +
              " material-symbols-outlined text-on-surface-variant pointer-events-none text-xl font-bold transition-all"
            }
          >
            expand_more
          </span>
        </button>

        <div
          ref={dropdownRef} 
          className={
            (hidden ? "opacity-0 pointer-events-none" : 'opacity-100 pointer-events-auto') +
            " flex flex-col absolute top-18 z-10 bg-surface-container-highest border-2 border-surface-container-highestest divide-y-2 divide-surface-container-highestest rounded-[1.75rem] w-full hover:ring-2 hover:ring-primary/50 overflow-hidden transition-all"
          }
        >
          {dataset.map((data) => (
            <button
              className="flex pl-6 py-1 items-start cursor-pointer transition-all hover:bg-surface-container-high"
              onClick={(e) => {onChange(e.currentTarget.value); setHidden(true)}}
              value={data.value}
            >
              {data.name}
            </button>
          ))}
        </div>
      </div>

    </>
  )
}