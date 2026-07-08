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
        <span className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80 px-1">
          {name}
        </span>

        <div className="flex items-center w-full bg-surface-container-highest border border-surface-container-highestest rounded-[1.75rem] px-5 max-h-15 gap-2 hover:ring-2 hover:ring-primary/50 transition-all">
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