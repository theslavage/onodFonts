import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/PageTransition';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { FontDetailsPage } from './pages/FontDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/policies/PrivacyPage';
import { TermsPage } from './pages/policies/TermsPage';
import { LicensePage } from './pages/policies/LicensePage';
import { mockFonts } from './data/mockFonts';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { cn } from './lib/utils';
import { LanguageProvider } from './lib/i18n';
import faviconImg from "figma:asset/ce4df1b5b06202562f6e40af0dc7bbd5851dc22c.png";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [previewText, setPreviewText] = useState<string>("");
  const [isInverted, setIsInverted] = useState(false);
  
  // Load initial state from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('font-catalog-favorites');
          const parsed = saved ? JSON.parse(saved) : [];
          return parsed.filter((id: string) => mockFonts.some(f => f.id === id));
      }
      return [];
  });
  
  const [compareList, setCompareList] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('font-catalog-compare');
          const parsed = saved ? JSON.parse(saved) : [];
          return parsed.filter((id: string) => mockFonts.some(f => f.id === id));
      }
      return [];
  });

  // --- Effects ---
  useEffect(() => {
      localStorage.setItem('font-catalog-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
      localStorage.setItem('font-catalog-compare', JSON.stringify(compareList));
  }, [compareList]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Set Favicon and Title
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    // @ts-ignore
    link.type = 'image/png';
    // @ts-ignore
    link.rel = 'shortcut icon';
    // @ts-ignore
    link.href = faviconImg;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = "ONOD FONTS | OPEN DESIGN";
  }, []);

  useEffect(() => {
    if (isInverted) {
        document.documentElement.classList.add('invert-mode');
    } else {
        document.documentElement.classList.remove('invert-mode');
    }
  }, [isInverted]);

  // --- Actions ---
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      if (isFav) {
        toast.info("Removed from favorites");
        return prev.filter(f => f !== id);
      } else {
        toast.success("Added to favorites");
        return [...prev, id];
      }
    });
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      const isComparing = prev.includes(id);
      if (isComparing) {
        return prev.filter(c => c !== id);
      } else {
        if (prev.length >= 3) {
          toast.error("You can only compare up to 3 fonts");
          return prev;
        }
        toast.success("Added to comparison");
        return [...prev, id];
      }
    });
  };

  const viewDetails = (id: string) => {
    navigate(`/font/${id}`);
  };

  // Determine active page for Header
  const getActivePage = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/font/")) return "details";
    if (location.pathname === "/compare") return "compare";
    if (location.pathname === "/favorites") return "favorites";
    if (location.pathname === "/about") return "about";
    return "home"; // Default
  };

  return (
      <div className={cn("min-h-screen bg-white font-sans text-neutral-900 selection:bg-blue-100")}>
        <Header 
          activePage={getActivePage()} 
          setActivePage={(page) => {
              if (page === "home") navigate("/");
              else if (page === "favorites") navigate("/favorites");
              else if (page === "compare") navigate("/compare");
              else if (page === "about") navigate("/about");
          }}
          favoritesCount={favorites.length}
          compareCount={compareList.length}
          isInverted={isInverted}
          toggleInvert={() => setIsInverted(!isInverted)}
        />
        <main className="bg-white min-h-screen">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
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
                    } />
                    <Route path="/font/:id" element={
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
                    } />
                    <Route path="/compare" element={
                        <PageTransition>
                            <ComparePage
                                fonts={mockFonts.filter(f => compareList.includes(f.id))}
                                previewText={previewText}
                                setPreviewText={setPreviewText}
                                removeFromCompare={toggleCompare}
                                onBack={() => navigate("/")}
                            />
                        </PageTransition>
                    } />
                    <Route path="/favorites" element={
                        <PageTransition>
                            <FavoritesPage
                                fonts={mockFonts.filter(f => favorites.includes(f.id))}
                                previewText={previewText}
                                setPreviewText={setPreviewText}
                                toggleFavorite={toggleFavorite}
                                compareList={compareList}
                                toggleCompare={toggleCompare}
                                viewDetails={viewDetails}
                                onGoToCatalog={() => navigate("/")}
                            />
                        </PageTransition>
                    } />
                    <Route path="/about" element={
                        <PageTransition>
                            <AboutPage onNavigateHome={() => navigate("/")} />
                        </PageTransition>
                    } />
                    
                    {/* Policy Pages */}
                    <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
                    <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
                    <Route path="/license" element={<PageTransition><LicensePage /></PageTransition>} />
                </Routes>
            </AnimatePresence>
        </main>
        
        <Toaster position="bottom-right" invert={isInverted} />
      </div>
  );
}

// Helper Wrapper for Details Page to handle ID from URL
const FontDetailsWrapper = ({ mockFonts, ...props }: any) => {
    const { id } = useParams();
    const font = mockFonts.find((f: any) => f.id === id);
    if (!font) return <div>Font not found</div>;
    return <FontDetailsPage font={font} isFavorite={props.favorites.includes(font.id)} isCompare={props.compareList.includes(font.id)} {...props} />;
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </LanguageProvider>
    );
}
