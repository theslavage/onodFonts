import React, { useMemo } from "react";
import { RotateCcw } from "lucide-react";

import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useLanguage } from "../lib/i18n";
import { mockFonts } from "../data/mockFonts";

export interface FilterState {
    search: string;
    categories: string[];
    languages: string[];
    variableOnly: boolean;
    licenses: string[];
    sources: string[];
}

interface FilterPanelProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

type AggregatedSources = {
    mainSources: string[];
    otherSources: string[];
};

const CATEGORIES = [
    "sans-serif",
    "serif",
    "display",
    "handwriting",
    "monospaced",
] as const;

const LANGUAGES = ["Cyrillic", "Latin"] as const;

export const FilterPanel: React.FC<FilterPanelProps> = ({
                                                            filters,
                                                            setFilters,
                                                        }) => {
    const { t } = useLanguage();

    const { mainSources, otherSources }: AggregatedSources = useMemo(() => {
        const counts: Record<string, number> = {};

        mockFonts.forEach((font) => {
            const source = font.source;
            counts[source] = (counts[source] ?? 0) + 1;
        });

        const MIN_COUNT_FOR_MAIN = 10;

        const allSources = Object.keys(counts);
        const mainSources = allSources.filter(
            (source) => counts[source] >= MIN_COUNT_FOR_MAIN,
        );
        const otherSources = allSources.filter(
            (source) => counts[source] < MIN_COUNT_FOR_MAIN,
        );

        return { mainSources, otherSources };
    }, []);

    const updateFilter = <K extends keyof FilterState>(
        key: K,
        value: FilterState[K],
    ) => {
        setFilters((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const toggleArrayFilter = (
        key: "categories" | "languages" | "licenses" | "sources",
        value: string,
    ) => {
        setFilters((prevState) => {
            const currentValues = prevState[key];
            const isSelected = currentValues.includes(value);

            const updatedValues = isSelected
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            return {
                ...prevState,
                [key]: updatedValues,
            };
        });
    };

    const isOtherSelected = useMemo(
        () => otherSources.some((source) => filters.sources.includes(source)),
        [filters.sources, otherSources],
    );

    const toggleOtherSourcesGroup = () => {
        if (isOtherSelected) {
            const sourcesWithoutOthers = filters.sources.filter(
                (source) => !otherSources.includes(source),
            );
            updateFilter("sources", sourcesWithoutOthers);
            return;
        }

        const mergedSources = Array.from(
            new Set([...filters.sources, ...otherSources]),
        );
        updateFilter("sources", mergedSources);
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            categories: [],
            languages: [],
            variableOnly: false,
            licenses: [],
            sources: [],
        });
    };

    return (
        <div className="h-full w-full flex-shrink-0 bg-white p-6 overflow-y-auto font-sans">
            <div className="mb-8 flex items-center justify-between pb-4 border-b border-black">
                <h2 className="text-xs font-mono font-bold text-black uppercase tracking-widest">
                    {t("filters.title")}
                </h2>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[10px] font-mono font-bold text-neutral-400 hover:text-black flex items-center gap-1.5 transition-colors uppercase"
                >
                    <RotateCcw className="w-3 h-3" />
                    {t("filters.reset")}
                </button>
            </div>

            <div className="space-y-8">
                {/* Variable Toggle */}
                <div className="flex items-center justify-between py-2">
                    <Label
                        htmlFor="var-mode"
                        className="font-mono text-xs uppercase font-medium text-black cursor-pointer select-none"
                    >
                        {t("filters.variable")}
                    </Label>
                    <Switch
                        id="var-mode"
                        checked={filters.variableOnly}
                        onCheckedChange={(checked) =>
                            updateFilter("variableOnly", checked === true)
                        }
                        className="data-[state=checked]:bg-black border border-black"
                    />
                </div>

                <div className="space-y-8">
                    {/* Sources */}
                    <section className="space-y-4">
                        <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            {t("filters.platform")}
                        </h3>
                        <div className="space-y-2">
                            {mainSources.map((source) => (
                                <div
                                    key={source}
                                    className="flex items-center space-x-3 group"
                                >
                                    <Checkbox
                                        id={source}
                                        checked={filters.sources.includes(source)}
                                        onCheckedChange={() =>
                                            toggleArrayFilter("sources", source)
                                        }
                                        className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                                    />
                                    <Label
                                        htmlFor={source}
                                        className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none truncate"
                                    >
                                        {source}
                                    </Label>
                                </div>
                            ))}

                            {otherSources.length > 0 && (
                                <div className="flex items-center space-x-3 group pt-2 border-t border-dashed border-neutral-200 mt-2">
                                    <Checkbox
                                        id="source-other"
                                        checked={isOtherSelected}
                                        onCheckedChange={toggleOtherSourcesGroup}
                                        className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                                    />
                                    <Label
                                        htmlFor="source-other"
                                        className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none truncate"
                                    >
                                        {t("filters.other")}
                                    </Label>
                                </div>
                            )}
                        </div>
                        <div className="pt-2 border-t border-dashed border-neutral-200">
                            <p className="font-mono text-[9px] text-neutral-400 uppercase leading-normal">
                                {t("filters.platform.note")}
                            </p>
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="space-y-4">
                        <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            {t("filters.categories")}
                        </h3>
                        <div className="space-y-2">
                            {CATEGORIES.map((category) => (
                                <div
                                    key={category}
                                    className="flex items-center space-x-3 group"
                                >
                                    <Checkbox
                                        id={category}
                                        checked={filters.categories.includes(category)}
                                        onCheckedChange={() =>
                                            toggleArrayFilter("categories", category)
                                        }
                                        className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                                    />
                                    <Label
                                        htmlFor={category}
                                        className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none"
                                    >
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Languages */}
                    <section className="space-y-4">
                        <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            {t("filters.languages")}
                        </h3>
                        <div className="space-y-2">
                            {LANGUAGES.map((language) => (
                                <div
                                    key={language}
                                    className="flex items-center space-x-3 group"
                                >
                                    <Checkbox
                                        id={language}
                                        checked={filters.languages.includes(language)}
                                        onCheckedChange={() =>
                                            toggleArrayFilter("languages", language)
                                        }
                                        className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                                    />
                                    <Label
                                        htmlFor={language}
                                        className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none"
                                    >
                                        {language}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer / Credits */}
                <footer className="mt-12 pt-8 border-t border-black">
                    <p className="font-mono text-[10px] uppercase text-neutral-400 leading-relaxed">
                        Product by
                        <br />
                        <a
                            href="https://imon.agency/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black font-bold hover:bg-black hover:text-white transition-colors inline-block mt-1"
                        >
                            i&apos;MON Digital Agency
                        </a>
                    </p>
                    <p className="font-mono text-[10px] uppercase text-neutral-400 leading-relaxed mt-4">
                        {t("landing.agency.role")}
                        <br />
                        <a
                            href="https://t.me/slavage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black font-bold hover:bg-black hover:text-white transition-colors inline-block mt-1"
                        >
                            Yaroslav Tishchenko
                        </a>
                    </p>
                </footer>
            </div>
        </div>
    );
};
