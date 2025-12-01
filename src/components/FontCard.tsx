import React, { useState, useMemo, type CSSProperties } from "react";
import { Heart, Scale, Download, Check, Plus } from "lucide-react";

import { cn } from "../lib/utils";
import { useLanguage } from "../lib/i18n";
import type { FontCardProps } from "../types/FontCard.types";


export const FontCard: React.FC<FontCardProps> = ({
                                                      font,
                                                      previewText,
                                                      isFavorite,
                                                      isCompared,
                                                      layout = "list",
                                                      fontSize,
                                                      letterSpacing,
                                                      onToggleFavorite,
                                                      onToggleCompare,
                                                      onViewDetails,
                                                  }) => {
    const { t } = useLanguage();
    const [localWeight, setLocalWeight] = useState<number>(400);

    const displayPreview = previewText || font.name;

    const fontPreviewStyle: CSSProperties = useMemo(
        () => ({
            fontFamily: font.cssStack,
            fontWeight: font.variable ? localWeight : font.weights[0],
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}em`,
        }),
        [font.cssStack, font.variable, font.weights, fontSize, letterSpacing, localWeight],
    );

    const listPreviewStyle: CSSProperties = fontPreviewStyle;

    const gridPreviewStyle: CSSProperties = {
        ...fontPreviewStyle,
        fontSize: `${Math.min(fontSize, 60)}px`,
    };

    const shortId = useMemo(() => {
        const [, raw] = font.id.split("-");
        const base = (raw || font.id).substring(0, 4);
        return base.padStart(3, "0");
    }, [font.id]);

    if (layout === "list") {
        return (
            <div className="group border-b border-black bg-white min-h-[300px] flex flex-col md:flex-row transition-colors hover:bg-neutral-50">
                {/* Left: Technical Specs */}
                <div className="w-full md:w-72 flex-shrink-0 p-4 md:p-6 border-r border-black flex flex-col justify-between relative">
                    <div>
                        <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-tighter text-neutral-500">
                ID: {shortId}
              </span>
                        </div>

                        <h3
                            className="text-xl md:text-3xl font-bold tracking-tighter leading-none mb-1 cursor-pointer hover:underline decoration-2 underline-offset-4"
                            onClick={() => onViewDetails(font.id)}
                        >
                            {font.name}
                        </h3>
                        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide mb-8">
                            {font.author}
                        </p>

                        {/* Technical Controls */}
                        <div className="space-y-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                            {font.variable && (
                                <div className="space-y-2">
                                    <div className="flex justify-between font-mono text-[9px] uppercase">
                                        <span>Wt</span>
                                        <span>{localWeight}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={100}
                                        max={900}
                                        step={100}
                                        value={localWeight}
                                        onChange={(event) => {
                                            const value = Number(event.target.value);
                                            setLocalWeight(value);
                                        }}
                                        className="w-full h-px bg-black appearance-none cursor-pointer accent-black"
                                    />
                                </div>
                            )}

                            <div className="font-mono text-[9px] uppercase text-neutral-400">
                                {font.weights.length} {t("styles.available")}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-black/10 mt-auto">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleFavorite(font.id);
                            }}
                            className="hover:opacity-50 transition-opacity"
                        >
                            <Heart
                                className={cn(
                                    "w-4 h-4",
                                    isFavorite ? "fill-black" : "stroke-black",
                                )}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleCompare(font.id);
                            }}
                            className="hover:opacity-50 transition-opacity flex items-center gap-1 group/btn"
                        >
                            {isCompared ? (
                                <div className="bg-black text-white p-0.5">
                                    <Check className="w-3 h-3" />
                                </div>
                            ) : (
                                <Plus className="w-4 h-4 stroke-black group-hover/btn:stroke-neutral-500" />
                            )}
                            <span className="font-mono text-[9px] uppercase hidden group-hover/btn:inline">
                {isCompared ? t("card.inStack") : t("card.addToStack")}
              </span>
                        </button>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(font.sourceUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="hover:opacity-50 transition-opacity ml-auto"
                        >
                            <Download className="w-4 h-4 stroke-black" />
                        </button>
                    </div>
                </div>

                {/* Right: Preview Canvas */}
                <div
                    className="flex-grow flex flex-col relative p-4 md:p-6 cursor-pointer group-hover:bg-neutral-50/50 transition-colors overflow-hidden"
                    onClick={() => onViewDetails(font.id)}
                >
                    <div className="absolute top-2 right-2 font-mono text-[9px] text-neutral-300 uppercase">
                        + Preview
                    </div>

                    <div className="flex-grow flex items-center justify-center overflow-hidden">
                        <p
                            className="text-black leading-tight text-center break-words w-full transition-all duration-200"
                            style={listPreviewStyle}
                        >
                            {displayPreview}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-white border-r border-b border-black flex flex-col h-[350px] relative hover:bg-neutral-50 transition-colors">
            {/* Header */}
            <div className="p-3 flex justify-between items-start border-b border-black/10">
                <div>
                    <h3 className="font-bold text-sm text-black tracking-tight">
                        {font.name}
                    </h3>
                    <p className="font-mono text-[9px] text-neutral-500 uppercase">
                        {font.categories[0]}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onToggleFavorite(font.id)}
                    className="hover:opacity-70 transition-opacity"
                >
                    <Heart
                        className={cn(
                            "w-3 h-3",
                            isFavorite ? "fill-black" : "stroke-black",
                        )}
                    />
                </button>
            </div>

            {/* Preview */}
            <div
                className="flex-grow flex items-center justify-center p-4 cursor-pointer overflow-hidden"
                onClick={() => onViewDetails(font.id)}
            >
                <p
                    className="text-center leading-tight transition-all duration-200"
                    style={gridPreviewStyle}
                >
                    {displayPreview}
                </p>
            </div>

            {/* Footer */}
            <div className="h-10 px-4 border-t border-black/10 flex justify-between items-center">
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleCompare(font.id);
                    }}
                    className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-2"
                >
                    {isCompared ? (
                        <Check className="w-3 h-3" />
                    ) : (
                        <Plus className="w-3 h-3" />
                    )}
                    <span>{isCompared ? t("card.stacked") : t("card.stack")}</span>
                </button>

                {font.languages.includes("Cyrillic") && (
                    <span className="font-mono text-[10px] font-bold text-black uppercase tracking-widest">
            CYR
          </span>
                )}
            </div>
        </div>
    );
};
