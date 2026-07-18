import { useState } from "react";

type AccordionProps = {
    header: React.ReactNode;
    children: React.ReactNode;
  };

export default function Accordion({ header, children }: AccordionProps) {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <div
        className="w-full bg-surface-container-highest border border-surface-container-highestest rounded-2xl overflow-hidden grid transition-[grid-template-rows] duration-150 ease-in-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr", 
        }}
      >
        <div className="min-h-12 flex flex-col items-center py-2 gap-2">
          <button
            className="w-full box-border px-2 flex items-center"
            onClick={() => setExpanded((v) => !v)}
          >
            {header}
            <span
              className={
                (expanded ? "-rotate-z-180" : "") +
                " material-symbols-outlined text-on-surface-variant pointer-events-none text-xl font-bold transition-all px-1.5 w-9 h-6"
              }
            >
              expand_more
            </span>
          </button>
  
          {children}
        </div>
      </div>
    );
  }