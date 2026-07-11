type datasetType = {
  min: string;
  max: string;
}

type ChangeType = "add" | "minus";

export default function InputNumber({
  name, dataset, value, onChange
}: {
  name: string;
  dataset: datasetType;
  value: string;
  onChange: (e?: string, type?: ChangeType) => void;
}) {
  return (
    <>
      <div className="relative flex flex-col gap-2">
        <span className="text-[16px] uppercase tracking-[0.2em] font-bold text-secondary px-1">
          {name}
        </span>

        <div className="flex items-center w-full bg-[#1c2731] border-0 rounded-full px-5 gap-2">
          <button 
            className="text-on-surface-variant hover:text-on-surface transition text-xl font-bold material-symbols-outlined cursor-pointer"
            onClick={() => onChange(undefined, "minus")}
          >
            remove
          </button>

          <input
            className="w-full py-4 text-on-surface text-lg text-center transition-all cursor-pointer [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            min={dataset.min}
            max={dataset.max}
            value={value}
            onChange={(e) => onChange(e.target.value, undefined)}
          />

          <button 
            className="text-on-surface-variant hover:text-on-surface transition text-xl font-bold material-symbols-outlined cursor-pointer"
            onClick={() => onChange(undefined, "add")}
            >
            add
          </button>
        </div>
      </div>
    </>
  )
}