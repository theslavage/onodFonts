
import type { Font } from "../data/mockFonts";

export type FontCardLayout = "grid" | "list";

export interface FontCardProps {
    font: Font;
    previewText: string;
    isFavorite: boolean;
    isCompared: boolean;
    layout?: FontCardLayout;
    fontSize: number;
    letterSpacing: number;
    onToggleFavorite: (id: string) => void;
    onToggleCompare: (id: string) => void;
    onViewDetails: (id: string) => void;
}
