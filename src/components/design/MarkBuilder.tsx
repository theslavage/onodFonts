import React, {
    useState,
    useRef,
    useEffect,
    type MouseEvent as ReactMouseEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Trash2 } from "lucide-react";
import { useLanguage } from "../../lib/i18n";

const GRID_SIZE = 5;
const DEFAULT_DOT_SPACING = 80;
const DOT_SPACING_MD = 70;
const DOT_SPACING_SM = 60;
const GLYPH_ANIMATION_DELAY = 150;

type GlyphKey = string;

interface LineSegment {
    start: number;
    end: number;
}

interface MousePosition {
    x: number;
    y: number;
}

const GLYPHS: Record<GlyphKey, LineSegment[]> = {
    A: [
        { start: 20, end: 10 },
        { start: 10, end: 2 },
        { start: 2, end: 14 },
        { start: 14, end: 24 },
        { start: 11, end: 13 },
    ],
    B: [
        { start: 0, end: 20 },
        { start: 0, end: 2 },
        { start: 2, end: 12 },
        { start: 12, end: 10 },
        { start: 12, end: 14 },
        { start: 14, end: 24 },
        { start: 24, end: 20 },
    ],
    C: [
        { start: 4, end: 0 },
        { start: 0, end: 20 },
        { start: 20, end: 24 },
    ],
    E: [
        { start: 4, end: 0 },
        { start: 0, end: 20 },
        { start: 20, end: 24 },
        { start: 10, end: 13 },
    ],
    F: [
        { start: 20, end: 0 },
        { start: 0, end: 4 },
        { start: 10, end: 13 },
    ],
    H: [
        { start: 0, end: 20 },
        { start: 4, end: 24 },
        { start: 10, end: 14 },
    ],
    I: [
        { start: 1, end: 3 },
        { start: 2, end: 22 },
        { start: 21, end: 23 },
    ],
    K: [
        { start: 0, end: 10 },
        { start: 10, end: 20 },
        { start: 4, end: 11 },
        { start: 11, end: 10 },
        { start: 10, end: 17 },
        { start: 17, end: 24 },
    ],
    L: [
        { start: 0, end: 20 },
        { start: 20, end: 24 },
    ],
    M: [
        { start: 20, end: 0 },
        { start: 0, end: 12 },
        { start: 12, end: 4 },
        { start: 4, end: 24 },
    ],
    N: [
        { start: 20, end: 0 },
        { start: 0, end: 24 },
        { start: 24, end: 4 },
    ],
    O: [
        { start: 0, end: 4 },
        { start: 4, end: 24 },
        { start: 24, end: 20 },
        { start: 20, end: 0 },
    ],
    P: [
        { start: 20, end: 0 },
        { start: 0, end: 4 },
        { start: 4, end: 14 },
        { start: 14, end: 10 },
    ],
    R: [
        { start: 20, end: 0 },
        { start: 0, end: 4 },
        { start: 4, end: 14 },
        { start: 14, end: 10 },
        { start: 12, end: 24 },
    ],
    S: [
        { start: 4, end: 0 },
        { start: 0, end: 10 },
        { start: 10, end: 14 },
        { start: 14, end: 24 },
        { start: 24, end: 20 },
    ],
    T: [
        { start: 0, end: 4 },
        { start: 2, end: 22 },
    ],
    U: [
        { start: 0, end: 20 },
        { start: 20, end: 24 },
        { start: 24, end: 4 },
    ],
    V: [
        { start: 0, end: 22 },
        { start: 22, end: 4 },
    ],
    W: [
        { start: 0, end: 20 },
        { start: 20, end: 12 },
        { start: 12, end: 24 },
        { start: 24, end: 4 },
    ],
    X: [
        { start: 0, end: 24 },
        { start: 4, end: 20 },
    ],
    Y: [
        { start: 0, end: 12 },
        { start: 4, end: 12 },
        { start: 12, end: 22 },
    ],
    Z: [
        { start: 0, end: 4 },
        { start: 4, end: 20 },
        { start: 20, end: 24 },
    ],
};

function areSegmentsEqual(a: LineSegment, b: LineSegment): boolean {
    return (
        (a.start === b.start && a.end === b.end) ||
        (a.start === b.end && a.end === b.start)
    );
}

function getGridCoords(index: number, spacing: number): MousePosition {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
        x: col * spacing,
        y: row * spacing,
    };
}

const MarkBuilder: React.FC = () => {
    const { t } = useLanguage();

    const [lines, setLines] = useState<LineSegment[]>([]);
    const [currentGlyph, setCurrentGlyph] = useState<GlyphKey>("");
    const [dotSpacing, setDotSpacing] = useState<number>(DEFAULT_DOT_SPACING);

    const [drawingSource, setDrawingSource] = useState<number | null>(null);
    const [hoveredDot, setHoveredDot] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const timeoutsRef = useRef<number[]>([]);

    const resetAnimationTimeouts = () => {
        timeoutsRef.current.forEach((timeoutId) => {
            window.clearTimeout(timeoutId);
        });
        timeoutsRef.current = [];
    };

    const animateGlyph = (glyphKey: GlyphKey) => {
        const glyphLines = GLYPHS[glyphKey];
        let accumulated: LineSegment[] = [];

        resetAnimationTimeouts();
        setLines([]);

        glyphLines.forEach((segment, index) => {
            const timeoutId = window.setTimeout(() => {
                accumulated = [...accumulated, segment];
                setLines([...accumulated]);
            }, index * GLYPH_ANIMATION_DELAY);

            timeoutsRef.current.push(timeoutId);
        });
    };

    const generateGlyph = (explicitGlyph?: GlyphKey) => {
        const glyphKeys = Object.keys(GLYPHS);
        let nextGlyph: GlyphKey | undefined = explicitGlyph;

        if (!nextGlyph) {
            const random = glyphKeys[Math.floor(Math.random() * glyphKeys.length)];

            if (random === currentGlyph && glyphKeys.length > 1) {
                const candidates = glyphKeys.filter((key) => key !== currentGlyph);
                nextGlyph =
                    candidates[Math.floor(Math.random() * candidates.length)];
            } else {
                nextGlyph = random;
            }
        }

        if (!nextGlyph) return;

        setCurrentGlyph(nextGlyph);
        setDrawingSource(null);
        animateGlyph(nextGlyph);
    };

    const clearCanvas = () => {
        resetAnimationTimeouts();
        setLines([]);
        setCurrentGlyph("");
        setDrawingSource(null);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 400) {
                setDotSpacing(DOT_SPACING_SM);
            } else if (window.innerWidth < 640) {
                setDotSpacing(DOT_SPACING_MD);
            } else {
                setDotSpacing(DEFAULT_DOT_SPACING);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Первичная анимация
        const initialTimeoutId = window.setTimeout(() => {
            generateGlyph("K");
        }, 500);

        timeoutsRef.current.push(initialTimeoutId);

        return () => {
            window.removeEventListener("resize", handleResize);
            resetAnimationTimeouts();
        };
    }, []);

    const handleDotClick = (index: number, e: ReactMouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (drawingSource === null) {
            setDrawingSource(index);
            return;
        }

        if (drawingSource === index) {
            setDrawingSource(null);
            return;
        }

        const candidate: LineSegment = { start: drawingSource, end: index };
        const existingIndex = lines.findIndex((segment) =>
            areSegmentsEqual(segment, candidate)
        );

        if (existingIndex >= 0) {
            // удаляем существующую линию
            const updated = [...lines];
            updated.splice(existingIndex, 1);
            setLines(updated);
        } else {
            // добавляем новую
            setLines([...lines, candidate]);
        }

        setDrawingSource(index);
        setCurrentGlyph("");
    };

    const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    useEffect(() => {
        if (drawingSource === null) return;

        const handleGlobalClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;

            if (!target) return;
            if (!target.closest("[data-dot='true']")) {
                setDrawingSource(null);
            }
        };

        window.addEventListener("click", handleGlobalClick);

        return () => {
            window.removeEventListener("click", handleGlobalClick);
        };
    }, [drawingSource]);

    const modeLabel =
        drawingSource !== null
            ? "DRAWING"
            : lines.length > 0
                ? "ACTIVE"
                : "IDLE";

    const Controls: React.FC = () => (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    generateGlyph();
                }}
                className="h-12 px-8 bg-black text-white flex items-center justify-center gap-3 hover:bg-neutral-800 active:scale-95 transition-all duration-200 group w-full md:w-auto"
            >
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
          Generate / RND
        </span>
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    clearCanvas();
                }}
                className="h-12 px-8 border border-black bg-white text-black flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition-all duration-200 group w-full md:w-auto"
            >
                <Trash2 className="w-3 h-3" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
          {t("compare.clear")}
        </span>
            </button>
        </div>
    );

    const FooterInfo: React.FC = () => (
        <div className="flex justify-between items-end font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
            <div className="flex flex-col gap-1">
                <span>Grid: 5x5 Cartesian</span>
                <span>Mode: {modeLabel}</span>
            </div>
            <div className="flex items-center gap-4">
                {currentGlyph && (
                    <span className="text-black font-bold">
            Symbol: {currentGlyph}
          </span>
                )}
                <span>Vectors: {lines.length}</span>
            </div>
        </div>
    );

    return (
        <section className="relative bg-white border-b border-black overflow-hidden flex flex-col w-full">
            <div className="flex flex-col lg:flex-row min-h-[600px] w-full">
                {/* LEFT: Text & Controls */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-white relative z-10">
                    <div className="flex flex-col items-start max-w-xl">
                        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.8]">
                            {t("compare.construct")}
                        </h2>

                        <p className="text-neutral-500 text-sm font-mono uppercase tracking-wide leading-relaxed mb-12 max-w-md">
                            {t("landing.method.s3.desc")}
                        </p>

                        <div className="hidden lg:block w-full">
                            <Controls />
                        </div>
                    </div>

                    <div className="hidden lg:block mt-16 pt-8 border-t border-black/10">
                        <FooterInfo />
                    </div>
                </div>

                {/* RIGHT Canvas */}
                <div
                    className="w-full lg:w-1/2 min-h-[400px] lg:min-h-auto relative bg-white flex items-center justify-center select-none overflow-hidden border-b border-black lg:border-none"
                    onMouseMove={handleMouseMove}
                >
                    <div
                        ref={containerRef}
                        className="relative z-10 transition-all duration-300"
                        style={{
                            width: (GRID_SIZE - 1) * dotSpacing,
                            height: (GRID_SIZE - 1) * dotSpacing,
                        }}
                    >
                        {/* LINES */}
                        <svg
                            className="absolute inset-0 overflow-visible pointer-events-none"
                            style={{ zIndex: 0, left: 0, top: 0 }}
                        >
                            <AnimatePresence>
                                {lines.map((segment, index) => {
                                    const start = getGridCoords(segment.start, dotSpacing);
                                    const end = getGridCoords(segment.end, dotSpacing);

                                    return (
                                        <motion.line
                                            key={`${segment.start}-${segment.end}-${index}`}
                                            x1={start.x}
                                            y1={start.y}
                                            x2={end.x}
                                            y2={end.y}
                                            stroke="black"
                                            strokeWidth={4.5}
                                            strokeLinecap="square"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "circOut" }}
                                        />
                                    );
                                })}
                            </AnimatePresence>

                            {drawingSource !== null && (
                                <line
                                    x1={getGridCoords(drawingSource, dotSpacing).x}
                                    y1={getGridCoords(drawingSource, dotSpacing).y}
                                    x2={
                                        hoveredDot !== null
                                            ? getGridCoords(hoveredDot, dotSpacing).x
                                            : mousePosition.x
                                    }
                                    y2={
                                        hoveredDot !== null
                                            ? getGridCoords(hoveredDot, dotSpacing).y
                                            : mousePosition.y
                                    }
                                    stroke="black"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    className="opacity-50"
                                />
                            )}
                        </svg>

                        {/* DOTS */}
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                            const { x, y } = getGridCoords(index, dotSpacing);
                            const isActive = drawingSource === index;
                            const isConnected = lines.some(
                                (segment) =>
                                    segment.start === index || segment.end === index
                            );
                            const isHovered = hoveredDot === index;

                            return (
                                <div
                                    key={index}
                                    data-dot="true"
                                    onClick={(e) => handleDotClick(index, e)}
                                    onMouseEnter={() => setHoveredDot(index)}
                                    onMouseLeave={() => setHoveredDot(null)}
                                    className="absolute flex items-center justify-center group cursor-pointer"
                                    style={{
                                        left: x,
                                        top: y,
                                        width: 40,
                                        height: 40,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <div
                                        className={`rounded-full transition-all duration-300 ${
                                            isActive
                                                ? "bg-black w-4 h-4 ring-4 ring-black/10"
                                                : isConnected || isHovered
                                                    ? "bg-black w-3 h-3"
                                                    : "bg-neutral-200 w-1.5 h-1.5"
                                        }`}
                                    />
                                    {!isActive && (
                                        <div className="absolute w-8 h-8 rounded-full border border-black/10 scale-0 group-hover:scale-100 transition-transform duration-200 pointer-events-none" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Coords markers */}
                    <div className="absolute top-8 left-8 font-mono text-[9px] text-neutral-300 pointer-events-none">
                        0,0
                    </div>
                    <div className="absolute bottom-8 right-8 font-mono text-[9px] text-neutral-300 pointer-events-none">
                        {GRID_SIZE - 1},{GRID_SIZE - 1}
                    </div>
                </div>

                {/* MOBILE controls + footer под канвасом */}
                <div className="lg:hidden p-8 bg-white flex flex-col gap-8">
                    <Controls />
                    <div className="pt-8 border-t border-black/10">
                        <FooterInfo />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarkBuilder;
