import { Font } from "@/data/mockFonts";

// Cache to keep track of loaded fonts so we don't request them twice
const loadedFonts = new Set<string>();

export const getGoogleFontUrl = (fontName: string, weights: string[]) => {
  const name = fontName.replace(/ /g, "+");
  // Request a standard range for max compatibility
  return `https://fonts.googleapis.com/css2?family=${name}:wght@100..900&display=swap`;
};

export const loadFont = (font: Font) => {
  if (loadedFonts.has(font.name)) return;

  let url = "";
  
  // Check if source is Google Fonts OR known to be on Google Fonts (The League of Moveable Type)
  if (font.source === "Google Fonts" || font.source === "The League of Moveable Type") {
    url = getGoogleFontUrl(font.name, font.weights);
  } else if (font.source === "Fontshare") {
    // Fontshare API
    // Format: https://api.fontshare.com/v2/css?f[]=satoshi@700&display=swap
    // We need to convert name to slug (kebab-case)
    const slug = font.name.toLowerCase().replace(/ /g, "-");
    url = `https://api.fontshare.com/v2/css?f[]=${slug}&display=swap`;
  } else {
    // Other sources (Font Library, Velvetyne) would need specific logic.
    // Currently we don't have a generic loader for them without direct CSS URLs.
    return; 
  }

  if (!url) return;

  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  link.onload = () => {
    loadedFonts.add(font.name);
  };
  document.head.appendChild(link);
};
