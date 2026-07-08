export default function ButtonElement({
  name, icon, onClick
}: {
  name: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <>
      <button
        className="w-full md:w-auto md:min-w-75 max-h-17 bg-neon-gradient text-on-primary-fixed text-lg md:text-xl font-bold py-5 px-12 rounded-full shadow-[0_0_40px_-5px_rgba(255,136,181,0.6)] hover:shadow-[0_0_30px_rgba(255,136,181,0.4)] active:scale-95 transition-all flex items-center justify-center gap-6 cursor-pointer"
        onClick={onClick}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {name}
      </button>
    </>
  )
}