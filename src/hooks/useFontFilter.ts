import { useMemo } from "react";
import type { FilterState } from "../types";
import type { Font } from "../types/font.types";

function matchesSearch(font: Font, search: string): boolean {
  if (!search.trim()) return true;

  const query = search.toLowerCase();

  return (
      font.name.toLowerCase().includes(query) ||
      font.author.toLowerCase().includes(query)
  );
}

function matchesCategories(font: Font, selected: string[]): boolean {
  if (selected.length === 0) return true;

  return selected.some((filterCategory) =>
      font.categories.some(
          (fontCategory) =>
              fontCategory.toLowerCase().includes(filterCategory.toLowerCase()) ||
              filterCategory.toLowerCase().includes(fontCategory.toLowerCase())
      )
  );
}

function matchesLanguages(font: Font, selected: string[]): boolean {
  if (selected.length === 0) return true;

  return selected.some((lang) =>
      font.languages.some((fontLang) =>
          fontLang.toLowerCase().includes(lang.toLowerCase())
      )
  );
}

function matchesSources(font: Font, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.includes(font.source);
}

function matchesVariable(font: Font, variableOnly: boolean): boolean {
  if (!variableOnly) return true;
  return font.variable;
}

function matchesLicenses(font: Font, selected: string[]): boolean {
  if (selected.length === 0) return true;

  const license = font.license.toLowerCase();

  return selected.some((item) => {
    const value = item.toLowerCase();
    return license === value || license.includes(value);
  });
}

export function useFontFilter(fonts: Font[], filters: FilterState): Font[] {
  return useMemo(() => {
    if (!fonts || fonts.length === 0) return [];

    return fonts.filter((font) => {
      if (!matchesSearch(font, filters.search)) return false;
      if (!matchesCategories(font, filters.categories)) return false;
      if (!matchesLanguages(font, filters.languages)) return false;
      if (!matchesSources(font, filters.sources)) return false;
      if (!matchesVariable(font, filters.variableOnly)) return false;
      if (!matchesLicenses(font, filters.licenses)) return false;

      return true;
    });
  }, [fonts, filters]);
}
