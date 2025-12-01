import React, { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  Search,
  LayoutGrid,
  Heart,
  Scale,
  Sun,
  ArrowRight,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "../lib/utils";
import { Font } from "../types/font.types";

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

type StaticCommandId = "nav-home" | "nav-compare" | "nav-fav" | "theme" | "clear";

interface BaseItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  meta?: string;
  kind: "command" | "font";
}

export const CommandMenu: React.FC<CommandMenuProps> = ({open, setOpen, fonts, actions,}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const staticCommandsConfig: Array<{
    id: StaticCommandId;
    label: string;
    icon: LucideIcon;
    buildAction: () => () => void;
  }> = useMemo(
      () => [
        {
          id: "nav-home",
          label: "Go to Index",
          icon: LayoutGrid,
          buildAction: () => () => actions.navigate("home"),
        },
        {
          id: "nav-compare",
          label: "Go to Workbench",
          icon: Scale,
          buildAction: () => () => actions.navigate("compare"),
        },
        {
          id: "nav-fav",
          label: "Go to Favorites",
          icon: Heart,
          buildAction: () => () => actions.navigate("favorites"),
        },
        {
          id: "theme",
          label: "Toggle Theme",
          icon: Sun,
          buildAction: () => () => actions.toggleTheme(),
        },
        {
          id: "clear",
          label: "Clear Filters",
          icon: Trash2,
          buildAction: () => () => actions.clearFilters(),
        },
      ],
      [actions]
  );

  const filteredFonts = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();

    return fonts
        .filter((font) => font.name.toLowerCase().includes(lower))
        .slice(0, 5);
  }, [fonts, query]);

  const filteredCommands = useMemo<BaseItem[]>(() => {
    const lower = query.toLowerCase();

    return staticCommandsConfig
        .filter(({ label }) =>
            lower ? label.toLowerCase().includes(lower) : true
        )
        .map<BaseItem>(({ id, label, icon, buildAction }) => ({
          id,
          label,
          icon,
          action: buildAction(),
          kind: "command",
        }));
  }, [query, staticCommandsConfig]);

  const items: BaseItem[] = useMemo(() => {
    const fontItems: BaseItem[] = filteredFonts.map((font) => ({
      id: font.id,
      label: font.name,
      icon: ArrowRight,
      action: () => actions.selectFont(font.id),
      meta: "Typeface",
      kind: "font",
    }));

    return [...filteredCommands, ...fontItems];
  }, [filteredCommands, filteredFonts, actions]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, items.length]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  const handleItemClick = (item: BaseItem) => {
    item.action();
    handleClose();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((current) => (current + 1) % items.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((current) =>
          current - 1 < 0 ? items.length - 1 : current - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const current = items[selectedIndex];
      if (current) {
        handleItemClick(current);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
            className={cn(
                "p-0 gap-0 max-w-2xl bg-white border-black shadow-2xl",
                "overflow-hidden rounded-none top-[20%] translate-y-0"
            )}
            onKeyDown={handleKeyDown}
        >
          <div className="flex items-center border-b border-black px-4 py-4">
            <Search className="w-5 h-5 text-neutral-400 mr-3" />
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a command or search fonts..."
                className="flex-grow text-lg bg-transparent border-none focus:outline-none font-mono uppercase placeholder:text-neutral-300"
                autoFocus
            />
            <div className="hidden sm:flex gap-2">
              <kbd className="bg-neutral-100 border border-neutral-200 px-2 py-1 text-[10px] font-mono rounded">
                ↑↓
              </kbd>
              <kbd className="bg-neutral-100 border border-neutral-200 px-2 py-1 text-[10px] font-mono rounded">
                ↵
              </kbd>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2">
            {items.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 font-mono text-xs uppercase tracking-widest">
                  No results found
                </div>
            ) : (
                items.map((item, index) => {
                  const isActive = index === selectedIndex;

                  return (
                      <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className={cn(
                              "w-full flex items-center justify-between px-4 py-3 text-left transition-colors group",
                              isActive
                                  ? "bg-black text-white"
                                  : "hover:bg-neutral-50"
                          )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                              className={cn(
                                  "w-4 h-4",
                                  isActive
                                      ? "text-white"
                                      : "text-neutral-400 group-hover:text-black"
                              )}
                          />
                          <span className="font-mono text-sm uppercase tracking-wide">
                      {item.label}
                    </span>
                        </div>

                        {item.meta && (
                            <span
                                className={cn(
                                    "text-[10px] font-mono uppercase border px-1.5 py-0.5",
                                    isActive
                                        ? "border-white text-white"
                                        : "border-black/20 text-neutral-400"
                                )}
                            >
                      {item.meta}
                    </span>
                        )}
                      </button>
                  );
                })
            )}
          </div>

          <div className="bg-neutral-50 border-t border-black/10 px-4 py-2 flex justify-between items-center">
          <span className="font-mono text-[10px] uppercase text-neutral-400">
            Pro Tip: Use ⌘K to open this anytime
          </span>
            <span className="font-mono text-[10px] uppercase text-neutral-400">
            v2.1
          </span>
          </div>
        </DialogContent>
      </Dialog>
  );
};
