import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { Font } from "../types/font.types";
import { FontCard } from "../components/FontCard";
import { FilterPanel, FilterState } from "../components/FilterPanel";
import { useFontFilter } from "../hooks/useFontFilter";
import {
    Search,
    LayoutGrid,
    List as ListIcon,
    Settings2,
    X,
    ArrowRight,
    MoveHorizontal,
    ChevronDown,
} from "lucide-react";
import { FontLoader } from "../components/FontLoader";
import { cn } from "../lib/utils";
import { useLanguage } from "../lib/i18n";

interface HomeProps {
    fonts: Font[];
    previewText: string;
    setPreviewText: (text: string) => void;
    favorites: string[];
    toggleFavorite: (id: string) => void;
    compareList: string[];
    toggleCompare: (id: string) => void;
    viewDetails: (id: string) => void;
    onOpenStack: () => void;
}

const PANGRAMS = {
    standard: "The quick brown fox jumps over the lazy dog.",
    ui: "Dashboard Settings Profile Logout Submit Cancel",
    editorial:
        "Typography is the craft of endowing human language with a durable visual form.",
    code: "function render(props: Props) { return <Component /> }",
    digits: "0123456789 £$€%&@+-=*",
} as const;

type PangramMode = keyof typeof PANGRAMS;

const INITIAL_BATCH_SIZE = 15;
const SCROLL_BATCH_SIZE = 15;
const SCROLL_THRESHOLD = 0.1;

type ViewMode = "grid" | "list";

export const HomePage: React.FC<HomeProps> = ({
                                                  fonts,
                                                  previewText,
                                                  setPreviewText,
                                                  favorites,
                                                  toggleFavorite,
                                                  compareList,
                                                  toggleCompare,
                                                  viewDetails,
                                                  onOpenStack,
                                              }) => {
    const { t } = useLanguage();

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        categories: [],
        languages: [],
        variableOnly: false,
        licenses: [],
        sources: [],
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [pangramMode, setPangramMode] = useState<PangramMode>("standard");


    const [globalFontSize, setGlobalFontSize] = useState<number>(64);
    const [globalLetterSpacing, setGlobalLetterSpacing] = useState<number>(0);

    const filteredFonts = useFontFilter(fonts, filters);

    const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const hasMoreFonts = visibleCount < filteredFonts.length;

    const currentFonts = useMemo(
        () => filteredFonts.slice(0, visibleCount),
        [filteredFonts, visibleCount]
    );

    const loadMore = useCallback(() => {
        if (!hasMoreFonts) return;

        setVisibleCount((prev) =>
            Math.min(prev + SCROLL_BATCH_SIZE, filteredFonts.length)
        );
    }, [filteredFonts.length, hasMoreFonts]);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: SCROLL_THRESHOLD }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore]);

    // Сброс видимого количества при смене фильтров
    useEffect(() => {
        setVisibleCount(INITIAL_BATCH_SIZE);
    }, [filters]);

    // Панграмы
    const handlePangramChange = (mode: PangramMode) => {
        setPangramMode(mode);
        setPreviewText(PANGRAMS[mode]);
    };

    // Удаление фильтров-чипов
    const removeCategory = (cat: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== cat),
        }));
    };

    const removeLanguage = (lang: string) => {
        setFilters((prev) => ({
            ...prev,
            languages: prev.languages.filter((l) => l !== lang),
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            categories: [],
            languages: [],
            variableOnly: false,
            licenses: [],
            sources: [],
        });
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.languages.length > 0 ||
        filters.variableOnly;

    // Шрифты в стеке сравнения
    const stackFonts = useMemo(
        () => fonts.filter((f) => compareList.includes(f.id)),
        [fonts, compareList]
    );

    return (
        <div className="flex flex-col min-h-screen bg-white w-full font-sans text-black pb-20">
            <FontLoader fonts={currentFonts} />

            {/* Sticky Toolbar */}
            <div className="sticky top-16 z-40 bg-white border-b border-black">
                <div className="flex flex-row items-stretch h-14 md:h-auto">
                    {/* Left: фильтр + поиск */}
                    <div className="flex items-center w-[35%] md:w-72 flex-shrink-0 border-r border-black p-2 md:p-4">
                        <button
                            className="md:hidden mr-2 p-1.5 border border-black hover:bg-black hover:text-white transition-colors flex-shrink-0"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative flex-grow min-w-0">
                            <Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black" />
                            <input
                                type="text"
                                placeholder={t("search.placeholder").toUpperCase()}
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                                }
                                className="h-8 md:h-10 w-full bg-transparent border-b border-transparent focus:border-black pl-5 pr-1 text-[10px] md:text-sm font-mono uppercase placeholder:text-neutral-400 focus:outline-none transition-all truncate"
                            />
                        </div>
                    </div>

                    {/* Center: глобальный превью-текст + типографика */}
                    <div className="relative flex-grow md:border-r border-black p-2 md:p-4 flex flex-col xl:flex-row items-center gap-6 justify-center">
                        {/* Input + контекст */}
                        <div className="flex-grow relative w-full flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={t("preview.placeholder").toUpperCase()}
                                value={previewText}
                                onChange={(e) => setPreviewText(e.target.value)}
                                className="h-8 md:h-10 flex-grow bg-transparent text-sm md:text-2xl font-light placeholder:text-neutral-200 focus:outline-none min-w-0"
                            />

                            {/* Dropdown контекстов */}
                            <div className="relative group shrink-0">
                                <button className="h-8 md:h-10 px-2 md:px-3 border border-transparent hover:border-black hover:bg-neutral-50 transition-all flex items-center gap-2 font-mono text-[10px] uppercase">
                                    <span className="hidden sm:inline">{pangramMode}</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                <div className="absolute top-full right-0 bg-white border border-black w-40 hidden group-hover:block z-50 shadow-xl">
                                    {(Object.keys(PANGRAMS) as PangramMode[]).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => handlePangramChange(mode)}
                                            className="w-full text-left px-4 py-2 text-xs font-mono uppercase hover:bg-black hover:text-white transition-colors"
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Controls: размер + трекинг */}
                        <div className="hidden md:flex flex-col sm:flex-row gap-6 w-full xl:w-auto shrink-0">
                            {/* Size slider */}
                            <div className="flex items-center gap-3 w-full sm:w-40">
                <span className="font-mono text-[10px] uppercase text-neutral-400 whitespace-nowrap w-20">
                  Size {globalFontSize}
                </span>
                                <input
                                    type="range"
                                    min={16}
                                    max={120}
                                    value={globalFontSize}
                                    onChange={(e) => setGlobalFontSize(Number(e.target.value))}
                                    className="w-full h-px bg-black appearance-none cursor-pointer accent-black"
                                />
                            </div>

                            {/* Tracking slider */}
                            <div className="flex items-center gap-3 w-full sm:w-40">
                                <div className="flex items-center gap-1 w-20">
                                    <MoveHorizontal className="w-3 h-3 text-neutral-400" />
                                    <span className="font-mono text-[10px] uppercase text-neutral-400 whitespace-nowrap">
                    {(globalLetterSpacing * 100).toFixed(0)}
                  </span>
                                </div>
                                <input
                                    type="range"
                                    min={-5}
                                    max={20}
                                    step={1}
                                    value={globalLetterSpacing * 100}
                                    onChange={(e) =>
                                        setGlobalLetterSpacing(Number(e.target.value) / 100)
                                    }
                                    className="w-full h-px bg-black appearance-none cursor-pointer accent-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: переключатель вида */}
                    <div className="hidden md:flex w-auto items-center justify-center p-4 gap-2 bg-white">
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-2 border border-black transition-all",
                                viewMode === "list"
                                    ? "bg-black text-white"
                                    : "hover:bg-neutral-100"
                            )}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-2 border border-black transition-all",
                                viewMode === "grid"
                                    ? "bg-black text-white"
                                    : "hover:bg-neutral-100"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-grow w-full relative">
                {/* Sidebar с фильтрами */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-black transform transition-transform duration-300 ease-in-out pt-32 md:pt-[137px] pb-10",
                        isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    )}
                >
                    <div className="h-full">
                        <FilterPanel filters={filters} setFilters={setFilters} />
                    </div>
                </div>

                {/* Основной контент */}
                <div
                    className={cn(
                        "flex-grow w-full transition-all duration-300 min-h-screen",
                        "md:pl-72"
                    )}
                >
                    {/* Активные фильтры + статистика */}
                    <div className="border-b border-black px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Chips */}
                            <div className="flex flex-wrap gap-2 items-center min-h-[24px]">
                                {filters.categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => removeCategory(cat)}
                                        className="flex items-center gap-1 bg-black text-white px-2 py-1 font-mono text-[10px] uppercase hover:bg-red-500 transition-colors group"
                                    >
                                        {cat}
                                        <X className="w-3 h-3 group-hover:scale-110" />
                                    </button>
                                ))}

                                {filters.languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => removeLanguage(lang)}
                                        className="flex items-center gap-1 border border-black px-2 py-1 font-mono text-[10px] uppercase hover:border-red-500 hover:text-red-500 transition-colors group"
                                    >
                                        {lang}
                                        <X className="w-3 h-3 group-hover:scale-110" />
                                    </button>
                                ))}

                                {filters.variableOnly && (
                                    <button
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                variableOnly: false,
                                            }))
                                        }
                                        className="flex items-center gap-1 bg-neutral-200 px-2 py-1 font-mono text-[10px] uppercase hover:bg-red-500 hover:text-white transition-colors group"
                                    >
                                        VAR ONLY
                                        <X className="w-3 h-3" />
                                    </button>
                                )}

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-[10px] font-mono uppercase underline decoration-neutral-300 hover:decoration-black underline-offset-2 text-neutral-400 hover:text-black ml-2"
                                    >
                                        {t("compare.clear")}
                                    </button>
                                )}

                                {!hasActiveFilters && (
                                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                    {t("filters.index")}
                  </span>
                                )}
                            </div>

                            <span className="font-mono text-xs font-bold shrink-0">
                {filteredFonts.length} {t("fonts.label").toUpperCase()}
              </span>
                        </div>
                    </div>

                    {/* Grid / List */}
                    <div
                        className={cn(
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-black"
                                : "flex flex-col"
                        )}
                    >
                        {currentFonts.map((font) => (
                            <FontCard
                                key={font.id}
                                font={font}
                                previewText={previewText}
                                isFavorite={favorites.includes(font.id)}
                                isCompared={compareList.includes(font.id)}
                                fontSize={globalFontSize}
                                letterSpacing={globalLetterSpacing}
                                onToggleFavorite={toggleFavorite}
                                onToggleCompare={toggleCompare}
                                onViewDetails={viewDetails}
                                layout={viewMode}
                            />
                        ))}
                    </div>

                    {/* Infinite scroll marker */}
                    <div
                        ref={loadMoreRef}
                        className="h-32 flex items-center justify-center border-t border-black"
                    >
                        {hasMoreFonts && (
                            <div className="font-mono text-xs animate-pulse">
                                {t("status.loading").toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Stack Bar */}
            {compareList.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white p-2 shadow-2xl w-[90vw] max-w-2xl flex items-center justify-between border border-neutral-800">
                    <div className="flex items-center gap-4 overflow-x-auto px-2">
            <span className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap text-neutral-400 hidden sm:inline">
              {t("compare.stack")} ({compareList.length}/3)
            </span>
                        {stackFonts.map((f) => (
                            <div
                                key={f.id}
                                className="flex items-center gap-2 bg-neutral-900 px-2 py-1 border border-neutral-800"
                            >
                <span className="font-bold text-xs whitespace-nowrap">
                  {f.name}
                </span>
                                <button
                                    onClick={() => toggleCompare(f.id)}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onOpenStack}
                        className="ml-4 bg-white text-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>{t("compare.construct")}</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* Mobile overlay for фильтров */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
};
