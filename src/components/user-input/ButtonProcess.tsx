export default function ButtonElement({
  name, 
  icon, 
  visualPriority = "primary",
  onClick
}: {
  name: string;
  icon: string;
  visualPriority?: "primary" | "secondary";
  onClick: () => void;
}) {

  return (
    <>
      <button
        className={
          visualPriority == "primary" ? 
          "w-full md:w-auto md:min-w-75 bg-primary text-on-primary-fixed text-lg md:text-xl font-bold py-5 px-12 rounded-full hover:shadow-[0_0_30px_rgba(163,234,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-6 cursor-pointer" :
          "w-full md:w-auto md:min-w-75 box-border bg-[#0f1c2799] border-2 border-primary-dim/90 text-on-surface text-lg md:text-xl font-bold py-5 px-12 rounded-full hover:shadow-[0_0_30px_rgba(163,234,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-6 cursor-pointer"
        }
        onClick={onClick}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {name}
      </button>
    </>
  )
}