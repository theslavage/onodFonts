import React, { useEffect, useState } from "react";
import { Search, Moon, Sun, LayoutGrid, Heart, Scale, Info, X, ArrowRight, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Font } from "@/data/mockFonts";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fonts: Font[];
  actions: {
    toggleTheme: () => void;
    navigate: (page: string) => void;
    selectFont: (id: string) => void;
    clearFilters: () => void;
  };
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ open, setOpen, fonts, actions }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on query
  const filteredFonts = query 
    ? fonts.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const staticCommands = [
    { id: "nav-home", label: "Go to Index", icon: LayoutGrid, action: () => actions.navigate("home") },
    { id: "nav-compare", label: "Go to Workbench", icon: Scale, action: () => actions.navigate("compare") },
    { id: "nav-fav", label: "Go to Favorites", icon: Heart, action: () => actions.navigate("favorites") },
    { id: "theme", label: "Toggle Theme", icon: Sun, action: () => actions.toggleTheme() },
    { id: "clear", label: "Clear Filters", icon: Trash2, action: () => actions.clearFilters() },
  ];

  const items = [
    ...staticCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
    ...filteredFonts.map(f => ({ 
        id: f.id, 
        label: f.name, 
        icon: ArrowRight, 
        action: () => actions.selectFont(f.id),
        meta: "Typeface"
    }))
  ];

  // Reset selection when query changes
  useEffect(() => setSelectedIndex(0), [query]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + items.length) % items.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[selectedIndex]) {
            items[selectedIndex].action();
            setOpen(false);
            setQuery("");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, items, selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-2xl bg-white border-black shadow-2xl overflow-hidden rounded-none top-[20%] translate-y-0">
        
        {/* Input */}
        <div className="flex items-center border-b border-black px-4 py-4">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search fonts..."
            className="flex-grow text-lg bg-transparent border-none focus:outline-none font-mono uppercase placeholder:text-neutral-300"
            autoFocus
          />
          <div className="hidden sm:flex gap-2">
              <kbd className="bg-neutral-100 border border-neutral-200 px-2 py-1 text-[10px] font-mono rounded">↑↓</kbd>
              <kbd className="bg-neutral-100 border border-neutral-200 px-2 py-1 text-[10px] font-mono rounded">↵</kbd>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
            {items.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 font-mono text-xs uppercase tracking-widest">
                    No results found
                </div>
            ) : (
                items.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            item.action();
                            setOpen(false);
                            setQuery("");
                        }}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-left transition-colors group",
                            index === selectedIndex ? "bg-black text-white" : "hover:bg-neutral-50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-4 h-4", index === selectedIndex ? "text-white" : "text-neutral-400 group-hover:text-black")} />
                            <span className="font-mono text-sm uppercase tracking-wide">{item.label}</span>
                        </div>
                        {/* @ts-ignore */}
                        {item.meta && (
                            <span className={cn("text-[10px] font-mono uppercase border px-1.5 py-0.5", index === selectedIndex ? "border-white text-white" : "border-black/20 text-neutral-400")}>
                                {/* @ts-ignore */}
                                {item.meta}
                            </span>
                        )}
                    </button>
                ))
            )}
        </div>
        
        {/* Footer */}
        <div className="bg-neutral-50 border-t border-black/10 px-4 py-2 flex justify-between items-center">
             <span className="font-mono text-[10px] uppercase text-neutral-400">Pro Tip: Use ⌘K to open this anytime</span>
             <span className="font-mono text-[10px] uppercase text-neutral-400">v2.1</span>
        </div>

      </DialogContent>
    </Dialog>
  );
};
