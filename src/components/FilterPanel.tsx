import React, { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n";
import { mockFonts } from "@/data/mockFonts";

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

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  // Dynamic Source Calculation
  const { mainSources, otherSources } = useMemo(() => {
      const counts: Record<string, number> = {};
      mockFonts.forEach(f => {
          counts[f.source] = (counts[f.source] || 0) + 1;
      });
      
      const MIN_COUNT = 10;
      const main = Object.keys(counts).filter(s => counts[s] >= MIN_COUNT);
      const other = Object.keys(counts).filter(s => counts[s] < MIN_COUNT);
      
      return { mainSources: main, otherSources: other };
  }, []);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: "categories" | "languages" | "licenses" | "sources", value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  // Logic for "Other" group
  // We consider "Other" selected if AT LEAST ONE of the other sources is selected. 
  // But for a clean toggle behavior:
  // - If unchecked: select ALL other sources
  // - If checked (even partially): deselect ALL other sources
  const isOtherSelected = otherSources.some(s => filters.sources.includes(s));
  
  const toggleOther = () => {
      if (isOtherSelected) {
          // Deselect all
          const newSources = filters.sources.filter(s => !otherSources.includes(s));
          updateFilter("sources", newSources);
      } else {
          // Select all
          const newSources = Array.from(new Set([...filters.sources, ...otherSources]));
          updateFilter("sources", newSources);
      }
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

  const categories = ["sans-serif", "serif", "display", "handwriting", "monospaced"];
  const languages = ["Cyrillic", "Latin"];

  return (
    <div className="h-full w-full flex-shrink-0 bg-white p-6 overflow-y-auto font-sans">
      <div className="mb-8 flex items-center justify-between pb-4 border-b border-black">
        <h2 className="text-xs font-mono font-bold text-black uppercase tracking-widest">{t('filters.title')}</h2>
        <button 
            onClick={resetFilters} 
            className="text-[10px] font-mono font-bold text-neutral-400 hover:text-black flex items-center gap-1.5 transition-colors uppercase"
        >
          <RotateCcw className="w-3 h-3" /> {t('filters.reset')}
        </button>
      </div>

      <div className="space-y-8">
        {/* Variable Toggle */}
        <div className="flex items-center justify-between py-2">
            <Label htmlFor="var-mode" className="font-mono text-xs uppercase font-medium text-black cursor-pointer select-none">{t('filters.variable')}</Label>
            <Switch 
                id="var-mode" 
                checked={filters.variableOnly} 
                onCheckedChange={(c) => updateFilter("variableOnly", c)}
                className="data-[state=checked]:bg-black border border-black"
            />
        </div>

        <div className="space-y-8">
            {/* Sources */}
            <div className="space-y-4">
                <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('filters.platform')}</h3>
                <div className="space-y-2">
                    {mainSources.map((src) => (
                        <div key={src} className="flex items-center space-x-3 group">
                            <Checkbox 
                                id={src} 
                                checked={filters.sources.includes(src)}
                                onCheckedChange={() => toggleArrayFilter("sources", src)}
                                className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Label htmlFor={src} className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none truncate">{src}</Label>
                        </div>
                    ))}

                    {/* Other Group */}
                    {otherSources.length > 0 && (
                        <div className="flex items-center space-x-3 group pt-2 border-t border-dashed border-neutral-200 mt-2">
                            <Checkbox 
                                id="source-other" 
                                checked={isOtherSelected}
                                onCheckedChange={toggleOther}
                                className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Label htmlFor="source-other" className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none truncate">
                                {t('filters.other')}
                            </Label>
                        </div>
                    )}
                </div>
                <div className="pt-2 border-t border-dashed border-neutral-200">
                    <p className="font-mono text-[9px] text-neutral-400 uppercase leading-normal">
                        {t('filters.platform.note')}
                    </p>
                </div>
            </div>
            
            {/* Categories */}
            <div className="space-y-4">
                <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('filters.categories')}</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat} className="flex items-center space-x-3 group">
                            <Checkbox 
                                id={cat} 
                                checked={filters.categories.includes(cat)}
                                onCheckedChange={() => toggleArrayFilter("categories", cat)}
                                className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Label htmlFor={cat} className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none">{cat}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
                <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('filters.languages')}</h3>
                <div className="space-y-2">
                    {languages.map((lang) => (
                        <div key={lang} className="flex items-center space-x-3 group">
                            <Checkbox 
                                id={lang} 
                                checked={filters.languages.includes(lang)}
                                onCheckedChange={() => toggleArrayFilter("languages", lang)}
                                className="h-3 w-3 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Label htmlFor={lang} className="font-mono text-xs text-neutral-600 uppercase cursor-pointer group-hover:text-black transition-colors select-none">{lang}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Agency Credit */}
        <div className="mt-12 pt-8 border-t border-black">
            <p className="font-mono text-[10px] uppercase text-neutral-400 leading-relaxed">
                Product by <br/>
                <a 
                    href="https://imon.agency/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-black font-bold hover:bg-black hover:text-white transition-colors inline-block mt-1"
                >
                    i'MON Digital Agency
                </a>
            </p>
            <p className="font-mono text-[10px] uppercase text-neutral-400 leading-relaxed mt-4">
                {t('landing.agency.role')} <br/>
                <a 
                    href="https://t.me/imonsergei" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-black font-bold hover:bg-black hover:text-white transition-colors inline-block mt-1"
                >
                    Yaroslav Tishchenko
                </a>
            </p>
        </div>
      </div>
    </div>
  );
};
