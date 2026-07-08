export default function NotificationWindow({
  hiddenState, onExit, children
} : {
  hiddenState: boolean;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-100 flex items-center justify-center transition-all px-6  ${hiddenState ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onExit}></div>

        <div className="mx-auto relative w-full max-w-sm max-h-[70vh] flex flex-col glass-panel rounded-lg border border-surface-container-highest p-6 overflow-scroll scrollbar-hide">
          <button
            className="sticky top-0 ml-auto text-on-surface-variant hover:text-on-surface active:scale-90 transition-all w-fit z-101 cursor-pointer"
            onClick={onExit}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="flex flex-col relative z-10 pl-2 pr-6">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}