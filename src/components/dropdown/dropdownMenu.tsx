import { useEffect, useRef, useState } from "react";

export function MarqueeText({ children }: { children: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        setOverflowing(
          textRef.current.scrollWidth >
          containerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap"
    >
      <div
        ref={textRef}
        className={overflowing ? 'animate-marquee inline-block' : 'px-3'}
      >
        {children}
      </div>
    </div>
  );
}

type directionType = "up" | "down";

function DropdownMenuMore({
  links, iconMode, direction, onGoto
}: {
  links: {
    to: string;
    label: string;
    icon: string;
  }[];
  iconMode: boolean;
  direction: directionType;
  onGoto: (link: string) => void;
}) {
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLinkPath = location.pathname;
  const listOfLinks = links.map((link) => link.to);
  const [lastUsedLink, setLastUsedLink] = useState(listOfLinks.includes(currentLinkPath) ? currentLinkPath : listOfLinks[0]);

  const LinksName = Object.fromEntries(
    links.map((link) => [link.to, link.label])
  );
  const LinksIcon = Object.fromEntries(
    links.map((link) => [link.to, link.icon])
  );

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
          className={
            iconMode ?
              (listOfLinks.includes(currentLinkPath) ? 
                "bg-pink-600 text-white rounded-full" :
                "text-slate-400 hover:text-pink-300"
              ) + 
              ' h-12 p-3 pr-1 active:scale-90 transition-all items-center justify-center flex cursor-pointer' :
              (listOfLinks.includes(currentLinkPath) ? 
                'text-[26px] text-pink-500 font-bold' : 
                'text-[24px] text-slate-400') +
              ' hover:bg-white/5 transition-all duration-300 pl-3 pr-1 py-1 rounded-full active:scale-95 tracking-tight cursor-pointer flex items-center'
          }
          onClick={() => setHidden(false)}
        >
          {
            iconMode ?
              <span style={{fontSize: '32px'}} className="material-symbols-outlined">
                {listOfLinks.includes(currentLinkPath) ? LinksIcon[currentLinkPath] : LinksIcon[lastUsedLink]}
              </span> :
              (listOfLinks.includes(currentLinkPath) ? LinksName[currentLinkPath] : LinksName[lastUsedLink])
          }

          <span
            className={
              (direction == 'up' ? (hidden ? '-rotate-z-180 ' : '') : (hidden ? '' : '-rotate-z-180 ')) +
              // (!hidden && direction === 'up' ? '-rotate-z-0' : '-rotate-z-180') +
              // (!hidden && direction === 'down' ? ' -rotate-z-180' : ' -rotate-z-0') +
              (iconMode ? (listOfLinks.includes(currentLinkPath) ? ' text-white' : 'text-slate-400') : (listOfLinks.includes(currentLinkPath) ? ' text-pink-500' :  ' text-slate-400')) + " material-symbols-outlined ml-1 pointer-events-none text-xl font-bold transition-all"
            }
          >
            expand_more
          </span>
        </button>

        <div
          ref={dropdownRef}
          className={
            (direction === "down" ? 'top-12' : 'bottom-12') +
            (hidden ? " opacity-0 pointer-events-none" : ' opacity-100 pointer-events-auto') +
            " flex flex-col absolute z-10 bg-slate-900 border-2 border-outline-variant/25 divide-y-2 divide-outline-variant/25 rounded-[1.3125rem] w-full hover:ring-2 hover:ring-white/8 overflow-hidden transition-all"
          }
        >
          {
            links.map((properties) => (
              <>
                <button
                  className={
                    (currentLinkPath === properties.to ?
                    "text-[21px] text-pink-500 font-bold" :
                    "text-[18px] hover:text-[21px] text-slate-400 hover:text-pink-500 hover:font-bold") +
                    " flex py-1 items-start cursor-pointer transition-all hover:bg-white/5"
                  }
                  onClick={() => {onGoto(properties.to); setHidden(true); setLastUsedLink(properties.to)}}
                >
                  <MarqueeText>{properties.label}</MarqueeText>
                </button>
              </>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default function DropdownMenu({
  links, iconMode = false, direction, onGoto
}: {
  links: {
    to: string;
    label: string;
    icon: string;
  }[][];
  iconMode?: boolean;
  direction: directionType;
  onGoto: (link: string) => void;
}) {
  const currentLinkPath = location.pathname;

  return (
    <>
      {
        links.map((link) => (
          <>
            {
              link.length === 1 
              ? link.map((properties) => (
                <>
                  <button
                    className={
                      iconMode ?
                      (currentLinkPath === properties.to ? 
                        'bg-pink-600 text-white rounded-full' : 
                        'text-slate-400 hover:text-pink-300') +
                        ' h-12 p-3 active:scale-90 transition-all items-center justify-center flex cursor-pointer' :
                      (currentLinkPath === properties.to ? 
                        'text-[26px] text-pink-500 font-bold' : 
                        'text-[24px] text-slate-400') +
                      ' hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight cursor-pointer flex items-center'
                    }
                    onClick={() => onGoto(properties.to)}
                  >
                    {
                      iconMode ?
                        <span style={{fontSize: '32px'}} className="material-symbols-outlined">
                          {properties.icon}
                        </span> :
                        properties.label
                    }
                  </button>
                </>
              ))
              : <DropdownMenuMore links={link} iconMode={iconMode} direction={direction} onGoto={(e) => onGoto(e)}/>
            }
          </>
        ))
      }
    </>
  )
}