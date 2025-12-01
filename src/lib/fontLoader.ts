import type { Font } from "../types/font.types";


const loadedFonts = new Set<string>();

export const getGoogleFontUrl = (fontName: string, weights: string[]): string => {
  const name = fontName.trim().replace(/\s+/g, "+");

  const uniqueWeights = Array.from(new Set(weights)).sort();

  const weightsParam = uniqueWeights.join(";");

  return `https://fonts.googleapis.com/css2?family=${name}:wght@${weightsParam}&display=swap`;
};

const getFontshareUrl = (fontName: string): string => {
  const slug = fontName.trim().toLowerCase().replace(/\s+/g, "-");

  return `https://api.fontshare.com/v2/css?f[]=${encodeURIComponent(slug)}&display=swap`;
};

export const loadFont = (font: Font): void => {
  if (typeof document === "undefined") return;

  if (loadedFonts.has(font.name)) return;

  let url: string | undefined;

  if (font.customCssUrl) {
    url = font.customCssUrl;
  }
  else if (font.source === "Google Fonts" || font.source === "The League of Moveable Type") {
    url = getGoogleFontUrl(font.name, font.weights);
  }
  else if (font.source === "Fontshare") {
    url = getFontshareUrl(font.name);
  }
  else {
    return;
  }

  if (!url) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;

  link.onload = () => {
    loadedFonts.add(font.name);
  };

  document.head.appendChild(link);
};
