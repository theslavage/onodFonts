import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    type MotionValue,
} from "motion/react";
import { ArrowUpRight, Scan, Grid, Layers, Box, Send, Plus } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { Link } from "react-router-dom";
import sergeiPhoto from "@/assets/photo.png";

import MarkBuilder from "../components/design/MarkBuilder";

interface AboutPageProps {
    onNavigateHome?: () => void;
}

const Noise: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full">
            <filter id="noise">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.80"
                    numOctaves="4"
                    stitchTiles="stitch"
                />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>
);

interface SystemCoordinatesProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

const SystemCoordinates: React.FC<SystemCoordinatesProps> = ({ mouseX, mouseY }) => {
    const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const update = () =>
            setCoords({
                x: Math.round(mouseX.get()),
                y: Math.round(mouseY.get()),
            });

        const unsubscribeX = mouseX.on("change", update);
        const unsubscribeY = mouseY.on("change", update);

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [mouseX, mouseY]);

    return (
        <div className="font-mono text-[10px] text-neutral-400 text-right leading-tight">
            <div className="flex gap-4">
                <span>POS_X: {coords.x.toString().padStart(4, "0")}</span>
                <span>POS_Y: {coords.y.toString().padStart(4, "0")}</span>
            </div>
        </div>
    );
};

interface HeroLetterProps {
    char: string;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

const HeroLetter: React.FC<HeroLetterProps> = ({ char, mouseX, mouseY }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [weight, setWeight] = useState<number>(800);
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const update = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mX = mouseX.get();
            const mY = mouseY.get();

            const dist = Math.hypot(mX - centerX, mY - centerY);
            const radius = 800;

            if (dist < radius) {
                const factor = 1 - dist / radius;
                setWeight(800 - factor * 700);
                setScale(1 + factor * 0.1);
            } else {
                setWeight(800);
                setScale(1);
            }
        };

        const unsubscribeX = mouseX.on("change", update);
        const unsubscribeY = mouseY.on("change", update);

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [mouseX, mouseY]);

    const roundedWeight = Math.round(weight);

    return (
        <div
            ref={ref}
            className="inline-block select-none transition-all duration-75 ease-linear text-black"
            style={{
                fontWeight: roundedWeight,
                transform: `scale(${scale})`,
                fontVariationSettings: `"wght" ${roundedWeight}`,
                willChange: "transform, font-weight",
            }}
        >
            {char}
        </div>
    );
};

interface KineticLetterProps {
    char: string;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

const KineticLetter: React.FC<KineticLetterProps> = ({ char, mouseX, mouseY }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [weight, setWeight] = useState<number>(100);
    const [slant, setSlant] = useState<number>(0);

    useEffect(() => {
        const update = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mX = mouseX.get();
            const mY = mouseY.get();

            const dist = Math.hypot(mX - centerX, mY - centerY);
            const radius = 400;

            if (dist < radius) {
                const factor = 1 - dist / radius;
                setWeight(100 + factor * 800); // 100 → 900
                setSlant((mX - centerX) * 0.05);
            } else {
                setWeight(100);
                setSlant(0);
            }
        };

        const unsubscribeX = mouseX.on("change", update);
        const unsubscribeY = mouseY.on("change", update);

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [mouseX, mouseY]);

    const roundedWeight = Math.round(weight);

    return (
        <div
            ref={ref}
            className="text-[15vw] leading-none select-none transition-all duration-75 ease-linear"
            style={{
                fontWeight: roundedWeight,
                fontVariationSettings: `"wght" ${roundedWeight}, "slnt" ${slant}`,
                transform: `skewX(${-slant}deg)`,
            }}
        >
            {char}
        </div>
    );
};

type MethodStep = {
    title: string;
    desc: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    // Mouse for Kinetic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (onNavigateHome) onNavigateHome();
        else window.location.href = "/";
    };

    const methodSteps: MethodStep[] = [
        { title: t("landing.method.s1.title"), desc: t("landing.method.s1.desc"), icon: Scan },
        { title: t("landing.method.s2.title"), desc: t("landing.method.s2.desc"), icon: Grid },
        { title: t("landing.method.s3.title"), desc: t("landing.method.s3.desc"), icon: Layers },
        { title: t("landing.method.s4.title"), desc: t("landing.method.s4.desc"), icon: Box },
    ];

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden relative"
        >
            <Noise />

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[80vh] md:min-h-screen flex flex-col border-b border-black overflow-hidden">
                <div className="absolute top-24 right-6 z-40 pointer-events-none hidden md:block">
                    <SystemCoordinates mouseX={mouseX} mouseY={mouseY} />
                    <div className="mt-1 opacity-50 font-mono text-[10px] text-neutral-400 text-right">
                        SYSTEM_ACTIVE
                    </div>
                </div>

                <div className="relative z-10 flex flex-col flex-grow p-6 md:p-12">
                    {/* Main Typographic Statement */}
                    <motion.div
                        style={{ y: yHero, opacity: opacityHero }}
                        className="flex-grow flex flex-col justify-center items-start w-full"
                    >
                        <div className="text-[35vw] md:text-[22vw] leading-[0.75] uppercase tracking-tighter text-black select-none flex flex-col w-full cursor-crosshair">
                            {/* Row 1: TYPE */}
                            <div className="flex justify-start w-full">
                                {["T", "Y", "P", "E"].map((char) => (
                                    <HeroLetter
                                        key={`hero-type-${char}`}
                                        char={char}
                                        mouseX={mouseX}
                                        mouseY={mouseY}
                                    />
                                ))}
                            </div>

                            {/* Row 2: IS (Indented) */}
                            <div className="flex justify-start ml-2 md:ml-12 font-serif italic text-[35vw] md:text-[22vw] w-full">
                                {["I", "S"].map((char) => (
                                    <HeroLetter
                                        key={`hero-is-${char}`}
                                        char={char}
                                        mouseX={mouseX}
                                        mouseY={mouseY}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Footer of Hero */}
                    <div className="w-full mt-12 md:mt-24 relative">
                        <div className="w-full md:w-64 h-px bg-black mb-4" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 max-w-xs leading-relaxed">
                                ИНДУСТРИАЛЬНЫЙ ИНДЕКС ОТКРЫТОЙ
                                <br />
                                ТИПОГРАФИКИ.
                            </p>
                            <div className="md:hidden font-mono text-[10px] text-neutral-400">
                                SCROLL TO EXPLORE ///
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HUGE STATEMENT (Sticky) --- */}
            <section className="relative border-b border-black">
                <div className="relative z-10 p-6 md:p-12">
                    <h2 className="text-3xl md:text-[6vw] leading-[1] font-medium tracking-tighter uppercase mix-blend-multiply max-w-4xl">
                        "{t("landing.impact.desc")}"
                    </h2>
                    <div className="mt-8 md:mt-12 flex justify-start md:justify-end">
                        <p className="text-sm md:text-xl font-sans text-neutral-500">— ONOD Philosophy</p>
                    </div>
                </div>
            </section>

            {/* --- THE CREATOR / ARCHITECT --- */}
            <section className="relative w-full bg-black text-white overflow-hidden border-b border-black">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:min-h-[100vh]">
                    {/* Left: Info & Context */}
                    <div className="p-6 md:p-12 flex flex-col justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/20 bg-black min-h-[50vh] lg:min-h-0">
                        <div>
              <span className="inline-block px-3 py-1 border border-white/30 rounded-full font-mono text-[10px] uppercase tracking-widest mb-8">
                {t("landing.agency.architect_label")}
              </span>
                            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
                                {t("landing.agency.headline_1")}
                                <br />
                                <span className="text-neutral-500">
                  {t("landing.agency.headline_connect")}
                </span>
                                <br />
                                {t("landing.agency.headline_2")}
                            </h3>
                            <p className="text-neutral-400 text-sm md:text-lg max-w-md leading-relaxed">
                                {t("landing.agency.desc")}
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-12">
                            <a
                                href="https://imon.agency"
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center justify-between border-b border-white/20 pb-4 hover:border-white transition-colors"
                            >
                <span className="font-mono text-xs uppercase tracking-widest">
                  {t("landing.agency.link_agency")}
                </span>
                                <div className="flex items-center gap-2 font-bold text-lg md:text-xl group-hover:translate-x-2 transition-transform">
                                    IMON.AGENCY <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </a>
                            <a
                                href="https://t.me/imonsergei"
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center justify-between border-b border-white/20 pb-4 hover:border-white transition-colors"
                            >
                <span className="font-mono text-xs uppercase tracking-widest">
                  {t("landing.agency.link_contact")}
                </span>
                                <div className="flex items-center gap-2 font-bold text-lg md:text-xl group-hover:translate-x-2 transition-transform">
                                    TELEGRAM <Send className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right: The Photo Reveal */}
                    <div className="relative order-1 lg:order-2 h-[50vh] lg:h-auto overflow-hidden group cursor-none">
                        {/* The Image */}
                        <div className="absolute inset-0">
                            <div className="w-full h-full scale-x-[-1]">
                                <img
                                    src={sergeiPhoto}
                                    alt="Sergei Otcheskov"
                                    className="w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                            </div>
                            {/* Scanline Overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        </div>

                        {/* Huge Overlaid Text (Mix Blend Mode) */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 mix-blend-difference pointer-events-none z-20">
                            <div className="flex justify-between items-start">
                                <Scan className="w-8 h-8 text-white opacity-50" />
                                <span className="font-mono text-xs text-white uppercase tracking-widest">
                  Fig. 03
                </span>
                            </div>

                            <h2 className="text-white text-[12vw] lg:text-[8vw] leading-[0.8] font-bold uppercase tracking-tighter text-right">
                                Sergei
                                <br />
                                Otcheskov
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- METHODOLOGY GRID --- */}
            <section className="border-b border-black bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
                    {methodSteps.map((step, i) => (
                        <div
                            key={step.title}
                            className={`relative p-6 md:p-12 border-b sm:border-b-0 ${
                                i !== 3 ? "sm:border-r border-black" : ""
                            } group hover:bg-black hover:text-white transition-colors duration-300 flex flex-col min-h-[200px] md:h-full`}
                        >
                            <div className="flex justify-between items-start mb-8 md:mb-12">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                  0{i + 1}
                </span>
                                <step.icon className="w-5 h-5 opacity-50" />
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl md:text-3xl font-bold uppercase mb-2 md:mb-4 tracking-tighter md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                                    {step.title}
                                </h3>
                                <div className="h-auto md:h-20 overflow-visible md:overflow-hidden relative">
                                    <p className="text-xs md:text-sm leading-relaxed text-neutral-500 md:text-inherit md:opacity-0 md:group-hover:opacity-80 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 delay-75 md:absolute bottom-0 left-0 right-0">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- KINETIC VARIABLE FONT INTERACTIVE BLOCK --- */}
            <section className="relative h-[50vh] min-h-[400px] md:h-[600px] bg-white border-b border-black overflow-hidden flex flex-col items-center justify-center cursor-crosshair group">
                <div className="flex justify-center items-center gap-1 md:gap-4 w-full overflow-hidden px-2 md:px-4">
                    {["S", "Y", "S", "T", "E", "M"].map((char) => (
                        <KineticLetter
                            key={`system-${char}`}
                            char={char}
                            mouseX={mouseX}
                            mouseY={mouseY}
                        />
                    ))}
                </div>
                <p className="mt-8 md:mt-12 font-mono text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">
                    Variable Weight Axis [100 — 900]
                </p>

                {/* Decorative Markers */}
                <Plus className="absolute top-6 left-6 w-4 h-4 text-black" />
                <Plus className="absolute top-6 right-6 w-4 h-4 text-black" />
                <Plus className="absolute bottom-6 left-6 w-4 h-4 text-black" />
                <Plus className="absolute bottom-6 right-6 w-4 h-4 text-black" />
            </section>

            {/* --- MARK BUILDER --- */}
            <MarkBuilder />

            {/* --- TICKER --- */}
            <div className="bg-black text-white py-4 overflow-hidden border-b border-black">
                <motion.div
                    className="whitespace-nowrap flex gap-12 font-mono text-sm uppercase tracking-widest font-bold"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="flex items-center gap-12">
              Typography is not just reading. It is seeing.
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
                    ))}
                </motion.div>
            </div>

            {/* --- CTA (FIXED) --- */}
            <section className="bg-white text-black relative w-full">
                <button
                    onClick={handleCtaClick}
                    className="relative w-full py-24 md:py-48 flex flex-col items-center justify-center group overflow-hidden border-b border-black"
                    aria-label="Start Project"
                >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1] z-0" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center group-hover:text-white transition-colors duration-300">
            <span className="block font-mono text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-8 opacity-50">
              Ready for deployment
            </span>
                        <h2 className="text-[15vw] md:text-[12vw] leading-none font-bold tracking-tighter">
                            {t("landing.cta")}
                        </h2>
                    </div>
                </button>
            </section>

            {/* --- FOOTER --- */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white gap-4">
                <div className="flex flex-col gap-1">
                    <span>ONOD Fonts © 2025</span>
                    <span>San Francisco / Moscow</span>
                </div>
                <div className="flex gap-6">
                    <Link to="/privacy" className="hover:text-black cursor-pointer transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/terms" className="hover:text-black cursor-pointer transition-colors">
                        Terms of Use
                    </Link>
                    <Link to="/license" className="hover:text-black cursor-pointer transition-colors">
                        License
                    </Link>
                </div>
            </div>
        </div>
    );
};
