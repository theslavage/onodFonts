export interface Font {
    id: string;
    name: string;
    author: string;
    description: string;
    variable: boolean;
    categories: string[];
    languages: string[];
    license: string;
    source: string;
    sourceUrl: string;
    downloadUrl?: string;
    customCssUrl?: string;
    weights: string[];
    styles: string[];
    tags: string[];
    cssStack: string;
}
