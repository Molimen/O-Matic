import { HexColorPicker } from "react-colorful";

export default function ColorPicker({
  color, pallete, onChange
}: {
  color: string;
  pallete?: string[];
  onChange: (value: React.SetStateAction<string>) => void
}) {
  return (
    <>
      <div className="input-color flex flex-col box-content rounded-3xl p-4 gap-3 w-full max-w-60 h-70 bg-surface-container">
        <HexColorPicker color={color} onChange={(newColor) => onChange(newColor.toLocaleUpperCase().replace(/^#/, ""))} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(24px,100%),1fr))] gap-1">
          {pallete?.map((color) => (
            <span
              key={color}
              className="h-6 w-6 rounded-sm cursor-pointer"
              style={{backgroundColor: color}}
              onClick={() => onChange(color.toLocaleUpperCase().replace(/^#/, ""))}
            ></span>
          ))}
        </div>

        <input
          value={color}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value.toLocaleUpperCase().replace(/^#/, ""))}
          className="border-2 border-surface-container-highest rounded-[8px] px-2 py-1"
        />

        {/* <button className="bg-neon-gradient text-on-primary-fixed text-lg md:text-xl font-bold py-1 px-12 rounded-full shadow-[0_0_40px_-5px_rgba(255,136,181,0.6)] hover:shadow-[0_0_30px_rgba(255,136,181,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined" style={{fontSize: "24px"}}>undo</span>
          Revert
        </button> */}
      </div>
    </>
  )
}