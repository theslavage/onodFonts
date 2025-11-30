import React, { useState, useMemo, useEffect } from "react";
import { Font } from "@/data/mockFonts";
import { X, ArrowLeft, Type, AlignLeft, Copy, Check, RefreshCcw, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner@2.0.3";
import { FontLoader } from "@/components/FontLoader";
import { useLanguage } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompareProps {
  fonts: Font[]; 
  previewText: string;
  setPreviewText: (text: string) => void;
  removeFromCompare: (id: string) => void;
  onBack: () => void;
}

export const ComparePage: React.FC<CompareProps> = ({
  fonts,
  removeFromCompare,
  onBack,
}) => {
  const { t } = useLanguage();
  // --- Workbench State ---
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState(1.25); // Major Third default
  const [customContent, setCustomContent] = useState("");
  
  // Role Mapping: 0 = Headings, 1 = Body
  const [headingFontIndex, setHeadingFontIndex] = useState(0);
  const [bodyFontIndex, setBodyFontIndex] = useState(fonts.length > 1 ? 1 : 0);

  // --- Initialization from URL ---
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const h = params.get('h');
      const b = params.get('b');
      const base = params.get('base');
      const ratio = params.get('ratio');

      if (h) setHeadingFontIndex(Number(h));
      if (b) setBodyFontIndex(Number(b));
      if (base) setBaseSize(Number(base));
      if (ratio) setScaleRatio(Number(ratio));
  }, []); // Run once on mount

  // --- Sync to URL ---
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      params.set('h', headingFontIndex.toString());
      params.set('b', bodyFontIndex.toString());
      params.set('base', baseSize.toString());
      params.set('ratio', scaleRatio.toString());

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
  }, [headingFontIndex, bodyFontIndex, baseSize, scaleRatio]);

  // --- Dialog State for Fallback ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [configCode, setConfigCode] = useState("");

  // --- Calculations ---
  const scaleSteps = ["text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"];
  const calculatedSizes = useMemo(() => {
      return scaleSteps.map((_, i) => Math.round(baseSize * Math.pow(scaleRatio, i)));
  }, [baseSize, scaleRatio]);

  // Ensure valid font selection
  const headingFont = fonts[headingFontIndex] || fonts[0];
  const bodyFont = fonts[bodyFontIndex] || fonts[0];

  // --- Export Config ---
  const generateConfig = () => {
      return `
// tailwind.config.js theme extension
fontFamily: {
  'sans': ['"${bodyFont?.name}"', 'sans-serif'],
  'display': ['"${headingFont?.name}"', 'sans-serif'],
},
fontSize: {
  'base': '${baseSize}px',
  'lg': '${calculatedSizes[1]}px',
  'xl': '${calculatedSizes[2]}px',
  '2xl': '${calculatedSizes[3]}px',
  '3xl': '${calculatedSizes[4]}px',
  '4xl': '${calculatedSizes[5]}px',
}
      `.trim();
  };

  const copyConfig = async () => {
      const config = generateConfig();
      try {
          await navigator.clipboard.writeText(config);
          toast.success("Tailwind Config Copied!");
      } catch (err) {
          console.error("Clipboard write failed", err);
          setConfigCode(config);
          setIsDialogOpen(true);
      }
  };

  const shareUrl = async () => {
      try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Workbench URL Copied!");
      } catch (err) {
          toast.error("Failed to copy URL");
      }
  };

  if (fonts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-white">
             <h2 className="text-6xl font-bold tracking-tighter mb-6">{t('compare.emptyTitle')}</h2>
             <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-12">{t('compare.emptyDesc')}</p>
             <button 
                onClick={onBack} 
                className="px-8 py-4 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
             >
                {t('compare.return')}
             </button>
        </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans flex flex-col">
       <FontLoader fonts={fonts} />
       
       {/* Toolbar */}
       <div className="sticky top-0 z-40 bg-white border-b border-black flex justify-between h-16">
            <div className="flex items-center">
                 <button onClick={onBack} className="h-full px-6 border-r border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest hidden sm:inline">{t('back')}</span>
                 </button>
                 <div className="px-6 flex items-center gap-2">
                     <span className="font-bold tracking-tight hidden sm:inline">{t('compare.systemWorkbench')}</span>
                     <span className="font-mono text-[10px] uppercase bg-black text-white px-1.5 py-0.5">{fonts.length} {t('compare.sources')}</span>
                 </div>
            </div>
            
            <div className="flex h-full">
                <button 
                    onClick={shareUrl}
                    className="px-6 border-l border-black bg-white text-black hover:bg-neutral-100 font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                    <Share2 className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('share')}</span>
                </button>
                <button 
                    onClick={copyConfig}
                    className="px-6 border-l border-black bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                    <Copy className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('compare.export')}</span>
                </button>
            </div>
       </div>

       <div className="flex-grow flex flex-col xl:flex-row">
            
            {/* Left Panel: Controls (Fixed Width on Desktop) */}
            <div className="w-full xl:w-[400px] bg-neutral-50 border-b xl:border-b-0 xl:border-r border-black flex flex-col h-auto xl:h-[calc(100vh-64px)] overflow-y-auto">
                
                {/* Custom Content Input (New) */}
                <div className="p-6 border-b border-black/10">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">{t('compare.customContent')}</h3>
                    <textarea 
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        placeholder={t('preview.placeholder')}
                        className="w-full h-24 bg-white border border-black p-3 text-sm resize-none focus:outline-none placeholder:text-neutral-300"
                    />
                </div>

                {/* 1. Font Mapping */}
                <div className="p-6 border-b border-black/10">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">{t('compare.roles')}</h3>
                    
                    <div className="space-y-4">
                        <div className="bg-white border border-black p-4 shadow-sm">
                            <label className="block font-bold text-xs uppercase mb-2">{t('compare.heading')}</label>
                            <select 
                                className="w-full bg-transparent border-b border-neutral-200 pb-1 font-mono text-xs focus:outline-none focus:border-black"
                                value={headingFontIndex}
                                onChange={(e) => setHeadingFontIndex(Number(e.target.value))}
                            >
                                {fonts.map((f, i) => (
                                    <option key={f.id} value={i}>{f.name} ({f.categories[0]})</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white border border-black p-4 shadow-sm">
                            <label className="block font-bold text-xs uppercase mb-2">{t('compare.body')}</label>
                            <select 
                                className="w-full bg-transparent border-b border-neutral-200 pb-1 font-mono text-xs focus:outline-none focus:border-black"
                                value={bodyFontIndex}
                                onChange={(e) => setBodyFontIndex(Number(e.target.value))}
                            >
                                {fonts.map((f, i) => (
                                    <option key={f.id} value={i}>{f.name} ({f.categories[0]})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Modular Scale Calculator */}
                <div className="p-6 border-b border-black/10">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">{t('compare.scale')}</h3>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                         <div>
                             <label className="block font-mono text-[10px] uppercase mb-1">{t('compare.base')}</label>
                             <input 
                                type="number" 
                                value={baseSize}
                                onChange={(e) => setBaseSize(Number(e.target.value))}
                                className="w-full border border-black p-2 font-mono text-sm"
                             />
                         </div>
                         <div>
                             <label className="block font-mono text-[10px] uppercase mb-1">{t('compare.ratio')}</label>
                             <select 
                                value={scaleRatio}
                                onChange={(e) => setScaleRatio(Number(e.target.value))}
                                className="w-full border border-black p-2 font-mono text-sm bg-white"
                             >
                                 <option value="1.067">1.067 (Minor Second)</option>
                                 <option value="1.125">1.125 (Major Second)</option>
                                 <option value="1.200">1.200 (Minor Third)</option>
                                 <option value="1.250">1.250 (Major Third)</option>
                                 <option value="1.333">1.333 (Perfect Fourth)</option>
                                 <option value="1.414">1.414 (Augmented Fourth)</option>
                                 <option value="1.500">1.500 (Perfect Fifth)</option>
                                 <option value="1.618">1.618 (Golden Ratio)</option>
                             </select>
                         </div>
                     </div>

                     {/* Visual Scale Preview */}
                     <div className="space-y-1">
                         {calculatedSizes.slice().reverse().map((size, i) => {
                             const index = calculatedSizes.length - 1 - i;
                             const label = index === 0 ? "base" : `${index}xl`;
                             return (
                                 <div key={index} className="flex items-center justify-between text-xs border-b border-black/5 py-2">
                                     <span className="font-mono text-neutral-400 w-12">{label}</span>
                                     <span className="font-mono">{size}px</span>
                                     <div className="w-16 h-2 bg-black" style={{ opacity: 0.1 + (index * 0.15) }} />
                                 </div>
                             )
                         })}
                     </div>
                </div>

                {/* 3. Stack Management */}
                <div className="p-6 mt-auto">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">{t('compare.active')}</h3>
                     <div className="space-y-2">
                         {fonts.map(f => (
                             <div key={f.id} className="flex justify-between items-center text-sm group">
                                 <span>{f.name}</span>
                                 <button onClick={() => removeFromCompare(f.id)} className="text-neutral-300 hover:text-red-500">
                                     <X className="w-4 h-4" />
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>

            </div>

            {/* Right Panel: Live Preview */}
            <div className="flex-grow bg-white p-8 md:p-16 overflow-y-auto h-auto xl:h-[calc(100vh-64px)]">
                
                <div className="max-w-3xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <section className="space-y-6">
                        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8 border-b border-black pb-2">Preview / Article Layout</p>
                        
                        <h1 
                            style={{ fontFamily: headingFont?.cssStack, fontSize: `${calculatedSizes[5]}px`, lineHeight: 1.1 }}
                            className="font-bold tracking-tight"
                        >
                            {customContent || t('preview.title')}
                        </h1>
                        
                        <p 
                            style={{ fontFamily: bodyFont?.cssStack, fontSize: `${calculatedSizes[2]}px` }}
                            className="text-neutral-500 font-light leading-relaxed max-w-2xl"
                        >
                            {customContent || t('preview.subtitle')}
                        </p>
                    </section>

                    {/* Body Content */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 border-t border-black pt-4">
                            <span className="font-mono text-[10px] uppercase mb-2 block">{t('preview.meta')}</span>
                            <div style={{ fontFamily: bodyFont?.cssStack, fontSize: `${baseSize}px` }} className="space-y-1">
                                <div>{t('preview.author')}: {headingFont?.author}</div>
                                <div>{t('preview.date')}: Nov 28, 2024</div>
                                <div>{t('preview.read')}: 5 min</div>
                            </div>
                        </div>

                        <div className="md:col-span-8 border-t border-black pt-4 space-y-8">
                             <p style={{ fontFamily: bodyFont?.cssStack, fontSize: `${calculatedSizes[1]}px`, lineHeight: 1.6 }}>
                                 {customContent || t('preview.body1')
                                     .replace('{heading}', headingFont?.name)
                                     .replace('{body}', bodyFont?.name)
                                 }
                             </p>

                             <h2 style={{ fontFamily: headingFont?.cssStack, fontSize: `${calculatedSizes[3]}px` }} className="font-bold pt-8">
                                 {t('compare.scale')}
                             </h2>
                             
                             <p style={{ fontFamily: bodyFont?.cssStack, fontSize: `${baseSize}px`, lineHeight: 1.6 }}>
                                 {customContent || t('preview.body2')
                                     .replace('{ratio}', scaleRatio.toString())
                                     .replace('{base}', baseSize.toString())
                                 }
                             </p>

                             <blockquote className="pl-6 border-l-4 border-black py-2 my-8">
                                 <p style={{ fontFamily: headingFont?.cssStack, fontSize: `${calculatedSizes[2]}px` }} className="italic">
                                     "{t('preview.quote')}"
                                 </p>
                             </blockquote>
                        </div>
                    </section>

                    {/* Button Specimen */}
                    <section className="border-t border-black pt-12 pb-24">
                         <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8">{t('preview.ui')}</h3>
                         <div className="flex flex-wrap gap-4">
                             <button className="bg-black text-white px-8 py-4 hover:opacity-80 transition-opacity" style={{ fontFamily: bodyFont?.cssStack, fontSize: `${baseSize}px` }}>
                                 {t('preview.primary')}
                             </button>
                             <button className="border border-black bg-transparent text-black px-8 py-4 hover:bg-neutral-50 transition-colors" style={{ fontFamily: bodyFont?.cssStack, fontSize: `${baseSize}px` }}>
                                 {t('preview.secondary')}
                             </button>
                         </div>
                    </section>
                </div>
            </div>
       </div>

       {/* Fallback Dialog for Clipboard Error */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogContent>
               <DialogHeader>
                   <DialogTitle>Copy Config Manually</DialogTitle>
                   <DialogDescription>
                       Automatic copying is blocked by browser permissions. Please copy the code below.
                   </DialogDescription>
               </DialogHeader>
               <div className="bg-neutral-100 p-4 rounded-md overflow-x-auto border border-black/10">
                   <pre className="text-xs font-mono">{configCode}</pre>
               </div>
           </DialogContent>
       </Dialog>
    </div>
  );
};
