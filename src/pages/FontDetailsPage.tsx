import React, { useState, useMemo, useEffect } from "react";
import { Font } from "../types/font.types";
import {
    ArrowLeft,
    Heart,
    AlignLeft,
    AlignCenter,
    AlignRight,
    RefreshCw,
    Check,
    ChevronDown,
    Plus,
    Minus,
    FileCode,
    Globe,
    Layers,
} from "lucide-react";
import { FontLoader } from "../components/FontLoader";
import { cn } from "../lib/utils";
import { mockFonts } from "../data/mockFonts";
import { useLanguage } from "../lib/i18n";

interface FontDetailsProps {
    font: Font;
    onBack: () => void;
    toggleFavorite: (id: string) => void;
    isFavorite: boolean;
    toggleCompare: (id: string) => void;
    isCompare: boolean;
    previewText?: string;
}

type TextAlign = "left" | "center" | "right";

export const FontDetailsPage: React.FC<FontDetailsProps> = ({
                                                                font,
                                                                onBack,
                                                                toggleFavorite,
                                                                isFavorite,
                                                                toggleCompare,
                                                                isCompare,
                                                                previewText,
                                                            }) => {
    const { t } = useLanguage();

    const [testText, setTestText] = useState(
        previewText || "The quick brown fox jumps over the lazy dog."
    );
    const [fontSize, setFontSize] = useState<number>(64);
    const [lineHeight, setLineHeight] = useState<number>(1.2);
    const [letterSpacing, setLetterSpacing] = useState<number>(0);
    const [textAlign, setTextAlign] = useState<TextAlign>("left");
    const [activeTab, setActiveTab] = useState<"specimen" | "glyphs" | "about">(
        "specimen"
    );

    const [selectedWeight, setSelectedWeight] = useState<string>("400");

    useEffect(() => {
        if (font?.weights?.length > 0) {
            setSelectedWeight(font.weights[0]);
        } else {
            setSelectedWeight("400");
        }
    }, [font]);

    const glyphsUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const glyphsLower = "abcdefghijklmnopqrstuvwxyz";
    const glyphsNum = "0123456789";
    const glyphsSym = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";


    const pairingSuggestion = useMemo<Font | null>(() => {
        const isSerif = font.categories.includes("serif");
        const targetCat = isSerif ? "sans-serif" : "serif";

        const candidates = mockFonts.filter((f) =>
            f.categories.includes(targetCat)
        );

        if (!candidates.length) return null;

        const seed = font.id
            .split("")
            .reduce((acc, c) => acc + c.charCodeAt(0), 0);

        return candidates[seed % candidates.length] || candidates[0];
    }, [font]);

    const fontsToLoad = useMemo<Font[]>(() => {
        const list: Font[] = [font];
        if (pairingSuggestion) list.push(pairingSuggestion);
        return list;
    }, [font, pairingSuggestion]);

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
            <FontLoader fonts={fontsToLoad} />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-black flex justify-between items-center h-16">
                <button
                    onClick={onBack}
                    className="h-full px-6 border-r border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest hidden sm:inline">
            {t("details.back")}
          </span>
                </button>

                <div className="flex-grow flex items-center justify-center px-4 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 line-clamp-1">
            {font.name}{" "}
              <span className="mx-2 text-neutral-200">/</span>{" "}
              {font.categories.join(" + ")}
          </span>
                </div>

                <div className="flex h-full shrink-0">
                    {/* Compare Button */}
                    <button
                        onClick={() => toggleCompare(font.id)}
                        className="h-full px-6 border-l border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                        title={
                            isCompare ? t("card.removeFromCompare") : t("card.addToCompare")
                        }
                    >
                        {isCompare ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={() => toggleFavorite(font.id)}
                        className="h-full px-6 border-l border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4",
                                isFavorite ? "fill-black hover:fill-white" : ""
                            )}
                        />
                    </button>

                    <button
                        onClick={() => window.open(font.sourceUrl, "_blank")}
                        className="h-full px-8 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors hidden sm:flex items-center"
                    >
                        {t("details.download")}
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col xl:flex-row">
                {/* Left Sidebar: Technical Data */}
                <div className="w-full xl:w-80 border-b xl:border-b-0 xl:border-r border-black p-8 flex-shrink-0 bg-neutral-50/30 flex flex-col gap-12">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tighter leading-none mb-6 break-words">
                            {font.name}
                        </h1>
                        <div className="space-y-6 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                            <div className="flex justify-between border-b border-neutral-200 pb-1">
                                <span>{t("details.foundry")}</span>
                                <span className="text-black font-bold">{font.author}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 pb-1">
                                <span>{t("details.license")}</span>
                                <span className="text-black">{font.license}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 pb-1">
                                <span>{t("details.weights")}</span>
                                <span className="text-black">{font.weights.length}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 pb-1">
                                <span>{t("details.source")}</span>
                                <span className="text-black">{font.source}</span>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Pairing Module */}
                    {pairingSuggestion && (
                        <div className="border border-black bg-white p-4">
                            <h3 className="font-mono text-[10px] uppercase tracking-widest mb-4 text-neutral-400 flex items-center gap-2">
                                <RefreshCw className="w-3 h-3" /> {t("details.pair")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div
                                        className="text-4xl mb-1"
                                        style={{ fontFamily: font.cssStack }}
                                    >
                                        Ag
                                    </div>
                                    <div className="font-mono text-[9px] uppercase text-neutral-400">
                                        {t("details.mainHeader")}
                                    </div>
                                </div>
                                <div className="h-px bg-black/10 w-full" />
                                <div>
                                    <div
                                        className="text-4xl mb-1"
                                        style={{ fontFamily: pairingSuggestion.cssStack }}
                                    >
                                        Ag
                                    </div>
                                    <div className="font-mono text-[9px] uppercase text-neutral-400">
                                        {t("details.bodyText")} ({pairingSuggestion.name})
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content: Interactive Laboratory */}
                <div className="flex-grow bg-white flex flex-col min-w-0">
                    {/* Tab Controls */}
                    <div className="flex border-b border-black">
                        <button
                            onClick={() => setActiveTab("specimen")}
                            className={cn(
                                "flex-1 py-4 text-center font-mono text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors border-r border-black",
                                activeTab === "specimen" ? "bg-black text-white hover:bg-black" : ""
                            )}
                        >
                            {t("details.lab")}
                        </button>
                        <button
                            onClick={() => setActiveTab("glyphs")}
                            className={cn(
                                "flex-1 py-4 text-center font-mono text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors border-r border-black",
                                activeTab === "glyphs" ? "bg-black text-white hover:bg-black" : ""
                            )}
                        >
                            {t("details.glyphs")}
                        </button>
                        <button
                            onClick={() => setActiveTab("about")}
                            className={cn(
                                "flex-1 py-4 text-center font-mono text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors",
                                activeTab === "about" ? "bg-black text-white hover:bg-black" : ""
                            )}
                        >
                            {t("details.about")}
                        </button>
                    </div>

                    {/* Lab Workspace */}
                    <div className="flex-grow flex flex-col relative">
                        {activeTab === "specimen" && (
                            <>
                                {/* Toolbar */}
                                <div className="sticky top-0 z-20 bg-white border-b border-black p-4 flex flex-wrap items-center gap-6 md:gap-8">
                                    {/* Size */}
                                    <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="font-mono text-[10px] uppercase text-neutral-400 w-8">
                      {t("details.size")}
                    </span>
                                        <input
                                            type="range"
                                            min={12}
                                            max={200}
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="w-24 h-px bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black"
                                        />
                                        <span className="font-mono text-[10px] w-6">
                      {fontSize}
                    </span>
                                    </div>

                                    {/* Line Height */}
                                    <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="font-mono text-[10px] uppercase text-neutral-400 w-8">
                      {t("details.line")}
                    </span>
                                        <input
                                            type="range"
                                            min={0.8}
                                            max={2.5}
                                            step={0.1}
                                            value={lineHeight}
                                            onChange={(e) =>
                                                setLineHeight(Number(e.target.value))
                                            }
                                            className="w-24 h-px bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black"
                                        />
                                        <span className="font-mono text-[10px] w-6">
                      {lineHeight.toFixed(1)}
                    </span>
                                    </div>

                                    {/* Tracking */}
                                    <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="font-mono text-[10px] uppercase text-neutral-400 w-8">
                      {t("details.track")}
                    </span>
                                        <input
                                            type="range"
                                            min={-0.1}
                                            max={0.5}
                                            step={0.01}
                                            value={letterSpacing}
                                            onChange={(e) =>
                                                setLetterSpacing(Number(e.target.value))
                                            }
                                            className="w-24 h-px bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black"
                                        />
                                        <span className="font-mono text-[10px] w-6">
                      {letterSpacing.toFixed(2)}
                    </span>
                                    </div>

                                    {/* Weight Selector */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 border border-black px-3 py-2 font-mono text-xs uppercase hover:bg-neutral-100 min-w-[100px] justify-between">
                                            <span>{selectedWeight}</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                        <div className="absolute top-full left-0 w-full bg-white border border-black border-t-0 hidden group-hover:block shadow-xl max-h-40 overflow-y-auto z-50">
                                            {font.weights.map((w) => (
                                                <button
                                                    key={w}
                                                    onClick={() => setSelectedWeight(w)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 font-mono text-xs hover:bg-black hover:text-white transition-colors",
                                                        selectedWeight === w ? "bg-neutral-100" : ""
                                                    )}
                                                >
                                                    {w}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alignment */}
                                    <div className="flex border border-black ml-auto">
                                        <button
                                            onClick={() => setTextAlign("left")}
                                            className={cn(
                                                "p-2 hover:bg-neutral-100",
                                                textAlign === "left" &&
                                                "bg-black text-white hover:bg-black"
                                            )}
                                        >
                                            <AlignLeft className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setTextAlign("center")}
                                            className={cn(
                                                "p-2 border-l border-r border-black hover:bg-neutral-100",
                                                textAlign === "center" &&
                                                "bg-black text-white hover:bg-black"
                                            )}
                                        >
                                            <AlignCenter className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setTextAlign("right")}
                                            className={cn(
                                                "p-2 hover:bg-neutral-100",
                                                textAlign === "right" &&
                                                "bg-black text-white hover:bg-black"
                                            )}
                                        >
                                            <AlignRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-grow overflow-y-auto p-8 md:p-16 bg-white">
                  <textarea
                      value={testText}
                      onChange={(e) => setTestText(e.target.value)}
                      className="w-full min-h-[50vh] resize-none bg-transparent focus:outline-none placeholder:text-neutral-200"
                      style={{
                          fontFamily: font.cssStack,
                          fontSize: `${fontSize}px`,
                          lineHeight,
                          letterSpacing: `${letterSpacing}em`,
                          textAlign,
                          fontWeight: selectedWeight,
                      }}
                  />

                                    {/* Waterfall of Weights */}
                                    <div className="mt-32 space-y-16 border-t border-black pt-16">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8">
                                            {t("details.allWeights")}
                                        </h3>
                                        {font.weights.map((weight) => (
                                            <div
                                                key={weight}
                                                className="space-y-2 group cursor-pointer"
                                                onClick={() => setSelectedWeight(weight)}
                                            >
                                                <div className="flex items-center gap-4 font-mono text-xs text-neutral-400 uppercase tracking-widest group-hover:text-black transition-colors">
                          <span
                              className={
                                  weight === selectedWeight
                                      ? "text-black font-bold"
                                      : ""
                              }
                          >
                            {weight}
                          </span>
                                                    <div className="h-px flex-grow bg-neutral-100 group-hover:bg-black transition-colors" />
                                                </div>
                                                <p
                                                    style={{
                                                        fontFamily: font.cssStack,
                                                        fontWeight: weight,
                                                        fontSize: "48px",
                                                        lineHeight: 1.1,
                                                    }}
                                                    className="break-words"
                                                >
                                                    {font.name} {weight}
                                                </p>
                                                <p
                                                    style={{
                                                        fontFamily: font.cssStack,
                                                        fontWeight: weight,
                                                        fontSize: "16px",
                                                        lineHeight: 1.5,
                                                    }}
                                                    className="max-w-2xl"
                                                >
                                                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz
                                                    0123456789
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "glyphs" && (
                            <div className="p-8 md:p-16 overflow-y-auto">
                                <div className="space-y-16">
                                    <GlyphSection
                                        title={t("details.uppercase")}
                                        chars={glyphsUpper}
                                        font={font}
                                    />
                                    <GlyphSection
                                        title={t("details.lowercase")}
                                        chars={glyphsLower}
                                        font={font}
                                    />
                                    <GlyphSection
                                        title={t("details.numerals")}
                                        chars={glyphsNum + glyphsSym}
                                        font={font}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div className="p-8 md:p-16 h-full overflow-y-auto bg-neutral-50/20">
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 max-w-6xl">
                                    {/* Left Column: Narrative & License */}
                                    <div className="xl:col-span-2 flex flex-col gap-12">
                                        <div>
                                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-black" />
                                                {" // 001. SYSTEM DESCRIPTION"}
                                            </h3>
                                            <p className="text-3xl md:text-5xl font-light leading-[1.1] text-black tracking-tight">
                                                {font.description}
                                            </p>
                                        </div>

                                        {/* License Block */}
                                        <div>
                                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-neutral-300" />
                                                {" // 002. LICENSE PROTOCOL"}
                                            </h3>
                                            <div className="border border-black bg-white p-0 relative group overflow-hidden transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-black transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                                <div className="p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Check className="w-4 h-4 text-black" />
                                                            <h4 className="font-mono text-xs uppercase font-bold tracking-widest text-black">
                                                                {t("details.commercial")}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-neutral-500 leading-relaxed font-medium max-w-md">
                                                            {t("details.licenseDesc").replace(
                                                                "{license}",
                                                                font.license
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0">
                            <span className="font-mono text-xs font-bold uppercase border-2 border-black px-4 py-2 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
                              {font.license}
                            </span>
                                                    </div>
                                                </div>

                                                {/* Decorative corner */}
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-black" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Tech Specs */}
                                    <div className="space-y-8 xl:border-l border-black/10 xl:pl-12">
                                        {/* Tech Header */}
                                        <div className="hidden xl:block">
                                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-neutral-200" />
                                                {" // 003. TECH SPECS"}
                                            </h3>
                                        </div>

                                        {/* Matrix Grid */}
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="border-t border-black pt-4">
                                                <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] uppercase text-neutral-400">
                            Classification
                          </span>
                                                    <Layers className="w-4 h-4 text-neutral-300" />
                                                </div>
                                                <div className="text-xl uppercase font-bold tracking-tight flex flex-wrap gap-2">
                                                    {font.categories.map((cat) => (
                                                        <span key={cat}>{cat}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="border-t border-black pt-4">
                                                <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] uppercase text-neutral-400">
                            File Architecture
                          </span>
                                                    <FileCode className="w-4 h-4 text-neutral-300" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="font-mono text-[9px] text-neutral-400 uppercase mb-1">
                                                            Format
                                                        </div>
                                                        <div className="font-mono text-sm font-bold">
                                                            WOFF2 / TTF
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-[9px] text-neutral-400 uppercase mb-1">
                                                            Version
                                                        </div>
                                                        <div className="font-mono text-sm font-bold">
                                                            v{font.variable ? "2.0 VAR" : "1.0 STD"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-[9px] text-neutral-400 uppercase mb-1">
                                                            Glyph Set
                                                        </div>
                                                        <div className="font-mono text-sm font-bold">
                                                            {font.languages.includes("Cyrillic")
                                                                ? "450+"
                                                                : "230+"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-[9px] text-neutral-400 uppercase mb-1">
                                                            Variable Axis
                                                        </div>
                                                        <div className="font-mono text-sm font-bold">
                                                            {font.variable ? "WGHT" : "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-black pt-4">
                                                <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[10px] uppercase text-neutral-400">
                            Language Support
                          </span>
                                                    <Globe className="w-4 h-4 text-neutral-300" />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {font.languages.map((lang) => (
                                                        <span
                                                            key={lang}
                                                            className="font-mono text-[10px] uppercase border border-neutral-200 px-2 py-1 bg-white text-neutral-600 hover:border-black hover:text-black transition-colors cursor-default"
                                                        >
                              {lang}
                            </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GlyphSectionProps {
    title: string;
    chars: string;
    font: Font;
}

const GlyphSection: React.FC<GlyphSectionProps> = ({ title, chars, font }) => (
    <div>
        <h3 className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-black pb-2">
            {title}
        </h3>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-px bg-neutral-200 border border-neutral-200">
            {chars.split("").map((char) => (
                <div
                    key={char}
                    className="bg-white aspect-square flex items-center justify-center text-2xl hover:bg-black hover:text-white transition-colors hover:scale-125 hover:z-10 hover:shadow-xl cursor-default"
                    style={{ fontFamily: font.cssStack }}
                >
                    {char}
                </div>
            ))}
        </div>
    </div>
);
