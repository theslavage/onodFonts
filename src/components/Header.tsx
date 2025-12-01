import React, { useCallback, useState } from "react";
import {
    Menu,
    Heart,
    Scale,
    X,
    type LucideIcon,
    Info,
    LayoutGrid,
    Moon,
    Sun,
    Globe,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../lib/i18n";

export type PageId = "home" | "compare" | "favorites" | "about";

export interface HeaderProps {
    activePage: PageId;
    setActivePage: (page: PageId) => void;
    favoritesCount: number;
    compareCount: number;
    isInverted: boolean;
    toggleInvert: () => void;
}

interface NavItemProps {
    page: PageId;
    label: string;
    icon?: LucideIcon;
    count?: number;
    isActive: boolean;
    onSelect: (page: PageId) => void;
}


const NavItem: React.FC<NavItemProps> = ({
                                             page,
                                             label,
                                             icon: Icon,
                                             count,
                                             isActive,
                                             onSelect,
                                         }) => {
    const handleClick = () => onSelect(page);

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "h-full px-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors border-l border-black first:border-l-0 hover:bg-neutral-100",
                isActive ? "bg-black text-white hover:bg-neutral-800" : "text-black",
            )}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
            {typeof count === "number" && count > 0 && (
                <span
                    className={cn(
                        "ml-1 px-1.5 py-0.5 text-[10px] font-bold border",
                        isActive ? "border-white text-white" : "border-black text-black",
                    )}
                >
          {count}
        </span>
            )}
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({
                                                  activePage,
                                                  setActivePage,
                                                  favoritesCount,
                                                  compareCount,
                                                  isInverted,
                                                  toggleInvert,
                                              }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language, setLanguage } = useLanguage();

    const handleSelectPage = useCallback(
        (page: PageId) => {
            setActivePage(page);
            setIsMobileMenuOpen(false);},
        [setActivePage],
    );

    const handleToggleLanguage = useCallback(() => {
        setLanguage(language === "en" ? "ru" : "en");
    }, [language, setLanguage]);

    const handleLogoClick = () => setActivePage("home");

    return (
        <header className="sticky top-0 z-[60] w-full border-b border-black bg-white">
            <div className="flex h-16 items-stretch justify-between">
                {/* Logo Area */}
                <div
                    className="flex items-center px-6 cursor-pointer hover:bg-black hover:text-white transition-colors border-r-0 md:border-r border-black md:min-w-[288px]"
                    onClick={handleLogoClick}
                >
                    <svg
                        className="flex items-center"
                        width="110"
                        height="22"
                        viewBox="0 0 215 42"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="ONOD FONTS"
                    >
                        <path d="M95.6187 0.572388H105.919V40.6288H91.8992L64.6036 10.5865V40.6288H54.3033V0.572388H68.2659L95.6187 30.6719V0.572388Z" />
                        <path d="M25.1783 41.2009C7.5535 41.2009 0 33.8763 0 20.5432C0 7.26738 7.5535 0 25.1783 0C42.7459 0 50.3567 7.32461 50.3567 20.5432C50.3567 33.8191 42.7459 41.2009 25.1783 41.2009ZM25.1783 32.5602C35.8791 32.5602 40.0564 28.7262 40.0564 20.5432C40.0564 12.4175 35.9363 8.64075 25.1783 8.64075C14.4203 8.64075 10.3002 12.3603 10.3002 20.5432C10.3002 28.7834 14.4775 32.5602 25.1783 32.5602Z" />
                        <path d="M194.62 0C205.469 0 215 6.50638 215 20.3324C215 34.1585 205.469 40.6648 194.62 40.6648H164.169V0H194.62ZM190.544 31.8929C198.696 31.8929 204.21 30.2082 204.21 20.3324C204.21 10.4567 198.696 8.77199 190.544 8.77199H174.959V31.8929H190.544Z" />
                        <path d="M160.216 21.1173C160.001 33.8904 152.523 41.042 135.609 41.197C137.8 30.5317 146.715 22.4077 157.717 21.3565L160.216 21.1173ZM111.804 21.3565C122.803 22.4076 131.715 30.5278 133.909 41.1889C117.366 40.8831 110.102 33.8208 109.871 21.1718L111.804 21.3565ZM135.7 0.00402832C152.412 0.180978 159.878 7.1619 160.209 19.6622L157.717 19.4246C146.86 18.3872 138.036 10.462 135.7 0.00402832ZM133.818 0.0129801C131.478 10.4663 122.658 18.3874 111.804 19.4246L109.879 19.6077C110.223 7.23158 117.476 0.337704 133.818 0.0129801Z" />
                    </svg>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-stretch h-full ml-auto">
                    <button
                        type="button"
                        onClick={handleToggleLanguage}
                        className="h-full px-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors border-l border-black hover:bg-neutral-100"
                        title="Switch Language"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{language === "en" ? "RU" : "EN"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleInvert}
                        className={cn(
                            "h-full px-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors border-l border-black hover:bg-neutral-100",
                            isInverted && "bg-black text-white",
                        )}
                        title="Invert Mode"
                    >
                        {isInverted ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <NavItem
                        page="home"
                        label={t("nav.catalog")}
                        icon={LayoutGrid}
                        isActive={activePage === "home"}
                        onSelect={handleSelectPage}
                    />
                    <NavItem
                        page="compare"
                        label={t("nav.compare")}
                        icon={Scale}
                        count={compareCount}
                        isActive={activePage === "compare"}
                        onSelect={handleSelectPage}
                    />
                    <NavItem
                        page="favorites"
                        label={t("nav.favorites")}
                        icon={Heart}
                        count={favoritesCount}
                        isActive={activePage === "favorites"}
                        onSelect={handleSelectPage}
                    />
                    <NavItem
                        page="about"
                        label={t("nav.about")}
                        icon={Info}
                        isActive={activePage === "about"}
                        onSelect={handleSelectPage}
                    />
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        className="px-6 border-l border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                        onClick={handleToggleLanguage}
                    >
            <span className="text-xs font-mono font-bold">
              {language.toUpperCase()}
            </span>
                    </button>

                    <button
                        type="button"
                        className="px-6 border-l border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                        onClick={toggleInvert}
                    >
                        {isInverted ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        type="button"
                        className="px-6 border-l border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-50 bg-white flex flex-col overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => handleSelectPage("home")}
                        className="flex items-center justify-between p-8 border-b border-black hover:bg-black hover:text-white transition-colors group"
                    >
            <span className="text-4xl font-bold tracking-tighter uppercase">
              {t("nav.catalog")}
            </span>
                        <LayoutGrid className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectPage("compare")}
                        className="flex items-center justify-between p-8 border-b border-black hover:bg-black hover:text-white transition-colors group"
                    >
                        <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold tracking-tighter uppercase">
                {t("nav.compare")}
              </span>
                            {compareCount > 0 && (
                                <span className="font-mono text-xl">({compareCount})</span>
                            )}
                        </div>
                        <Scale className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectPage("favorites")}
                        className="flex items-center justify-between p-8 border-b border-black hover:bg-black hover:text-white transition-colors group"
                    >
                        <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold tracking-tighter uppercase">
                {t("nav.favorites")}
              </span>
                            {favoritesCount > 0 && (
                                <span className="font-mono text-xl">({favoritesCount})</span>
                            )}
                        </div>
                        <Heart className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectPage("about")}
                        className="flex items-center justify-between p-8 border-b border-black hover:bg-black hover:text-white transition-colors group"
                    >
            <span className="text-4xl font-bold tracking-tighter uppercase">
              {t("nav.about")}
            </span>
                        <Info className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}
        </header>
    );
};
