import React, { useEffect, useMemo, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    useLocation,
    useParams,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";

import { PageTransition } from "./components/PageTransition";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { FontDetailsPage } from "./pages/FontDetailsPage";
import { ComparePage } from "./pages/ComparePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/policies/PrivacyPage";
import { TermsPage } from "./pages/policies/TermsPage";
import { LicensePage } from "./pages/policies/LicensePage";

import { mockFonts } from "./data/mockFonts";
import type { Font } from "./types/font.types";

import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./lib/utils";
import { LanguageProvider } from "./lib/i18n";

import faviconImg from "./assets/logo.png";

type ActivePage = "home" | "details" | "compare" | "favorites" | "about";

const STORAGE_KEYS = {
    favorites: "font-catalog-favorites",
    compare: "font-catalog-compare",
} as const;

const isBrowser = typeof window !== "undefined";

const loadStoredIds = (key: string): string[] => {
    if (!isBrowser) return [];
    try {
        const saved = window.localStorage.getItem(key);
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];

        const allowedIds = new Set(mockFonts.map((f) => f.id));
        return parsed.filter(
            (id): id is string => typeof id === "string" && allowedIds.has(id)
        );
    } catch {
        return [];
    }
};

const persistIds = (key: string, value: string[]) => {
    if (!isBrowser) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // можно залогировать в проде
    }
};

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();

    const [previewText, setPreviewText] = useState<string>("");
    const [isInverted, setIsInverted] = useState<boolean>(false);

    const [favorites, setFavorites] = useState<string[]>(() =>
        loadStoredIds(STORAGE_KEYS.favorites)
    );

    const [compareList, setCompareList] = useState<string[]>(() =>
        loadStoredIds(STORAGE_KEYS.compare)
    );

    useEffect(() => {
        persistIds(STORAGE_KEYS.favorites, favorites);
    }, [favorites]);

    useEffect(() => {
        persistIds(STORAGE_KEYS.compare, compareList);
    }, [compareList]);

    useEffect(() => {
        if (!isBrowser) return;
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (!isBrowser) return;

        const head = document.head || document.getElementsByTagName("head")[0];

        let link =
            (head.querySelector("link[rel*='icon']") as HTMLLinkElement | null) ??
            (document.createElement("link") as HTMLLinkElement);

        link.type = "image/png";
        link.rel = "shortcut icon";
        link.href = faviconImg;

        if (!head.contains(link)) {
            head.appendChild(link);
        }

        document.title = "ONOD FONTS | OPEN DESIGN";
    }, []);

    useEffect(() => {
        if (!isBrowser) return;

        const root = document.documentElement;
        if (isInverted) {
            root.classList.add("invert-mode");
        } else {
            root.classList.remove("invert-mode");
        }
    }, [isInverted]);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const exists = prev.includes(id);
            if (exists) {
                toast.info("Removed from favorites");
                return prev.filter((item) => item !== id);
            }
            toast.success("Added to favorites");
            return [...prev, id];
        });
    };

    const toggleCompare = (id: string) => {
        setCompareList((prev) => {
            const exists = prev.includes(id);
            if (exists) {
                return prev.filter((item) => item !== id);
            }

            if (prev.length >= 3) {
                toast.error("You can only compare up to 3 fonts");
                return prev;
            }

            toast.success("Added to comparison");
            return [...prev, id];
        });
    };

    const viewDetails = (id: string) => {
        navigate(`/font/${id}`);
    };

    const activePage: ActivePage = useMemo(() => {
        const path = location.pathname;
        if (path === "/") return "home";
        if (path.startsWith("/font/")) return "details";
        if (path === "/compare") return "compare";
        if (path === "/favorites") return "favorites";
        if (path === "/about") return "about";
        return "home";
    }, [location.pathname]);

    const favoriteFonts = useMemo(
        () => mockFonts.filter((font) => favorites.includes(font.id)),
        [favorites]
    );

    const comparedFonts = useMemo(
        () => mockFonts.filter((font) => compareList.includes(font.id)),
        [compareList]
    );

    return (
        <div
            className={cn(
                "min-h-screen bg-white font-sans text-neutral-900",
                "selection:bg-blue-100"
            )}
        >
            <Header
                activePage={activePage}
                setActivePage={(page) => {
                    if (page === "home") navigate("/");
                    else if (page === "favorites") navigate("/favorites");
                    else if (page === "compare") navigate("/compare");
                    else if (page === "about") navigate("/about");
                }}
                favoritesCount={favorites.length}
                compareCount={compareList.length}
                isInverted={isInverted}
                toggleInvert={() => setIsInverted((prev) => !prev)}
            />

            <main className="bg-white min-h-screen">
                <AnimatePresence mode="wait">
                    <Routes location={location}>
                        <Route
                            path="/"
                            element={
                                <PageTransition>
                                    <HomePage
                                        fonts={mockFonts}
                                        previewText={previewText}
                                        setPreviewText={setPreviewText}
                                        favorites={favorites}
                                        toggleFavorite={toggleFavorite}
                                        compareList={compareList}
                                        toggleCompare={toggleCompare}
                                        viewDetails={viewDetails}
                                        onOpenStack={() => navigate("/compare")}
                                    />
                                </PageTransition>
                            }
                        />

                        <Route
                            path="/font/:id"
                            element={
                                <PageTransition>
                                    <FontDetailsWrapper
                                        mockFonts={mockFonts}
                                        previewText={previewText}
                                        favorites={favorites}
                                        toggleFavorite={toggleFavorite}
                                        compareList={compareList}
                                        toggleCompare={toggleCompare}
                                        onBack={() => navigate("/")}
                                    />
                                </PageTransition>
                            }
                        />

                        <Route
                            path="/compare"
                            element={
                                <PageTransition>
                                    <ComparePage
                                        fonts={comparedFonts}
                                        previewText={previewText}
                                        setPreviewText={setPreviewText}
                                        removeFromCompare={toggleCompare}
                                        onBack={() => navigate("/")}
                                    />
                                </PageTransition>
                            }
                        />

                        <Route
                            path="/favorites"
                            element={
                                <PageTransition>
                                    <FavoritesPage
                                        fonts={favoriteFonts}
                                        previewText={previewText}
                                        setPreviewText={setPreviewText}
                                        toggleFavorite={toggleFavorite}
                                        compareList={compareList}
                                        toggleCompare={toggleCompare}
                                        viewDetails={viewDetails}
                                        onGoToCatalog={() => navigate("/")}
                                    />
                                </PageTransition>
                            }
                        />

                        <Route
                            path="/about"
                            element={
                                <PageTransition>
                                    <AboutPage onNavigateHome={() => navigate("/")} />
                                </PageTransition>
                            }
                        />

                        {/* Policy Pages */}
                        <Route
                            path="/privacy"
                            element={
                                <PageTransition>
                                    <PrivacyPage />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/terms"
                            element={
                                <PageTransition>
                                    <TermsPage />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/license"
                            element={
                                <PageTransition>
                                    <LicensePage />
                                </PageTransition>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </main>

            <Toaster position="bottom-right" invert={isInverted} />
        </div>
    );
}

interface FontDetailsWrapperProps {
    mockFonts: Font[];
    previewText: string;
    favorites: string[];
    toggleFavorite: (id: string) => void;
    compareList: string[];
    toggleCompare: (id: string) => void;
    onBack: () => void;
}

const FontDetailsWrapper: React.FC<FontDetailsWrapperProps> = ({
                                                                   mockFonts,
                                                                   previewText,
                                                                   favorites,
                                                                   toggleFavorite,
                                                                   compareList,
                                                                   toggleCompare,
                                                                   onBack,
                                                               }) => {
    const { id } = useParams<{ id: string }>();
    const font = mockFonts.find((f) => f.id === id);

    if (!font) return <div>Font not found</div>;

    return (
        <FontDetailsPage
            font={font}
            onBack={onBack}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(font.id)}
            toggleCompare={toggleCompare}
            isCompare={compareList.includes(font.id)}
            previewText={previewText}
        />
    );
};

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </LanguageProvider>
    );
}
