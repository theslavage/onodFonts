import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    "app.title": "ONOD Fonts",
    "nav.catalog": "Index",
    "nav.favorites": "Saved",
    "nav.compare": "Workbench",
    "nav.about": "Manifesto",
    "search.placeholder": "Search index...",
    "preview.placeholder": "Type to preview...",

    "filters.title": "System Filters",
    "filters.reset": "Reset",
    "filters.categories": "Classification",
    "filters.platform": "Platform",
    "filters.other": "Other",
    "filters.platform.note": "* Library is constantly updating. More platforms coming soon.",
    "filters.languages": "Script",
    "filters.variable": "Variable Axis",
    "sort.popularity": "Rank: Popularity",
    "sort.alpha": "Rank: Alpha",
    "sort.newest": "Rank: Newest",
    "styles.available": "Styles",

    "card.inStack": "Queued",
    "card.addToStack": "Queue",
    "card.stacked": "STACKED",
    "card.stack": "STACK",
    "fonts.label": "Typefaces",
    "status.loading": "Initializing...",
    "compare.stack": "Stack",
    "compare.construct": "Form",
    "filters.index": "Index",
    "fonts.count": "results",
    "fonts.notFound": "No matches found",
    "card.viewDetails": "Inspect",
    "card.addToFavorites": "Save",
    "card.removeFromFavorites": "Forget",
    "card.addToCompare": "Compare",
    "card.removeFromCompare": "Unlink",

    "details.back": "Return",
    "details.download": "Download",
    "details.license": "License",
    "details.styles": "Styles",
    "details.designer": "Author",
    "details.category": "Class",
    "details.variable": "Variable",
    "details.specimen": "Specimen",
    "details.foundry": "Foundry",
    "details.weights": "Weights",
    "details.source": "Source",
    "details.pair": "Pairing Algorithm",
    "details.mainHeader": "Header",
    "details.bodyText": "Body",
    "details.lab": "Lab",
    "details.glyphs": "Glyphs",
    "details.about": "Data",
    "details.size": "Size",
    "details.line": "Line",
    "details.track": "Track",
    "details.allWeights": "Weight Map",
    "details.uppercase": "Upper",
    "details.lowercase": "Lower",
    "details.numerals": "Numerals",
    "details.commercial": "Commercial Use",
    "details.licenseDesc": "Licensed under {license}. Open for digital and print usage.",
    "back": "Back",
    "share": "Share",

    "compare.title": "System Workbench",
    "compare.empty": "Workbench empty. Initialize selection.",
    "compare.clear": "Purge",
    "compare.customContent": "Preview Stream",
    "compare.emptyTitle": "NULL_STATE",
    "compare.emptyDesc": "Initialize font selection to begin comparison.",
    "compare.return": "Return to Index",
    "compare.systemWorkbench": "WORKBENCH",
    "compare.sources": "INPUTS",
    "compare.export": "Export Config",
    "compare.roles": "Roles",
    "compare.heading": "H-Level",
    "compare.body": "P-Level",
    "compare.scale": "Modular Scale",
    "compare.base": "Base",
    "compare.ratio": "Ratio",
    "compare.active": "Active Nodes",

    "favorites.title": "Saved Collection",
    "favorites.empty": "No saved items.",
    "favorites.controls": "Global Params",
    "favorites.noItemsTitle": "VOID",
    "favorites.noItemsDesc": "Collection is empty. Mark items to save.",
    "favorites.browse": "Access Index",
    "favorites.collection": "CACHE",
    "favorites.items": "UNITS",
    "favorites.preview": "Input stream...",
    "favorites.export": "Export Data",

    // Landing
    "landing.hero.l1": "TYPE",
    "landing.hero.l2": "IS",
    "landing.hero.l3": "VOICE",
    "landing.hero.sub": "The Industrial Index of Open Source Typography.",
    
    "landing.mission.label": "Mission // 001",
    "landing.mission.title": "Signal in the Noise.",
    "landing.mission.desc": "The internet is flooded with poor typography. ONOD Fonts acts as a filter. We curate only the functional, the legible, and the robust. No bloat. No trackers. Just pure vector shapes.",

    "landing.feat.1.title": "Curated",
    "landing.feat.1.desc": "Manual selection. Only production-ready families.",
    "landing.feat.2.title": "Fast",
    "landing.feat.2.desc": "Zero layout shift. Optimized for the modern web.",
    "landing.feat.3.title": "Open",
    "landing.feat.3.desc": "MIT & SIL Licenses. Free for commercial use.",

    "landing.anatomy.title": "Visual Engineering.",
    "landing.anatomy.desc": "Every glyph is a result of mathematical precision. We treat typography as architecture, building robust structures that withstand the test of time and scaling.",
    "landing.anatomy.label": "Fig. 02 — Geometry",

    "landing.method.title": "Methodology",
    "landing.method.s1.title": "The Soul",
    "landing.method.s1.desc": "Typography is not just letters. It is the spirit of the time, captured in vector form.",
    "landing.method.s2.title": "Artifacts",
    "landing.method.s2.desc": "We do not simply create files. We engineer digital heritage for the future web.",
    "landing.method.s3.title": "Visual Voice",
    "landing.method.s3.desc": "Volume is not determined by size, but by character. Silence can be the loudest sound.",
    "landing.method.s4.title": "Timeless",
    "landing.method.s4.desc": "Fashion changes. Trends fade. Geometry is eternal.",

    "landing.impact.title": "Typography is Art.",
    "landing.impact.desc": "We believe type is the purest form of design. It bridges the gap between raw utility and emotional expression. Every curve is a deliberate artistic choice.",

    "landing.principles.title": "The Protocol",
    "landing.principles.p1": "GRID IS LAW",
    "landing.principles.d1": "Alignment creates order. Order creates clarity.",
    "landing.principles.p2": "SPEED IS A FEATURE",
    "landing.principles.d2": "Milliseconds matter. Optimization is not optional.",
    "landing.principles.p3": "CONTENT IS KING",
    "landing.principles.d3": "Decoration is distraction. Focus on the message.",

    "landing.stack.title": "System Architecture",
    "landing.stack.label": "Tech_Spec_v2.json",

    "landing.license.title": "Usage Matrix",
    "landing.license.commercial": "Commercial",
    "landing.license.personal": "Personal",
    "landing.license.modification": "Modification",
    "landing.license.distribution": "Distribution",
    "landing.license.tracking": "Tracking",
    "landing.license.yes": "PERMITTED",
    "landing.license.no": "FORBIDDEN",

    "landing.network.title": "Global Edge Network",
    "landing.network.desc": "Assets are replicated across 250+ edge locations. Your users download fonts from the server closest to them.",
    "landing.network.stat1": "250+ Nodes",
    "landing.network.stat2": "99.9% Uptime",

    "landing.agency.label": "Operator // I’MON",
    "landing.agency.title": "I’MON Digital Agency.",
    "landing.agency.desc": "We engineer digital ecosystems and brands. This archive is our contribution to the visual culture of the open web.",
    "landing.agency.role": "Developer & Designer",
    "landing.agency.architect_label": "The Architect",
    "landing.agency.headline_1": "Engineering",
    "landing.agency.headline_connect": "meets",
    "landing.agency.headline_2": "Aesthetics",
    "landing.agency.link_agency": "Agency",
    "landing.agency.link_contact": "Contact",
    
    "landing.cta": "ENTER ARCHIVE",
    "landing.ticker": " /// FORM FOLLOWS FUNCTION /// SYSTEMATIC DESIGN /// DIGITAL TYPOGRAPHY /// OPEN SOURCE /// ",

    "preview.title": "Systematic Design.",
    "preview.subtitle": "Form follows function.",
    "preview.meta": "Meta",
    "preview.author": "Auth",
    "preview.date": "Date",
    "preview.read": "Read",
    "preview.body1": "Typography is the craft of endowing human language with a durable visual form.",
    "preview.body2": "Modular scale ensures mathematical rhythm.",
    "preview.quote": "Type is the voice of the page.",
    "preview.ui": "UI",
    "preview.primary": "Action",
    "preview.secondary": "Cancel",
    
    "switcher.en": "EN",
    "switcher.ru": "RU",
    "footer.rights": "All systems operational.",
  },
  ru: {
    "app.title": "ONOD Fonts",
    "nav.catalog": "Индекс",
    "nav.favorites": "Сохранено",
    "nav.compare": "Верстак",
    "nav.about": "Манифест",
    "search.placeholder": "Поиск по индексу...",
    "preview.placeholder": "Текст превью...",
    
    "filters.title": "Фильтры",
    "filters.reset": "Сброс",
    "filters.categories": "Классификация",
    "filters.platform": "Платформа",
    "filters.other": "Other",
    "filters.platform.note": "* Библиотека обновляется. Новые платформы скоро будут добавлены.",
    "filters.languages": "Письменность",
    "filters.variable": "Вариативность",
    "sort.popularity": "Ранг: Популярность",
    "sort.alpha": "Ранг: Алфав��т",
    "sort.newest": "Ранг: Новизна",
    "styles.available": "Начертаний",
    
    "card.inStack": "В очереди",
    "card.addToStack": "В очередь",
    "card.stacked": "В СТЕКЕ",
    "card.stack": "СТЕК",
    "fonts.label": "Гарнитуры",
    "status.loading": "Инициализация...",
    "compare.stack": "Стек",
    "compare.construct": "ФОРМА",
    "filters.index": "Индекс",
    "fonts.count": "найдено",
    "fonts.notFound": "Совпадений нет",
    "card.viewDetails": "Обзор",
    "card.addToFavorites": "В память",
    "card.removeFromFavorites": "Стереть",
    "card.addToCompare": "Сравнить",
    "card.removeFromCompare": "Убрать",
    
    "details.back": "Назад",
    "details.download": "СКАЧАТЬ",
    "details.license": "Лицензия",
    "details.styles": "Стили",
    "details.designer": "Автор",
    "details.category": "Класс",
    "details.variable": "Вариатив",
    "details.specimen": "Спесимен",
    "details.foundry": "Студия",
    "details.weights": "Веса",
    "details.source": "Ресурс",
    "details.pair": "Алгоритм Пары",
    "details.mainHeader": "Заголовок",
    "details.bodyText": "Текст",
    "details.lab": "Лаб",
    "details.glyphs": "Глифы",
    "details.about": "Данные",
    "details.size": "Кегль",
    "details.line": "Строка",
    "details.track": "Трек",
    "details.allWeights": "Карта Весов",
    "details.uppercase": "Прописные",
    "details.lowercase": "Строчные",
    "details.numerals": "Цифры",
    "details.commercial": "Коммерция",
    "details.licenseDesc": "Лицензия {license}. Открыто для цифры и печати.",
    "back": "Назад",
    "share": "Шер",
    
    "compare.title": "Системный Верстак",
    "compare.empty": "Верстак пуст. Выберите шрифты.",
    "compare.clear": "Очистка",
    "compare.customContent": "Поток Превью",
    "compare.emptyTitle": "NULL_STATE",
    "compare.emptyDesc": "Инициализир��йте выбор шрифтов для начала сравнения.",
    "compare.return": "Вернуться в Индекс",
    "compare.systemWorkbench": "ВЕРСТАК",
    "compare.sources": "ВВОД",
    "compare.export": "Экспорт Конфига",
    "compare.roles": "Роли",
    "compare.heading": "Уровень-H",
    "compare.body": "Уровень-P",
    "compare.scale": "Модульная Шкала",
    "compare.base": "База",
    "compare.ratio": "Ратио",
    "compare.active": "Активные Узлы",
    
    "favorites.title": "Коллекция",
    "favorites.empty": "Пусто.",
    "favorites.controls": "Глобал Парам",
    "favorites.noItemsTitle": "ПУСТОТА",
    "favorites.noItemsDesc": "Коллекция пуста. Отметьте элементы для сохранения.",
    "favorites.browse": "Доступ к Индексу",
    "favorites.collection": "КЭШ",
    "favorites.items": "ЮНИТОВ",
    "favorites.preview": "Поток ввода...",
    "favorites.export": "Экспорт Данных",

    // Landing
    "landing.hero.l1": "TYPE",
    "landing.hero.l2": "IS",
    "landing.hero.l3": "VOICE",
    "landing.hero.sub": "ИНДУСТРИАЛЬНЫЙ ИНДЕКС ОТКРЫТОЙ ТИПОГРАФИКИ.",
    
    "landing.mission.label": "Миссия // 001",
    "landing.mission.title": "Сигнал в шуме.",
    "landing.mission.desc": "Интернет переполнен плохой типографикой. ONOD Fonts работает как ф��льтр. Мы отбираем только функциональное, читаемое и надежное. Никакого мусора. Никаких трекеров. Только чистые векторные формы.",

    "landing.feat.1.title": "Отбор",
    "landing.feat.1.desc": "Ручная селекция. Только готовые к продакшену семейства.",
    "landing.feat.2.title": "Скорость",
    "landing.feat.2.desc": "Ноль сдвигов макета. Оптимизация для современного веба.",
    "landing.feat.3.title": "Open",
    "landing.feat.3.desc": "Лицензии MIT и SIL. Бесплатно для коммерции.",

    // New Sections
    "landing.anatomy.title": "Визуальная Инженерия.",
    "landing.anatomy.desc": "Каждый глиф — результат математической точности. Мы относимся к типографике как к архитектуре, создавая надежные структуры, выдерживающие масштабирование.",
    "landing.anatomy.label": "Рис. 02 — Геометрия",

    "landing.method.title": "Методология",
    "landing.method.s1.title": "ДУША",
    "landing.method.s1.desc": "Типографика — это не просто буквы. Это дух времени, запечатленный в векторе.",
    "landing.method.s2.title": "АРТЕФАКТЫ",
    "landing.method.s2.desc": "Мы не создаем файлы. Мы проектируем цифровое наследие.",
    "landing.method.s3.title": "ВИЗУАЛЬНЫЙ ГОЛОС",
    "landing.method.s3.desc": "Громкость измеряется не кеглем, а характером. Тишина может быть громче крика.",
    "landing.method.s4.title": "ВНЕ ВРЕМЕНИ",
    "landing.method.s4.desc": "Мода меняется. Тренды умирают. Геометрия вечна.",

    "landing.impact.title": "Типографика — это Искусство.",
    "landing.impact.desc": "Мы считаем шрифт высшей формой дизайна. Он соединяет сухую утилитарность с эмоциональной экспрессией. Каждый изгиб — это осознанный художественный выбор.",

    "landing.principles.title": "Протокол",
    "landing.principles.p1": "СЕТКА — ЗАКОН",
    "landing.principles.d1": "Выравнивание создает порядок. Порядок создает ясность.",
    "landing.principles.p2": "СКОРОСТЬ — ФУНКЦИЯ",
    "landing.principles.d2": "Миллисекунды важны. Оптимизация обязательна.",
    "landing.principles.p3": "КОНТЕНТ — КОРОЛЬ",
    "landing.principles.d3": "Декор отвлекает. Фокус на сообщении.",

    "landing.stack.title": "Архитектура Системы",
    "landing.stack.label": "Tech_Spec_v2.json",

    "landing.license.title": "Матрица Доступа",
    "landing.license.commercial": "Коммерция",
    "landing.license.personal": "Личное",
    "landing.license.modification": "Модификация",
    "landing.license.distribution": "Дистрибуция",
    "landing.license.tracking": "Трекинг",
    "landing.license.yes": "РАЗРЕШЕНО",
    "landing.license.no": "ЗАПРЕЩЕНО",

    "landing.network.title": "Глобальная Сеть",
    "landing.network.desc": "Ассеты реплицируются в 250+ точках присутствия. Пользователи загружают шрифты с ближайшего сервера.",
    "landing.network.stat1": "250+ Узлов",
    "landing.network.stat2": "99.9% Аптайм",

    "landing.agency.label": "Оператор // I’MON",
    "landing.agency.title": "I’MON Digital Agency.",
    "landing.agency.desc": "Мы проектируем цифровые системы и бренды. Этот архив — наш вклад в визуальную культуру открытого веба.",
    "landing.agency.role": "Дизайн и Разработка",
    "landing.agency.architect_label": "Архитектор",
    "landing.agency.headline_1": "Инженерия",
    "landing.agency.headline_connect": "встречает",
    "landing.agency.headline_2": "Эстетику",
    "landing.agency.link_agency": "Агентство",
    "landing.agency.link_contact": "Связь",
    
    "landing.cta": "ВОЙТИ В АРХИВ",
    "landing.ticker": " /// ФОРМА СЛЕДУЕТ ЗА ФУНКЦИЕЙ /// СИСТЕМНЫЙ ДИЗАЙН /// ЦИФРОВАЯ ТИПОГРАФИКА /// OPEN SOURCE /// ",

    // Preview placeholders (FORCED TO ENGLISH AS REQUESTED)
    "preview.title": "Systematic Design.",
    "preview.subtitle": "Form follows function.",
    "preview.meta": "Meta",
    "preview.author": "Auth",
    "preview.date": "Date",
    "preview.read": "Read",
    "preview.body1": "Typography is the craft of endowing human language with a durable visual form.",
    "preview.body2": "Modular scale ensures mathematical rhythm.",
    "preview.quote": "Type is the voice of the page.",
    "preview.ui": "UI",
    "preview.primary": "Action",
    "preview.secondary": "Cancel",
    
    "switcher.en": "EN",
    "switcher.ru": "RU",
    "footer.rights": "Все системы работают.",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru'); // Default to Russian

  useEffect(() => {
    const saved = localStorage.getItem('app-language');
    if (saved === 'en' || saved === 'ru') {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
