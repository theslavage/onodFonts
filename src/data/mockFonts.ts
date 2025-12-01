import type { Font } from "../types/font.types";

const CYRILLIC_SUPPORTED = new Set([

    "PT Sans", "PT Serif", "PT Mono", "PT Sans Caption", "PT Serif Caption", "PT Sans Narrow", "Golos Text",
    "Roboto", "Roboto Slab", "Roboto Mono", "Roboto Condensed", "Open Sans", "Open Sans Condensed",
    "Montserrat", "Montserrat Alternates", "Inter", "Lato", "Ubuntu", "Ubuntu Mono", "Ubuntu Condensed",
    "Merriweather", "Merriweather Sans", "Playfair Display", "Playfair Display SC", "Lora", "Nunito", "Nunito Sans",
    "Fira Sans", "Fira Mono", "Fira Sans Condensed", "Fira Sans Extra Condensed", "Fira Code",
    "Alegreya", "Alegreya Sans", "Alegreya SC", "Alegreya Sans SC", "Cormorant", "Cormorant Garamond",
    "Arimo", "Tinos", "Cousine", "Rubik", "Rubik Mono One", "Exo", "Exo 2", "Comfortaa", "Marmelad",
    "Kelly Slab", "Ruslan Display", "Russo One", "Stalinist One", "Yanone Kaffeesatz", "Jura", "Tenor Sans",
    "Underdog", "Oranienbaum", "Bad Script", "Marck Script", "Neucha", "Pattaya", "Poiret One", "Philosopher",
    "Didact Gothic", "Istok Web", "Ledger", "Scada", "Vollkorn", "Old Standard TT", "Forum", "Cuprum",
    "Alice", "Lobster", "Arvo", "Bebas Neue", "Oswald", "Source Sans Pro", "Source Serif Pro", "Source Code Pro",
    "IBM Plex Sans", "IBM Plex Serif", "IBM Plex Mono", "Manrope", "Jost", "Caveat", "Pacifico", "Amatic SC",
    "Kurale", "Comforter", "Comforter Brush", "Pangolin", "Seymour One", "Knospe", "Stellari", "Press Start 2P",
    "Arsenal", "Asap", "Asap Condensed", "Bitter", "Literata", "Podkova", "Spectral", "Vollkorn SC",
    "El Messiri", "Gabriela", "Kurale", "Lumberjack", "Prosto One", "Rarmaraja", "Rubik Bubbles", "Rubik Glitch",
    "Rubik Microbe", "Rubik Moonrocks", "Rubik Puddles", "Rubik Wet Paint", "Rubik Beastly",
    "Noto Sans", "Noto Serif", "Noto Sans Mono", "JetBrains Mono", "Titillium Web", "Raleway",
    "Play", "Vollkorn", "Ubuntu Condensed", "Cuprum", "Maven Pro", "Poiret One", "Andika",
    "Anonymous Pro", "Bellota", "Bellota Text", "Bona Nova", "Comic Neue", "Cormorant Infant", "Cormorant SC", "Cormorant Unicase",
    "Courier Prime", "EB Garamond", "Kosugi", "Kosugi Maru", "Lemonada", "Murecho", "Noto Sans Display", "Noto Serif Display",
    "Peralta", "Sawarabi Gothic", "Sawarabi Mincho", "Yeseva One",

    // Fontshare (ITF) - Known to support Cyrillic
    "Satoshi", "General Sans", "Clash Display", "Cabinet Grotesk", "Switzer", "Sentient", "Boska", "Pally", "Ranade", "Excon", "Zodiak"
]);

// --- Helper Functions ---
const genWeights = (count: number): string[] => {
    if (count === 1) return ["400"];
    const steps = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
    if (count >= 9) return steps;
    if (count === 2) return ["400", "700"];
    const result: string[] = [];
    const stepSize = Math.floor(9 / count);
    for(let i=0; i<count; i++) {
        result.push(steps[Math.min(8, i * stepSize + (i > 0 ? 1 : 0))]);
    }
    return result;
};

const createFont = (
    name: string,
    cat: string,
    authorName: string,
    sourcePlatform: string,
    idPrefix: string,
    index: number,
    wCount: number = 4,
    isVar: boolean = false
): Font => {
    let url = `https://fonts.google.com/specimen/${name.replace(/ /g, "+")}`;

    // Platform specific URLs
    if (sourcePlatform === "Fontshare") url = `https://www.fontshare.com/fonts/${name.toLowerCase().replace(/ /g, "-")}`;
    if (sourcePlatform === "Velvetyne") url = `https://velvetyne.fr/fonts/${name.toLowerCase().replace(/ /g, "-")}/`;
    if (sourcePlatform === "The League of Moveable Type") url = `https://www.theleagueofmoveabletype.com/${name.toLowerCase().replace(/ /g, "-")}`;
    if (sourcePlatform === "Font Squirrel") url = `https://www.fontsquirrel.com/fonts/${name.toLowerCase().replace(/ /g, "-")}`;
    if (sourcePlatform === "Font Library") url = `https://fontlibrary.org/en/font/${name.toLowerCase().replace(/ /g, "-")}`;
    if (sourcePlatform === "Collletttivo") url = `https://collletttivo.it/`;
    if (sourcePlatform === "Open Foundry") url = `https://open-foundry.com/fonts/${name.toLowerCase().replace(/ /g, "_")}`;

    const languages: string[] = ["Latin"];
    if (CYRILLIC_SUPPORTED.has(name) || authorName === "ParaType" || name.startsWith("PT ") || name.includes("Cyrillic")) {
        languages.push("Cyrillic");
    }
    if (sourcePlatform === "Google Fonts / Early Access") {
        if (name.includes("JP")) languages.push("Japanese");
        if (name.includes("KR")) languages.push("Korean");
        if (name.includes("SC") || name.includes("TC")) languages.push("Chinese");
    }

    return {
        id: `${idPrefix}-${index}`,
        name: name,
        author: authorName,
        description: `${name} is a ${cat} typeface by ${authorName}, available on ${sourcePlatform}.`,
        variable: isVar,
        categories: [cat],
        languages: languages,
        license: "Open Source",
        source: sourcePlatform,
        sourceUrl: url,
        weights: genWeights(wCount),
        styles: ["Regular", isVar ? "Variable" : undefined].filter(Boolean) as string[],
        tags: [cat, isVar ? "variable" : "static", sourcePlatform.toLowerCase().replace(/ /g, "-"), authorName.toLowerCase().replace(/ /g, "-")],
        cssStack: `'${name}', ${cat.includes('serif') ? 'serif' : (cat.includes('mono') ? 'monospace' : 'sans-serif')}`,
    };
};


// 1. ParaType (Source: Google Fonts)
const paraTypeData = [
    "PT Sans|sans-serif|4|0", "PT Serif|serif|4|0", "PT Mono|monospaced|1|0", "PT Sans Caption|sans-serif|2|0",
    "PT Serif Caption|serif|2|0", "PT Sans Narrow|sans-serif|2|0", "Golos Text|sans-serif|6|1"
];
// 2. Sorkin Type (Source: Google Fonts)
const sorkinData = ["Merriweather Sans|sans-serif|8|1", "Arvo|serif|4|0", "Vast Shadow|display|1|0", "Gudea|sans-serif|3|0", "Kavoon|display|1|0", "Metrophobic|sans-serif|1|0", "Sarina|display|1|0", "Short Stack|handwriting|1|0", "Spinnaker|sans-serif|1|0", "Stalemate|handwriting|1|0", "Supermercado One|display|1|0"];
// 3. Impallari Type (Source: Google Fonts)
const impallariData = ["Lobster|display|1|0", "Cabin|sans-serif|4|1", "Dosis|sans-serif|7|1", "Quattrocento|serif|2|0", "Quattrocento Sans|sans-serif|4|0", "Racing Sans One|display|1|0", "Kaushan Script|handwriting|1|0"];
// 4. Etcetera Type Co (Source: Google Fonts)
const etceteraData = ["Sora|sans-serif|8|1"];
// 5. Omnibus-Type (Source: Google Fonts)
const omnibusData = ["Chivo|sans-serif|9|1", "Chivo Mono|monospaced|9|1", "Archivo Narrow|sans-serif|9|1", "Asap|sans-serif|9|1", "Asap Condensed|sans-serif|9|1", "Faustina|serif|8|1", "Manual|sans-serif|8|1", "Rosario|sans-serif|8|1", "Saira|sans-serif|9|1", "Saira Condensed|sans-serif|9|0", "Saira Extra Condensed|sans-serif|9|0", "MuseoModerno|display|9|1"];
// 6. Huerta Tipográfica (Source: Google Fonts)
const huertaData = ["Alegreya|serif|6|1", "Alegreya Sans|sans-serif|7|1", "Alegreya SC|serif|6|0", "Alegreya Sans SC|sans-serif|7|0", "Bitter|serif|9|1", "Piazzolla|serif|9|1", "Sura|serif|2|0", "Lalezar|display|1|0", "Mirza|display|4|0"];
// 7. Arrow Type (Source: Google Fonts)
const arrowData = ["Recursive|sans-serif|9|1", "Name Sans|sans-serif|9|1", "Shantell Sans|handwriting|9|1"];

// 8. Collletttivo (Independent)
// Not supported by CDN loader currently
// const collletttivoData = ["Ribes|display|1|0", "Gobelet|display|1|0", "Matona|display|1|0", "Mazius|display|3|0", "Spindle|serif|1|0", "Flandre|serif|1|0", "Kessler|display|1|0", "Apfel Grotezk|sans-serif|4|0", "Lucha|display|1|0"];

// 9. Velvetyne (Independent)
// Not supported by CDN loader currently
// const velvetyneData = ["Avara|serif", "BackOut|display", "Basteleur|serif", "Bluu Next|serif", "Boogy Brut|display", "Brassia|serif", "Brenner|sans-serif", "Compagnon|monospaced", "Digestive|display", "Dune Rise|display", "Faune|sans-serif", "Fandango|display", "Fluo|display", "Gnoncents|handwriting", "Good Times|display", "Grotesk|sans-serif", "Happy Times at the IKOB|serif", "Hermes|sans-serif", "Infrarouge|display", "Jachien|display", "Kaerukaeru|display", "Karrik|sans-serif", "Lack|sans-serif", "Le Murmure|serif", "Libertine|serif", "Lineal|sans-serif", "Minipax|serif", "Millimetre|sans-serif", "Mister Pixel|display", "Monowannabe|monospaced", "Mont Blanc|sans-serif", "Ouroboros|display", "Outward|display", "PicNic|display", "Pilowlava|display", "Process|monospaced", "Prophet|sans-serif", "Résistance|display", "Selas|sans-serif", "Solide Mirage|sans-serif", "Sporting Grotesque|sans-serif", "Trickster|display", "Typefesse|display", "Whois Mono|monospaced", "Zai|display", "Zenith|display", "Hyper Scrypt|display", "Terminal Grotesque|monospaced", "Steps Mono|monospaced", "Pixel|display", "Format 1452|sans-serif", "Cactus|display"];

// 10. The League of Moveable Type (Independent)
const leagueData = ["League Gothic", "League Spartan", "League Script", "Knewave", "Sniglet", "Raleway", "Orbitron", "Prociono", "Goudy Bookletter 1911", "Sorts Mill Goudy", "Linden Hill", "Fanwood Text", "Alice"];

// 11. Fontshare (Indian Type Foundry) - Exclusives
const fontshareData = ["Satoshi", "General Sans", "Clash Display", "Cabinet Grotesk", "Ranade", "Zodiak", "Stardom", "Telma", "Erode", "Melodrama", "Gambetta", "Panchang", "Britney", "Switzer", "Sentient", "Author", "Besley", "Boska", "Boxing", "Bromine", "Chubbo", "Chillax", "Comico", "Deng", "Dodi", "Duplet", "Excon", "Fokkol", "H.H. Samuel", "Hoover", "Ladi", "Lausanne", "Magro", "Mrow", "New Spirit", "Nippo", "Ozone", "Pally", "Plein", "Pragmatica", "Rowan", "Ruwudu", "Saans", "Sudo", "Supreme", "Tabular", "Tanker", "Technor", "Vercetti", "Amulya", "Array", "Aspekta", "Barbara", "Bonny", "Bw Gradual", "Bw Modelica", "Bw Nista", "Bw Seido", "Cal Sans", "Canchal", "Cassandra", "Metropolis"];

// 11b. Google Fonts (moved from Fontshare list to fix loading)
const googleMiscData = ["Hind", "Kalam", "Poppins", "Rajdhani", "Yantramanav", "Azeret Mono", "Catamaran", "Cederville Cursive", "Chathura", "Coda", "Darker Grotesque", "Eczar", "Fahkwang", "Frank Ruhl Libre", "Glegoo", "Grenze", "Halant", "Hepta Slab", "Instrument Sans", "Karma", "Kumbh Sans", "Kurale", "Laila", "Lexend", "Martian Mono", "Monda", "Montserrat", "Mukta", "Newsreader", "Plus Jakarta Sans", "Questrial", "Red Hat Display", "Rubik", "Urbanist", "Be Vietnam Pro"];


// 12. Font Library (OFL)
// Not supported by CDN loader currently
// const fontLibraryData = ["Katahdin Round|display", "Karmilla|sans-serif", "Hanken|sans-serif", "Fantasque Sans Mono|monospaced", "Gnuolane|display", "Commune Nuit|display", "London Between|display"];

// 13. Open Foundry
// Not supported by CDN loader currently
// const openFoundryData = ["Bagnard|serif", "Minotaur|display", "Regle|sans-serif", "Wremena|serif", "Varta|sans-serif"];

// 14. Google Early Access (CJK) - Merged into Google Fonts
const earlyAccessData = ["Noto Sans JP|sans-serif|sans-serif", "Noto Serif JP|serif|serif", "Noto Sans KR|sans-serif|sans-serif", "Noto Serif KR|serif|serif", "Noto Sans TC|sans-serif|sans-serif", "Noto Serif TC|serif|serif"];

// 15. Classic / Google Mix (Filtered)
const classicData = ["Pacifico", "Source Sans Pro", "Ubuntu", "Droid Sans", "Oxygen", "Titillium Web", "Inconsolata", "Indie Flower", "Vollkorn", "Signika", "Ubuntu Condensed", "Play", "Muli", "Cuprum", "Maven Pro", "Poiret One", "Hammersmith One", "Armata", "Nobile", "Molengo", "Pontano Sans", "Mutlu", "Mentone", "Existence", "Audimat", "Delicious", "Fontin", "Fontin Sans", "Fertigo Pro", "Diavlo", "Museo Slab", "Museo Sans", "Calluna", "Calluna Sans", "Anivers", "Jura", "Banda", "Semplicita", "Caviar Dreams", "Champagne & Limousines", "Aller", "Walkway", "Code", "Dekar", "Hattori Hanzo", "Telegrafico", "District Thin", "GoodDog", "Grand Hotel", "Great Vibes", "Sofia", "Alex Brush", "Black Jack", "Windsong", "Learning Curve Pro", "Wisdom Script", "Mathlete", "Lane", "Nevis", "Tartine Script", "Tangerine", "Rochester", "Pinyon Script", "Sacramento", "Parisienne", "Cookie", "Allura", "Arizonia", "Bad Script", "Bilbo", "Calligraffitti", "Cedarville Cursive", "Clicker Script", "Coming Soon", "Covered By Your Grace", "Crafty Girls", "Damion", "Dawning of a New Day", "Delius", "Delius Swash Caps", "Delius Unicase", "Devonshire", "Dondoo", "Dr Sugiyama", "Eagle Lake", "Engagement", "Euphoria Script", "Felipa", "Fondamento", "Give You Glory", "Gochi Hand", "Grape Nuts", "Handlee", "Herr Von Muellerhoff", "Homemade Apple", "Italianno", "Jim Nightshade", "Julee", "Just Me Again Down Here", "Kalam", "Kristi", "La Belle Aurore", "Leckerli One", "Loved by the King", "Lovers Quarrel", "Marck Script", "Meddon", "Meie Script", "Merienda", "Merienda One", "Miss Fajardose", "Mr Bedfort", "Mr Dafoe", "Mr De Haviland", "Mrs Saint Delafield", "Mrs Sheppards", "Neucha", "Niconne", "Nothing You Could Do", "Over the Rainbow", "Petit Formal Script", "Pinyon Script", "Playball", "Quintessential", "Qwigley", "Rancho", "Redressed", "Rouge Script", "Ruthie", "Sacramento", "Schoolbell", "Shadows Into Light", "Shadows Into Light Two", "Sirin Stencil", "Sue Ellen Francisco", "Sunshiney", "Swanky and Moo Moo", "Tangerine", "The Girl Next Door", "Unkempt", "Vibur", "Waiting for the Sunrise", "Walter Turncoat", "Yellowtail", "Yesteryear", "Zeyada"];


const fonts: Font[] = [];
const seenNames = new Set<string>();
let globalIndex = 0;

const guessCategory = (name: string, defaultCat: string = "sans-serif"): string => {
    const n = name.toLowerCase();
    if (n.includes("serif") || n.includes("slab") || n.includes("mincho")) return "serif";
    if (n.includes("mono") || n.includes("code") || n.includes("terminal")) return "monospaced";
    if (n.includes("script") || n.includes("hand") || n.includes("brush") || n.includes("cursive")) return "handwriting";
    if (n.includes("display") || n.includes("one") || n.includes("shadow") || n.includes("outline")) return "display";
    return defaultCat;
};

const addFont = (font: Font) => {
    if (!seenNames.has(font.name)) {
        seenNames.add(font.name);
        fonts.push(font);
    }
};

// Add Google Fonts Groups
paraTypeData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "ParaType", "Google Fonts", "pt", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
sorkinData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Sorkin Type", "Google Fonts", "sorkin", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
impallariData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Impallari Type", "Google Fonts", "impallari", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
etceteraData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Etcetera Type Co", "Google Fonts", "etc", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
omnibusData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Omnibus-Type", "Google Fonts", "omnibus", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
huertaData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Huerta Tipográfica", "Google Fonts", "huerta", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
arrowData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Arrow Type", "Google Fonts", "arrow", globalIndex++, parseInt(parts[2]), parts[3] === "1")); });
earlyAccessData.forEach(item => { const parts = item.split("|"); addFont(createFont(parts[0], parts[1], "Google Inc", "Google Fonts", "early", globalIndex++, 4, false)); });
classicData.forEach((item, i) => {
    const cat = guessCategory(item);
    const isVar = i % 10 === 0;
    const weights = i % 3 === 0 ? 1 : 4;
    addFont(createFont(item, cat, "Various Authors", "Google Fonts", "google", globalIndex++, weights, isVar));
});

leagueData.forEach(item => { addFont(createFont(item, guessCategory(item), "The League of Moveable Type", "The League of Moveable Type", "league", globalIndex++, 4, false)); });
fontshareData.forEach(item => { addFont(createFont(item, guessCategory(item, "sans-serif"), "Indian Type Foundry", "Fontshare", "itf", globalIndex++, 8, true)); });
googleMiscData.forEach(item => { addFont(createFont(item, guessCategory(item), "Various", "Google Fonts", "g-misc", globalIndex++, 4, true)); });

// 16. GitHub Design System
addFont({
    id: "gh-mona",
    name: "Mona Sans",
    author: "GitHub",
    description: "Mona Sans is a strong, versatile variable font used across GitHub's marketing and product. Designed to be expressive and distinct.",
    variable: true,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "OFL",
    source: "GitHub",
    sourceUrl: "https://github.com/mona-sans",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@github/mona-sans",
    weights: ["200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Variable"],
    tags: ["sans-serif", "variable", "github", "industrial"],
    cssStack: "'Mona Sans', sans-serif"
});

addFont({
    id: "gh-hubot",
    name: "Hubot Sans",
    author: "GitHub",
    description: "Hubot Sans is a robotic, geometric sans-serif with a technical character. Perfect for data visualization and code interfaces.",
    variable: true,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "OFL",
    source: "GitHub",
    sourceUrl: "https://github.com/hubot-sans",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@github/hubot-sans",
    weights: ["200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Variable"],
    tags: ["sans-serif", "variable", "github", "robot"],
    cssStack: "'Hubot Sans', sans-serif"
});

// 17. Vercel Design System
addFont(createFont("IBM Plex Sans", "sans-serif", "IBM", "Google Fonts", "ibm", 999, 7, false));
addFont(createFont("IBM Plex Mono", "monospaced", "IBM", "Google Fonts", "ibm", 1000, 7, false));

// 18. Pretendard
addFont({
    id: "pretendard",
    name: "Pretendard",
    author: "Kil Hyung-jin",
    description: "A system-ui replacement for Apple's San Francisco and Inter. Extremely popular in Korea and modern web apps.",
    variable: true,
    categories: ["sans-serif"],
    languages: ["Latin", "Cyrillic", "Korean"],
    license: "SIL OFL",
    source: "Cactus",
    sourceUrl: "https://github.com/orioncactus/pretendard",
    customCssUrl: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Regular", "Bold"],
    tags: ["sans-serif", "system", "clean", "apple-like"],
    cssStack: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif"
});

// 19. Uncut.wtf / Independent Curated

const indieFoundriesData = [
    "Space Grotesk|sans-serif|Florian Karsten",
    "Syne|display|Bonjour Monde",
    "Outfit|sans-serif|Outfit",
    "Epilogue|sans-serif|Etcetera",
    "Fraunces|serif|Undercase",
    "Literata|serif|TypeTogether",
    "Fire Sans|sans-serif|Carrois",
    "Castoro|serif|Tiro Typeworks"
];

indieFoundriesData.forEach(item => {
    const [name, cat, auth] = item.split("|");
    addFont(createFont(name, cat, auth, "Uncut / Indie", "uncut", globalIndex++, 6, true));
});

// 20. US Web Design System (USWDS)
addFont({
    id: "public-sans",
    name: "Public Sans",
    author: "USWDS",
    description: "A strong, neutral, open source typeface for text and display. Adapted from Libre Franklin.",
    variable: true,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "OFL",
    source: "USWDS",
    sourceUrl: "https://public-sans.digital.gov/",
    // Public Sans is on Google Fonts, so we can use the standard loader logic if we use createFont,
    // but let's use createFont to keep it simple and reliable via Google CDN
    ...createFont("Public Sans", "sans-serif", "USWDS", "USWDS", "uswds", globalIndex++, 9, true),
});

// 21. Hack (Source Foundry)
addFont({
    id: "hack-font",
    name: "Hack",
    author: "Source Foundry",
    description: "A typeface designed for source code.",
    variable: false,
    categories: ["monospaced"],
    languages: ["Latin", "Cyrillic"],
    license: "MIT",
    source: "Source Foundry",
    sourceUrl: "https://sourcefoundry.org/hack/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/hack-font",
    weights: ["400", "700"],
    styles: ["Regular", "Bold", "Italic"],
    tags: ["code", "mono", "developer"],
    cssStack: "'Hack', monospace"
});

// 22. Microsoft Design
addFont({
    id: "cascadia-code",
    name: "Cascadia Code",
    author: "Microsoft",
    description: "A fun, new monospaced font that includes programming ligatures and is designed to enhance the modern look and feel of the Windows Terminal.",
    variable: true,
    categories: ["monospaced"],
    languages: ["Latin", "Cyrillic"],
    license: "OFL",
    source: "Microsoft",
    sourceUrl: "https://github.com/microsoft/cascadia-code",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code",
    weights: ["200", "300", "400", "500", "600", "700"],
    styles: ["Regular", "Italic"],
    tags: ["code", "terminal", "windows", "microsoft"],
    cssStack: "'Cascadia Code', monospace"
});

// 23. Intel Brand
addFont({
    id: "intel-one-mono",
    name: "Intel One Mono",
    author: "Intel",
    description: "An expressive monospaced font family that’s built with clarity, legibility, and the needs of developers in mind.",
    variable: false,
    categories: ["monospaced"],
    languages: ["Latin"],
    license: "OFL",
    source: "Intel",
    sourceUrl: "https://github.com/intel/intel-one-mono",
    customCssUrl: "https://cdn.jsdelivr.net/npm/intel-one-mono",
    weights: ["400", "500", "700"],
    styles: ["Regular", "Bold", "Italic"],
    tags: ["code", "hardware", "intel", "industrial"],
    cssStack: "'Intel One Mono', monospace"
});

// 24. Smithsonian Design
addFont({
    id: "cooper-hewitt",
    name: "Cooper Hewitt",
    author: "Chester Jenkins",
    description: "A contemporary sans serif, with characters composed of modified geometric curves and arches. Created for the Cooper Hewitt Smithsonian Design Museum.",
    variable: false,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "OFL",
    source: "Smithsonian",
    sourceUrl: "https://www.cooperhewitt.org/open-source-at-cooper-hewitt/cooper-hewitt-the-typeface-by-chester-jenkins/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@fontsource/cooper-hewitt",
    weights: ["100", "300", "400", "500", "600", "700", "800"],
    styles: ["Regular", "Italic"],
    tags: ["museum", "design", "geometric", "art"],
    cssStack: "'Cooper Hewitt', sans-serif"
});

// 25. Community / Cult
addFont({
    id: "iosevka",
    name: "Iosevka",
    author: "Belleve Invis",
    description: "Slender monospace sans-serif and slab-serif typeface inspired by Pragmata Pro, M+ and PF DIN Mono. The ultimate procedural font.",
    variable: false,
    categories: ["monospaced"],
    languages: ["Latin", "Cyrillic", "Japanese", "Chinese"],
    license: "OFL",
    source: "Community",
    sourceUrl: "https://typeof.net/Iosevka/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@fontsource/iosevka",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Regular", "Oblique"],
    tags: ["procedural", "code", "tech", "narrow"],
    cssStack: "'Iosevka', monospace"
});

// 26. Adobe (Open Source)
const adobeData = [
    "Source Sans 3|sans-serif|Paul D. Hunt",
    "Source Serif 4|serif|Frank Grießhammer",
    "Source Code Pro|monospaced|Paul D. Hunt"
];
adobeData.forEach(item => {
    const [name, cat, auth] = item.split("|");
    addFont(createFont(name, cat, auth, "Adobe", "adobe", globalIndex++, 9, true));
});

// 27. Canonical (Ubuntu)
const canonicalData = [
    "Ubuntu|sans-serif|Dalton Maag",
    "Ubuntu Mono|monospaced|Dalton Maag",
    "Ubuntu Condensed|sans-serif|Dalton Maag"
];
canonicalData.forEach(item => {
    const [name, cat, auth] = item.split("|");
    addFont(createFont(name, cat, auth, "Canonical", "canonical", globalIndex++, 4, false));
});

// 28. Mozilla
const mozillaData = [
    "Fira Sans|sans-serif|Carrois Apostrophe",
    "Fira Mono|monospaced|Carrois Apostrophe"
];
mozillaData.forEach(item => {
    const [name, cat, auth] = item.split("|");
    addFont(createFont(name, cat, auth, "Mozilla", "mozilla", globalIndex++, 9, name !== "Fira Mono"));
});

// 29. Red Hat
const redHatData = [
    "Red Hat Mono|monospaced|MCKL"
];
redHatData.forEach(item => {
    const [name, cat, auth] = item.split("|");
    addFont(createFont(name, cat, auth, "Red Hat", "redhat", globalIndex++, 9, true));
});

// 30. Braille Institute
addFont(createFont("Atkinson Hyperlegible", "sans-serif", "Braille Institute", "Braille Institute", "braille", globalIndex++, 4, false));

// 31. Rsms
addFont(createFont("Inter", "sans-serif", "Rasmus Andersson", "Rsms", "rsms", globalIndex++, 9, true));

// 32. Vercel (Geist)
addFont({
    id: "geist-sans",
    name: "Geist Sans",
    author: "Vercel",
    description: "A typeface designed to be invisible. Precision-engineered for the web.",
    variable: true,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "OFL",
    source: "Vercel",
    sourceUrl: "https://vercel.com/font",
    customCssUrl: "https://cdn.jsdelivr.net/npm/geist",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Variable"],
    tags: ["clean", "modern", "vercel", "interface"],
    cssStack: "'Geist Sans', sans-serif"
});
addFont({
    id: "geist-mono",
    name: "Geist Mono",
    author: "Vercel",
    description: "The monospace companion to Geist Sans. Designed for code and technical UIs.",
    variable: true,
    categories: ["monospaced"],
    languages: ["Latin"],
    license: "OFL",
    source: "Vercel",
    sourceUrl: "https://vercel.com/font",
    customCssUrl: "https://cdn.jsdelivr.net/npm/geist",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    styles: ["Variable"],
    tags: ["code", "console", "vercel", "mono"],
    cssStack: "'Geist Mono', monospace"
});

// 33. GitHub Next (Monaspace)
const monaspaceFonts = [
    { name: "Monaspace Neon", style: "Neo-grotesque", id: "neon" },
    { name: "Monaspace Argon", style: "Humanist", id: "argon" },
    { name: "Monaspace Xenon", style: "Serif", id: "xenon" },
    { name: "Monaspace Radon", style: "Handwriting", id: "radon" },
    { name: "Monaspace Krypton", style: "Mechanical", id: "krypton" }
];

monaspaceFonts.forEach(font => {
    addFont({
        id: `monaspace-${font.id}`,
        name: font.name,
        author: "GitHub Next",
        description: `Part of the Monaspace supergroup. A ${font.style} monospace font with texture healing.`,
        variable: true,
        categories: ["monospaced"],
        languages: ["Latin"],
        license: "OFL",
        source: "GitHub Next",
        sourceUrl: "https://monaspace.githubnext.com/",
        customCssUrl: "https://cdn.jsdelivr.net/npm/@github/monaspace",
        weights: ["200", "300", "400", "500", "600", "700", "800"],
        styles: ["Variable"],
        tags: ["code", "github", "future", "texture-healing"],
        cssStack: `'${font.name}', monospace`
    });
});

// 34. Go Project (Golang)
addFont({
    id: "go-font",
    name: "Go",
    author: "Bigelow & Holmes",
    description: "The font family for the Go programming language.",
    variable: false,
    categories: ["sans-serif"],
    languages: ["Latin"],
    license: "BSD",
    source: "Go Project",
    sourceUrl: "https://go.dev/blog/go-fonts",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@fontsource/go-sans",
    weights: ["400", "500", "700"],
    styles: ["Regular", "Italic"],
    tags: ["google", "golang", "system", "ui"],
    cssStack: "'Go', sans-serif"
});
addFont({
    id: "go-mono",
    name: "Go Mono",
    author: "Bigelow & Holmes",
    description: "The monospace font family for the Go programming language.",
    variable: false,
    categories: ["monospaced"],
    languages: ["Latin"],
    license: "BSD",
    source: "Go Project",
    sourceUrl: "https://go.dev/blog/go-fonts",
    customCssUrl: "https://cdn.jsdelivr.net/npm/@fontsource/go-mono",
    weights: ["400", "500", "700"],
    styles: ["Regular", "Italic"],
    tags: ["code", "golang", "mono"],
    cssStack: "'Go Mono', monospace"
});

// 35. JetBrains
addFont({
    id: "jetbrains-mono-standalone",
    name: "JetBrains Mono",
    author: "JetBrains",
    description: "A typeface for developers. Created to make reading code easier.",
    variable: true,
    categories: ["monospaced"],
    languages: ["Latin", "Cyrillic"],
    license: "OFL",
    source: "JetBrains",
    sourceUrl: "https://www.jetbrains.com/lp/mono/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/jetbrains-mono",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800"],
    styles: ["Variable", "Italic"],
    tags: ["ide", "code", "developer", "jetbrains"],
    cssStack: "'JetBrains Mono', monospace"
});

// 36. Linux Systems
addFont(createFont("Cantarell", "sans-serif", "Dave Crossland", "GNOME", "gnome", globalIndex++, 4, false));
addFont(createFont("Oxygen", "sans-serif", "Vernon Adams", "KDE", "kde", globalIndex++, 3, false));

// 37. Indie Coding
addFont({
    id: "victor-mono",
    name: "Victor Mono",
    author: "Rubens Boy",
    description: "A monospaced font with semi-connected cursive italics and symbol ligatures.",
    variable: false,
    categories: ["monospaced"],
    languages: ["Latin"],
    license: "MIT",
    source: "Indie Coding",
    sourceUrl: "https://rubjo.github.io/victor-mono/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/victor-mono",
    weights: ["100", "200", "300", "400", "500", "600", "700"],
    styles: ["Regular", "Italic"],
    tags: ["code", "cursive", "ligatures"],
    cssStack: "'Victor Mono', monospace"
});

addFont({
    id: "julia-mono",
    name: "JuliaMono",
    author: "Cormullion",
    description: "A monospaced font for scientific and technical computing, designed for the Julia programming language.",
    variable: true,
    categories: ["monospaced"],
    languages: ["Latin", "Greek", "Cyrillic"],
    license: "OFL",
    source: "Indie Coding",
    sourceUrl: "https://juliamono.netlify.app/",
    customCssUrl: "https://cdn.jsdelivr.net/npm/juliamono",
    weights: ["400", "500", "700"],
    styles: ["Regular"],
    tags: ["code", "science", "julia", "math"],
    cssStack: "'JuliaMono', monospace"
});

// 38. Academic / Science
addFont(createFont("Gentium Plus", "serif", "SIL", "SIL International", "sil", globalIndex++, 4, false));
addFont(createFont("STIX Two Text", "serif", "STIPub", "Scientific", "stix", globalIndex++, 4, true));

// 39. Retro / Pixel (Google Fonts)
const retroFonts: string[] = [];
retroFonts.forEach(name => {
    addFont(createFont(name, "display", "Various", "Retro / Pixel", "retro", globalIndex++, 1, false));
});

// 40. Industrial Standards (DIN Style)
const dinFonts: string[] = [];
dinFonts.forEach(name => {
    addFont(createFont(name, "sans-serif", "Jeremy Tribby", "Industrial", "din", globalIndex++, 9, true));
});

// 41. Sci-Fi & Future UI
const scifiFonts = ["Michroma", "Bruno Ace"];
scifiFonts.forEach(name => {
    addFont(createFont(name, "display", "Various", "Sci-Fi / Tech", "scifi", globalIndex++, 4, name === "Exo 2"));
});

// 42. Corporate Open Source
addFont(createFont("Goldman", "sans-serif", "Jaakkola & Goldman Sachs", "Goldman Sachs", "goldman", globalIndex++, 3, false));

// 43. Mozilla Extended
addFont(createFont("Zilla Slab", "serif", "Typotheque", "Mozilla", "mozilla-ext", globalIndex++, 5, false));

// 44. Drafting & Schematics
const draftingFonts = ["Share Tech", "Lekton", "Monda"];
draftingFonts.forEach(name => {
    addFont(createFont(name, name.includes("Mono") ? "monospaced" : "sans-serif", "Various", "Drafting", "draft", globalIndex++, 3, false));
});

// 45. Typewriter Revival
const typewriterFonts = ["Cutive", "Special Elite"];
typewriterFonts.forEach(name => {
    addFont(createFont(name, "monospaced", "Various", "Typewriter", "typewriter", globalIndex++, 2, false));
});

// 46. Dot Matrix / LED
// Removed duplicate (DotGothic16 is in #72)

// 47. DeepMind (DM Series)
const dmFonts = ["DM Serif Display", "DM Serif Text"];
dmFonts.forEach(name => {
    addFont(createFont(name, name.includes("Serif") ? "serif" : (name.includes("Mono") ? "monospaced" : "sans-serif"), "Colophon Foundry", "DeepMind", "dm", globalIndex++, 9, true));
});

// 48. Highway / Transport (Red Hat / Overpass)
const transportFonts = ["Overpass", "Overpass Mono"];
transportFonts.forEach(name => {
    addFont(createFont(name, name.includes("Mono") ? "monospaced" : "sans-serif", "Delve Fonts", "Transport", "transport", globalIndex++, 9, true));
});

// 49. Hyper-Legibility (Fintech)
const lexendFonts = ["Lexend", "Lexend Deca", "Lexend Exa", "Lexend Giga", "Lexend Mega", "Lexend Peta", "Lexend Tera", "Lexend Zetta"];
lexendFonts.forEach(name => {
    addFont(createFont(name, "sans-serif", "Thomas Jockin", "Hyper-Legibility", "lexend", globalIndex++, 9, true));
});

// 50. Constructivist / Brutalist
const brutalFonts = ["Russo One", "Stalinist One", "Plaster", "Koulen"];
brutalFonts.forEach(name => {
    addFont(createFont(name, "display", "Various", "Brutalist", "brutal", globalIndex++, 1, false));
});

// 51. Chrome OS Core (Ascender)
const chromeFonts = ["Arimo", "Tinos"];
chromeFonts.forEach(name => {
    addFont(createFont(name, name === "Cousine" ? "monospaced" : (name === "Tinos" ? "serif" : "sans-serif"), "Steve Matteson", "Chrome OS", "chrome", globalIndex++, 4, false));
});

// 52. Production Type (Screen Smart)
// Removed duplicate

// 53. Coding Classics
// Removed duplicate

// 54. Modern Geometric
const geoFonts = ["Questrial", "Monda", "Syncopate"];
geoFonts.forEach(name => {
    addFont(createFont(name, name === "Syncopate" || name === "Audiowide" ? "display" : "sans-serif", "Various", "Geometric", "geo", globalIndex++, 1, false));
});

// 55. Neo-Pixel (2024 Era)
const neoPixelFonts = ["Jersey 10", "Jersey 15", "Jersey 20", "Jersey 25", "Jacquard 12", "Tiny5", "Micro 5"];
neoPixelFonts.forEach(name => {
    addFont(createFont(name, "display", "Various", "Neo-Pixel", "neopix", globalIndex++, 1, false));
});

// 56. Asian Industrial (Korean Style)
addFont(createFont("Do Hyeon", "sans-serif", "Sandoll", "Asian Industrial", "asia-ind", globalIndex++, 1, false));
addFont(createFont("Gothic A1", "sans-serif", "HanYang I&C", "Asian Industrial", "asia-ind", globalIndex++, 9, false));
addFont(createFont("Nanum Gothic Coding", "monospaced", "Sandoll", "Asian Industrial", "asia-ind", globalIndex++, 2, false));

// 57. Blueprint / Sketch (Handwritten)
const sketchFonts = ["Architects Daughter", "Reenie Beanie", "Gloria Hallelujah"];
sketchFonts.forEach(name => {
    addFont(createFont(name, "handwriting", "Various", "Blueprint", "sketch", globalIndex++, 1, false));
});

// 58. Code Ligatures Standard
// Removed duplicate

// 59. Wireframe / Prototyping (Skeleton)
const flowFonts = ["Flow Circular", "Flow Rounded", "Flow Block", "Balsamiq Sans"];
flowFonts.forEach(name => {
    addFont(createFont(name, name.includes("Balsamiq") ? "handwriting" : "display", "Dan Ross", "Wireframe", "flow", globalIndex++, 1, false));
});

// 60. Expressive Grotesques (Trend 2025)
addFont(createFont("Bricolage Grotesque", "sans-serif", "Mathieu Réguer", "Trending", "bricolage", globalIndex++, 9, true));
addFont(createFont("Schibsted Grotesk", "sans-serif", "Bakken & Bæck", "Scandinavian", "schibsted", globalIndex++, 4, false));
addFont(createFont("Albert Sans", "sans-serif", "Andreas Rasmussen", "Geometric", "albert", globalIndex++, 9, true));

// 61. Heavy Posters (Brutalism)
addFont(createFont("Dela Gothic One", "display", "Artur Schmal", "Poster", "dela", globalIndex++, 1, false));
addFont(createFont("Righteous", "display", "Astigmatic", "Sci-Fi", "righteous", globalIndex++, 1, false));
addFont(createFont("Unica One", "display", "Various", "Retro", "unica", globalIndex++, 1, false));

// 62. Aeronautical (Airbus / Cockpit UI)
addFont(createFont("B612", "sans-serif", "PolarSys & Airbus", "Avionics", "airbus", globalIndex++, 4, false));
addFont(createFont("B612 Mono", "monospaced", "PolarSys & Airbus", "Avionics", "airbus", globalIndex++, 4, false));

// 63. Urban / Street (Chicago Style)
const urbanFonts = ["Big Shoulders Display", "Big Shoulders Text", "Big Shoulders Inline", "Big Shoulders Stencil Display"];
urbanFonts.forEach(name => {
    addFont(createFont(name, "display", "Patric King", "Urban", "urban", globalIndex++, 9, true));
});

// 64. Soft UI (Rounded)
addFont(createFont("Varela Round", "sans-serif", "Joe Prince", "Soft UI", "varela", globalIndex++, 1, false));
addFont(createFont("M PLUS Rounded 1c", "sans-serif", "M+ Fonts", "Soft UI", "mplus", globalIndex++, 7, false));

// 65. Industrial Marker (Grunge Notes)
addFont(createFont("Permanent Marker", "handwriting", "Font Diner", "Marker", "marker", globalIndex++, 1, false));
addFont(createFont("Rock Salt", "handwriting", "Various", "Marker", "marker", globalIndex++, 1, false));

// 66. Tech Editorial (Mozilla Brand)
addFont(createFont("Zilla Slab", "serif", "Typotheque", "Tech Slab", "zilla", globalIndex++, 6, true));
addFont(createFont("Zilla Slab Highlight", "display", "Typotheque", "Tech Slab", "zilla", globalIndex++, 2, false));

// 67. Military / Stencil (Cargo)
addFont(createFont("Black Ops One", "display", "James Grieshaber", "Military", "military", globalIndex++, 1, false));
addFont(createFont("Stardos Stencil", "display", "Vernon Adams", "Military", "military", globalIndex++, 2, false));
addFont(createFont("Quantico", "sans-serif", "MadType", "HUD", "quantico", globalIndex++, 4, true));

// 68. Cyber Glitch & Distortion
addFont(createFont("Rubik Glitch", "display", "Hubert & Fischer", "Glitch", "rubik", globalIndex++, 1, false));
addFont(createFont("Rubik Wet Paint", "display", "Hubert & Fischer", "Liquid", "rubik", globalIndex++, 1, false));

// 69. Ultra Condensed (Dashboard Stats)
addFont(createFont("Antonio", "sans-serif", "Vernon Adams", "Dashboard", "antonio", globalIndex++, 7, false));

// 70. Enterprise Open Source (Linux Giants)
addFont(createFont("Red Hat Display", "sans-serif", "Red Hat", "Enterprise", "redhat", globalIndex++, 9, true));
addFont(createFont("Red Hat Text", "sans-serif", "Red Hat", "Enterprise", "redhat", globalIndex++, 4, true));
addFont(createFont("Ubuntu", "sans-serif", "Dalton Maag", "Humanist", "ubuntu", globalIndex++, 8, true));
addFont(createFont("Ubuntu Mono", "monospaced", "Dalton Maag", "Console", "ubuntu", globalIndex++, 4, false));

// 71. Architectural / Blueprint
addFont(createFont("Architects Daughter", "handwriting", "Kimberly Geswein", "Blueprint", "arch", globalIndex++, 1, false));
addFont(createFont("Gloria Hallelujah", "handwriting", "Kimberly Geswein", "Sketch", "arch", globalIndex++, 1, false));

// 72. Retro Terminal (CRT & Pixel)
addFont(createFont("VT323", "monospaced", "Peter Hull", "CRT", "vt323", globalIndex++, 1, false));
addFont(createFont("Silkscreen", "display", "Jason Kottke", "Pixel", "silkscreen", globalIndex++, 2, false));
addFont(createFont("DotGothic16", "sans-serif", "Fontworks", "Dot Matrix", "dot", globalIndex++, 1, false));

// 73. Art House / Awwwards (Experimental)
addFont(createFont("Syne", "display", "Bonjour Monde", "Art House", "syne", globalIndex++, 5, true));
addFont(createFont("Krona One", "sans-serif", "Yvonne Schüttler", "Low Res", "krona", globalIndex++, 1, false));

// 74. Civic Tech (US Government Standard)
addFont(createFont("Public Sans", "sans-serif", "USWDS", "Civic", "public", globalIndex++, 9, true));
addFont(createFont("Merriweather", "serif", "Sorkin Type", "Editorial", "merriweather", globalIndex++, 8, true));

// 75. Adobe Core (Open Source)
addFont(createFont("Source Sans 3", "sans-serif", "Adobe", "Corporate", "adobe", globalIndex++, 9, true));
addFont(createFont("Source Serif 4", "serif", "Adobe", "Corporate", "adobe", globalIndex++, 6, true));
addFont(createFont("Source Code Pro", "monospaced", "Adobe", "Coding", "adobe", globalIndex++, 7, true));

// 76. Typewriter / Dossier
addFont(createFont("Courier Prime", "monospaced", "Quote", "Typewriter", "courier", globalIndex++, 4, false));
addFont(createFont("Cutive Mono", "monospaced", "Vernon Adams", "Typewriter", "cutive", globalIndex++, 1, false));

// 77. Square Tech (HUD / Industrial)
addFont(createFont("Chakra Petch", "sans-serif", "Cadson Demak", "Square", "chakra", globalIndex++, 7, false));
addFont(createFont("Michroma", "sans-serif", "Vernon Adams", "Square", "michroma", globalIndex++, 1, false));
addFont(createFont("Orbitron", "sans-serif", "Matt McInerney", "Sci-Fi", "orbitron", globalIndex++, 4, true));

// 78. Code & UI Hybrid (Variable)
addFont(createFont("Recursive", "sans-serif", "Arrow Type", "Hybrid", "recursive", globalIndex++, 4, true));

// 79. Industrial DIN (California Style)
addFont(createFont("Barlow", "sans-serif", "Jeremy Tribby", "DIN", "barlow", globalIndex++, 9, true));
addFont(createFont("Barlow Condensed", "sans-serif", "Jeremy Tribby", "DIN", "barlow", globalIndex++, 9, true));
addFont(createFont("Barlow Semi Condensed", "sans-serif", "Jeremy Tribby", "DIN", "barlow", globalIndex++, 9, false));

// 80. Modern Functional (Geometric)
addFont(createFont("Manrope", "sans-serif", "Mikhail Sharanda", "Geometric", "manrope", globalIndex++, 7, true));
addFont(createFont("Jost", "sans-serif", "Indestructible Type", "Geometric", "jost", globalIndex++, 9, true));

// 81. Space Age (Sci-Fi Grotesk)
addFont(createFont("Space Grotesk", "sans-serif", "Florian Karsten", "Space", "space", globalIndex++, 5, true));
addFont(createFont("Audiowide", "display", "Astigmatic", "Techno", "audio", globalIndex++, 1, false));

// 82. 8-Bit / Console (Retro Gaming)
addFont(createFont("Press Start 2P", "display", "CodeMan38", "Pixel", "press", globalIndex++, 1, false));
addFont(createFont("Pixelify Sans", "display", "Stefie Justprince", "Pixel", "pixelify", globalIndex++, 4, true));

// 83. High Editorial (Luxury Contrast)
addFont(createFont("Playfair Display", "serif", "Claus Eggers Sørensen", "Editorial", "playfair", globalIndex++, 6, true));
addFont(createFont("Cinzel", "serif", "Natanael Gama", "Classical", "cinzel", globalIndex++, 4, false));
addFont(createFont("Prata", "serif", "Cyreal", "Elegant", "prata", globalIndex++, 1, false));

// 84. Universal System (Global Support)
addFont(createFont("Noto Sans", "sans-serif", "Google", "Universal", "noto", globalIndex++, 9, true));
addFont(createFont("Noto Serif", "serif", "Google", "Universal", "noto", globalIndex++, 9, true));

// 85. Heavy Slab (Impact)
addFont(createFont("Alfa Slab One", "display", "JM Solé", "Poster", "alfa", globalIndex++, 1, false));
addFont(createFont("Rokkitt", "serif", "Vernon Adams", "Slab", "rokkitt", globalIndex++, 9, true));

// 86. Informal Fixed (Commentary)
addFont(createFont("Comic Neue", "handwriting", "Craig Rozynski", "Casual", "comic", globalIndex++, 2, true));
addFont(createFont("Bangers", "display", "Vernon Adams", "Comic", "bangers", globalIndex++, 1, false));

// 87. Web Classics (The Standards)
addFont(createFont("Open Sans", "sans-serif", "Steve Matteson", "Humanist", "opensans", globalIndex++, 9, true));
addFont(createFont("Lato", "sans-serif", "Łukasz Dziedzic", "Humanist", "lato", globalIndex++, 9, true));
addFont(createFont("PT Sans", "sans-serif", "ParaType", "Humanist", "ptsans", globalIndex++, 4, true));

// 88. Code Classics (Dev Origins)
addFont(createFont("Inconsolata", "monospaced", "Raph Levien", "Terminal", "inconsolata", globalIndex++, 9, false));
addFont(createFont("Anonymous Pro", "monospaced", "Mark Simonson", "Terminal", "anonymous", globalIndex++, 4, false));

// 89. Bold Condensed (Headlines)
addFont(createFont("Oswald", "sans-serif", "Vernon Adams", "Condensed", "oswald", globalIndex++, 7, true));
addFont(createFont("Anton", "sans-serif", "Vernon Adams", "Impact", "anton", globalIndex++, 1, false));
addFont(createFont("League Gothic", "sans-serif", "The League of Moveable Type", "Condensed", "league", globalIndex++, 1, false));

// 90. Future Tech (Geometric)
addFont(createFont("Exo 2", "sans-serif", "Natanael Gama", "Futuristic", "exo", globalIndex++, 9, true));
addFont(createFont("Saira", "sans-serif", "Hector Gatti", "Variable", "saira", globalIndex++, 9, true));

// 91. Elegant Reading (Longform)
addFont(createFont("Lora", "serif", "Cyreal", "Calligraphic", "lora", globalIndex++, 4, true));
addFont(createFont("Crimson Text", "serif", "Sebastian Kosch", "Old Style", "crimson", globalIndex++, 3, false));

// 92. IBM Plex (Man & Machine)
addFont(createFont("IBM Plex Sans", "sans-serif", "Mike Abbink", "Corporate", "ibm", globalIndex++, 9, true));
addFont(createFont("IBM Plex Mono", "monospaced", "Mike Abbink", "Corporate", "ibm", globalIndex++, 7, true));
addFont(createFont("IBM Plex Serif", "serif", "Mike Abbink", "Corporate", "ibm", globalIndex++, 7, true));

// 93. Digital Native (Modern Swiss)
addFont(createFont("DM Sans", "sans-serif", "Colophon Foundry", "Swiss", "dm", globalIndex++, 9, true));
addFont(createFont("DM Mono", "monospaced", "Colophon Foundry", "Swiss", "dm", globalIndex++, 3, false));
addFont(createFont("Work Sans", "sans-serif", "Wei Huang", "Grotesque", "work", globalIndex++, 9, true));
addFont(createFont("Karla", "sans-serif", "Jonny Pinhorn", "Grotesque", "karla", globalIndex++, 4, true));

// 94. Archival / Documentary
addFont(createFont("Archivo", "sans-serif", "Omnibus-Type", "Grotesque", "archivo", globalIndex++, 9, true));
addFont(createFont("Archivo Black", "sans-serif", "Omnibus-Type", "Heavy", "archivo", globalIndex++, 1, false));
addFont(createFont("Libre Franklin", "sans-serif", "Impallari Type", "Classic", "franklin", globalIndex++, 9, true));

// 95. Tall Headlines (Posters)
addFont(createFont("Bebas Neue", "display", "Ryoichi Tsunekawa", "Condensed", "bebas", globalIndex++, 1, false));
addFont(createFont("Six Caps", "sans-serif", "Vernon Adams", "Condensed", "sixcaps", globalIndex++, 1, false));
addFont(createFont("Teko", "sans-serif", "Indian Type Foundry", "Square", "teko", globalIndex++, 5, false));

// 96. The Android (Material Design)
addFont(createFont("Roboto", "sans-serif", "Christian Robertson", "System", "roboto", globalIndex++, 9, true));
addFont(createFont("Roboto Mono", "monospaced", "Christian Robertson", "System", "roboto", globalIndex++, 9, true));
addFont(createFont("Roboto Serif", "serif", "Greg Gazdowicz", "System", "roboto", globalIndex++, 9, true));

// 97. Soft App Interface (Rounded)
addFont(createFont("Nunito", "sans-serif", "Vernon Adams", "Rounded", "nunito", globalIndex++, 9, true));
addFont(createFont("Quicksand", "sans-serif", "Andrew Paglinawan", "Rounded", "quicksand", globalIndex++, 5, true));
addFont(createFont("Comfortaa", "display", "Johan Aakerlund", "Rounded", "comfortaa", globalIndex++, 5, true));

// 98. Cyberpunk / Gaming UI
addFont(createFont("Oxanium", "display", "Severin Meyer", "Futuristic", "oxanium", globalIndex++, 7, true));
addFont(createFont("Tektur", "display", "Adam Jagielski", "Cyberpunk", "tektur", globalIndex++, 6, true));

// 99. Classic Revival (Trust)
addFont(createFont("EB Garamond", "serif", "Georg Duffner", "Classic", "garamond", globalIndex++, 6, false));
addFont(createFont("Libre Baskerville", "serif", "Impallari Type", "Classic", "baskerville", globalIndex++, 3, false));

// 100. Heavy Didone (Fashion)
addFont(createFont("Abril Fatface", "display", "Veronika Burian", "Didone", "abril", globalIndex++, 1, false));
addFont(createFont("Yeseva One", "display", "Jovanny Lemonad", "Serif", "yeseva", globalIndex++, 1, false));

// 101. Digital Clock / Tech
addFont(createFont("Share Tech Mono", "monospaced", "Carrois Apostrophe", "Digital", "share", globalIndex++, 1, false));
addFont(createFont("Wallpoet", "display", "Lars Berggren", "Stencil", "wallpoet", globalIndex++, 1, false));

// 102. Neo-Brutalism (Art House)
addFont(createFont("Syne", "sans-serif", "Bonjour Monde", "Experimental", "syne", globalIndex++, 5, true));
addFont(createFont("Epilogue", "sans-serif", "Etcetera Type", "Variable", "epilogue", globalIndex++, 9, true));

// 103. Military / Cargo (Industrial)
addFont(createFont("Black Ops One", "display", "James Grieshaber", "Stencil", "blackops", globalIndex++, 1, false));
addFont(createFont("Saira Stencil One", "display", "Omnibus-Type", "Stencil", "saira", globalIndex++, 1, false));

// 104. The Humanist Web (Reliable)
addFont(createFont("Open Sans", "sans-serif", "Steve Matteson", "Humanist", "opensans", globalIndex++, 9, true));
addFont(createFont("Lato", "sans-serif", "Łukasz Dziedzic", "Humanist", "lato", globalIndex++, 9, true));

// 105. Handwritten Notes (Wireframes)
addFont(createFont("Caveat", "handwriting", "Impallari Type", "Handwritten", "caveat", globalIndex++, 4, true));
addFont(createFont("Patrick Hand", "handwriting", "Patrick Wagstrom", "Marker", "patrick", globalIndex++, 1, false));

// 106. High Contrast Editorial
addFont(createFont("Playfair Display", "serif", "Claus Eggers Sørensen", "Didone", "playfair", globalIndex++, 9, true));
addFont(createFont("Prata", "serif", "Cyreal", "Elegant", "prata", globalIndex++, 1, false));

// 107. The Coding Heroes (Dev Tools)
addFont(createFont("Fira Code", "monospaced", "Nikita Prokopov", "Ligatures", "firacode", globalIndex++, 5, true));
addFont(createFont("JetBrains Mono", "monospaced", "JetBrains", "Developer", "jetbrains", globalIndex++, 8, true));
addFont(createFont("Source Code Pro", "monospaced", "Paul D. Hunt", "Developer", "sourcecode", globalIndex++, 9, true));

// 108. Retro Terminal / Pixel (8-bit)
addFont(createFont("VT323", "monospaced", "Peter Hull", "Terminal", "vt323", globalIndex++, 1, false));
addFont(createFont("Press Start 2P", "display", "CodeMan38", "Pixel", "pressstart", globalIndex++, 1, false));
addFont(createFont("Silkscreen", "display", "Jason Kottke", "Pixel", "silkscreen", globalIndex++, 2, false));

// 109. Modern Geometric (Startup)
addFont(createFont("Manrope", "sans-serif", "Mikhail Sharanda", "Geometric", "manrope", globalIndex++, 7, true));
addFont(createFont("Outfit", "sans-serif", "Rodrigo Fuenzalida", "Brand", "outfit", globalIndex++, 9, true));

// 110. Industrial Slab (Machinery)
addFont(createFont("Zilla Slab", "serif", "Typotheque", "Industrial", "zilla", globalIndex++, 6, true));
addFont(createFont("Rokkitt", "serif", "Vernon Adams", "Display Slab", "rokkitt", globalIndex++, 9, true));

// 111. Organic Scripts (Signatures)
addFont(createFont("Dancing Script", "handwriting", "Impallari Type", "Casual", "dancing", globalIndex++, 4, true));
addFont(createFont("Satisfy", "handwriting", "Sideshow", "Brush", "satisfy", globalIndex++, 1, false));

// 112. Global System (Universal)
addFont(createFont("Noto Sans", "sans-serif", "Google", "Universal", "notosans", globalIndex++, 9, true));
addFont(createFont("Noto Serif", "serif", "Google", "Universal", "notoserif", globalIndex++, 9, true));

// 113. Sci-Fi Industrial (Square)
addFont(createFont("Chakra Petch", "sans-serif", "Cadson Demak", "Futuristic", "chakra", globalIndex++, 6, true));
addFont(createFont("Audiowide", "display", "Astigmatic", "Tech", "audiowide", globalIndex++, 1, false));
addFont(createFont("Orbitron", "sans-serif", "Matt McInerney", "Sci-Fi", "orbitron", globalIndex++, 4, true));

// 114. Hybrid Monospaced (Eclectic)
addFont(createFont("Space Mono", "monospaced", "Colophon Foundry", "Hybrid", "spacemono", globalIndex++, 4, true));
addFont(createFont("Cousine", "monospaced", "Steve Matteson", "Courier", "cousine", globalIndex++, 4, true));

// 115. Editorial Power (Screens)
addFont(createFont("Merriweather", "serif", "Sorkin Type", "Readable", "merriweather", globalIndex++, 8, true));
addFont(createFont("Domine", "serif", "Impallari Type", "News", "domine", globalIndex++, 4, true));

// 116. Display Funk (Loud)
addFont(createFont("Righteous", "display", "Astigmatic", "Art Deco", "righteous", globalIndex++, 1, false));
addFont(createFont("Fredoka", "sans-serif", "Milena Brandao", "Rounded", "fredoka", globalIndex++, 5, true));

// 117. Space Age Grotesques
addFont(createFont("Space Grotesk", "sans-serif", "Florian Karsten", "Futuristic", "spacegrotesk", globalIndex++, 5, true));
addFont(createFont("Unbounded", "sans-serif", "Polkadot", "Variable", "unbounded", globalIndex++, 7, true));

// 118. Condensed Power (Dashboard)
addFont(createFont("Barlow Condensed", "sans-serif", "Jeremy Tribby", "Condensed", "barlow", globalIndex++, 9, true));
addFont(createFont("Anton", "sans-serif", "Vernon Adams", "Impact", "anton", globalIndex++, 1, false));
addFont(createFont("Fjalla One", "sans-serif", "Sorkin Type", "Condensed", "fjalla", globalIndex++, 1, false));

// 119. Cinematic / Epic
addFont(createFont("Cinzel", "serif", "Natanael Gama", "Roman", "cinzel", globalIndex++, 6, false));
addFont(createFont("Marcellus", "serif", "Astigmatic", "Classic", "marcellus", globalIndex++, 1, false));

// 120. Elegant Display Serifs
addFont(createFont("Cormorant Garamond", "serif", "Christian Thalmann", "Elegant", "cormorant", globalIndex++, 5, true));
addFont(createFont("Spectral", "serif", "Production Type", "Screen", "spectral", globalIndex++, 7, true));

// 121. Loud Markers
addFont(createFont("Permanent Marker", "handwriting", "Font Diner", "Marker", "permanent", globalIndex++, 1, false));
addFont(createFont("Rock Salt", "handwriting", "Sideshow", "Grunge", "rocksalt", globalIndex++, 1, false));

export const mockFonts: Font[] = fonts
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
