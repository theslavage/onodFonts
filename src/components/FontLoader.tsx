import { useEffect } from "react";

type FontProvider = "google" | "fontshare";

interface FontLoaderOptions {
    provider?: FontProvider;
    fontNames?: string[];
}

function appendStylesheetOnce(href: string) {
    if (typeof document === "undefined") return;

    const exists = document.querySelector<HTMLLinkElement>(
        `link[rel="stylesheet"][href="${href}"]`,
    );

    if (exists) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

const FONT_PROVIDER_CONFIG: Record<
    FontProvider,
    {
        batchSize: number;
        buildHref: (batch: string[]) => string | null;
    } > = {
    google: {
        batchSize: 30,
        buildHref: (batch) => {
            if (batch.length === 0) return null;

            const families = batch
                .map((name) => {
                    const normalized = name.trim().replace(/\s+/g, "+");
                    return `family=${normalized}:wght@400;700`;
                })
                .join("&");

            return `https://fonts.googleapis.com/css2?${families}&display=swap`;
        },
    },
    fontshare: {
        batchSize: 20,
        buildHref: (batch) => {
            if (batch.length === 0) return null;

            const params = batch
                .map((name) => {
                    const normalized = name.trim();
                    return `f[]=${encodeURIComponent(normalized)}@400,700`;
                })
                .join("&");

            return `https://api.fontshare.com/v2/css?${params}&display=swap`;
        },
    },
};

function chunkFontNames(fontNames: string[], size: number): string[][] {
    const result: string[][] = [];

    for (let i = 0; i < fontNames.length; i += size) {
        const slice = fontNames.slice(i, i + size).filter(Boolean);
        if (slice.length > 0) {
            result.push(slice);
        }
    }

    return result;
}

export function useFontLoader(options: FontLoaderOptions): void {
    const provider: FontProvider = options.provider ?? "google";
    const fontNames: string[] = options.fontNames ?? [];

    useEffect(() => {
        if (fontNames.length === 0) return;
        if (typeof document === "undefined") return;

        const config = FONT_PROVIDER_CONFIG[provider];
        const batches = chunkFontNames(fontNames, config.batchSize);

        batches.forEach((batch) => {
            const href = config.buildHref(batch);
            if (!href) return;
            appendStylesheetOnce(href);
        });
    }, [provider, fontNames]);
}

export interface FontLoaderProps extends FontLoaderOptions {}

export function FontLoader(props: FontLoaderProps): null {
    useFontLoader(props);
    return null;
}
