import { Compass, Film, Heart, Home, LayoutGrid, LibraryBig, Menu, Search, Settings2, Sparkles, Tags, Tv, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCinevo, type Room } from "@/lib/cinevo-store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV: { id: Room; label: string; icon: typeof Sparkles }[] = [
  { id: "stage", label: "Home", icon: Sparkles },
  { id: "movies", label: "Movies", icon: Film },
  { id: "shows", label: "Series", icon: Tv },
  { id: "sidebar", label: "My library", icon: LibraryBig },
];

export function Shell({
  children,
  overlays,
}: {
  children: React.ReactNode;
  overlays?: React.ReactNode;
}) {
  const room = useCinevo((s) => s.room);
  const setRoom = useCinevo((s) => s.setRoom);
  const setSearchOpen = useCinevo((s) => s.setSearchOpen);
  const setSettingsOpen = useCinevo((s) => s.setSettingsOpen);
  const setCoreOpen = useCinevo((s) => s.setCoreOpen);
  const night = useCinevo((s) => s.prefs.nightMode);
  const zen = useCinevo((s) => s.prefs.zenMode);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!NAV.some((item) => item.id === room)) setRoom("stage");
  }, [room, setRoom]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const go = (id: Room) => {
    setRoom(id);
    setDrawer(false);
  };

  const primaryNav = [
    { label: "Home", id: "stage" as Room, icon: Home },
    { label: "Explore", id: "movies" as Room, icon: Compass },
    { label: "Genres", id: "movies" as Room, icon: Tags },
    { label: "Favourites", id: "sidebar" as Room, icon: Heart },
  ];

  const sidebar = (
    <aside className={cn("cinevo-sidebar", drawer && "is-open")} aria-label="CINEVO navigation">
      <div className="cinevo-sidebar__topline">
        <Link to="/" aria-label="CINEVO home" className="sidebar-brand" onClick={() => setDrawer(false)}>
          <Logo size="sm" tagline={false} />
        </Link>
        <button type="button" aria-label="Close navigation" className="sidebar-close md:hidden" onClick={() => setDrawer(false)}>
          <X size={18} />
        </button>
      </div>
      <button type="button" className="sidebar-search" onClick={() => { setSearchOpen(true); setDrawer(false); }}>
        <Search size={16} aria-hidden="true" /><span>Search your library</span><kbd>⌘ K</kbd>
      </button>
      <nav className="sidebar-nav" aria-label="Library">
        <span className="sidebar-label">Library</span>
        {primaryNav.map(({ label, id, icon: Icon }) => (
          <button key={label} type="button" className={cn(room === id && "is-active")} onClick={() => go(id)}>
            <Icon size={16} aria-hidden="true" /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-section">
        <span className="sidebar-label">Your space</span>
        <button type="button" onClick={() => { setCoreOpen(true); setDrawer(false); }}><LayoutGrid size={16} /><span>CINEVO Core</span><Sparkles size={13} className="sidebar-spark" /></button>
        <button type="button" onClick={() => { setSettingsOpen(true); setDrawer(false); }}><Settings2 size={16} /><span>Settings</span></button>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-privacy-note"><span className="sidebar-privacy-dot" /><span><b>Private by design</b><small>Only your selected libraries</small></span></div>
        <Link to="/" className="sidebar-logout"><LogOutIcon /><span>Exit library</span></Link>
      </div>
    </aside>
  );

  return (
    <div className={cn("cinevo-house", night && "cinevo-night", zen && "cinevo-zen")}>
      <div className="house-still" />
      <div className="house-ambient" />
      <div className="sidebar-mobile-bar md:hidden"><button type="button" aria-label="Open navigation" onClick={() => setDrawer(true)}><Menu size={18} /></button><span>My library</span><button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={18} /></button></div>
      <div className="cinevo-sidebar-desktop max-md:hidden">{sidebar}</div>
      {drawer ? <div className="sidebar-backdrop md:hidden" onMouseDown={() => setDrawer(false)}><div onMouseDown={(e) => e.stopPropagation()}>{sidebar}</div></div> : null}
      <header className="top-nav max-md:hidden">
        <div />
        <nav className="top-nav__links" aria-label="Quick navigation">
          <button type="button" onClick={() => setSearchOpen(true)}><Search size={16} /> Search</button>
          <button type="button" onClick={() => setCoreOpen(true)}><Sparkles size={16} /> Core</button>
        </nav>
        <div className="top-nav__tools"><button type="button" aria-label="Settings" className="top-nav__icon" onClick={() => setSettingsOpen(true)}><Settings2 size={18} /></button></div>
      </header>
      <main className={cn("house-main", room !== "stage" && "house-main--page")}>{children}</main>
      {overlays}
    </div>
  );
}

function LogOutIcon() {
  return <span className="sidebar-exit-mark" aria-hidden="true">↗</span>;
}
