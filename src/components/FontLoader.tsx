import React, { useEffect } from 'react';
import { Font } from '../data/mockFonts';

interface FontLoaderProps {
  fonts: Font[];
}

export const FontLoader: React.FC<FontLoaderProps> = ({ fonts }) => {
  useEffect(() => {
    if (fonts.length === 0) return;

    const loadGoogleFonts = () => {
        const nonGoogleSources = ["Fontshare", "Velvetyne", "Collletttivo"];
        
        const targets = fonts.filter(f => 
            !nonGoogleSources.includes(f.source)
        );
        
        const names = Array.from(new Set(targets.map(f => f.name)));
        if (names.length === 0) return;

        // Chunk to avoid URL length limits
        const chunk = (arr: string[], size: number) => 
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                arr.slice(i * size, i * size + size)
            );

        const batches = chunk(names, 15);

        batches.forEach(batch => {
            // Add :ital,wght@0,400;0,700;1,400 to cover more cases safely? 
            // Standardizing on 400/700 for performance in grid
            const families = batch.map(name => `family=${name.replace(/ /g, '+')}:wght@300;400;500;700`).join('&');
            const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.href = href;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    };

    const loadFontshareFonts = () => {
        const targets = fonts.filter(f => f.source === "Fontshare");
        const names = Array.from(new Set(targets.map(f => f.name.toLowerCase().replace(/ /g, '-'))));
        
        if (names.length === 0) return;

        const batches = Array.from({ length: Math.ceil(names.length / 10) }, (v, i) =>
            names.slice(i * 10, i * 10 + 10)
        );

        batches.forEach(batch => {
            // Fontshare API format: f[]=name@weight
            const params = batch.map(name => `f[]=${name}@400,500,700`).join('&');
            const href = `https://api.fontshare.com/v2/css?${params}&display=swap`;

            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.href = href;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    };

    // Velvetyne and Collletttivo usually require local files or direct @font-face. 
    // For this prototype, we assume they might be loaded via their own CSS if available, 
    // or we fallback to standard sans/serif if the user hasn't provided the file.
    // However, if we have names that happen to exist on Google (rare for VTF), they get caught above? 
    // No, we excluded them.
    // We could try to map them to a CDN if one existed, but VTF doesn't have a global one.
    // We leave them be - they will use system fonts or if the user installed them locally.

    const loadCustomFonts = () => {
        const targets = fonts.filter(f => f.customCssUrl);
        const urls = Array.from(new Set(targets.map(f => f.customCssUrl!)));

        urls.forEach(url => {
            if (!document.querySelector(`link[href="${url}"]`)) {
                const link = document.createElement('link');
                link.href = url;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    };

    loadGoogleFonts();
    loadFontshareFonts();
    loadCustomFonts();

  }, [fonts]);

  return null;
};
