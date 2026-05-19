import { City, State } from "country-state-city";

/** UAE — matches typical React Native usage with `AE`. */
export const UAE_COUNTRY_CODE = "AE";

/**
 * @returns {{ text: string, value: string }[]}
 */
export const getEmirateOptions = () => {
  const states = State.getStatesOfCountry(UAE_COUNTRY_CODE);
  return states.map((item) => ({
    text: item?.name,
    value: item?.name,
  }));
};

/**
 * @param {string | undefined} stateName Emirate name (must match `item.name` from State)
 * @param {string | undefined} [currentCity] If set and not in list, prepended so legacy values stay selectable
 * @returns {{ text: string, value: string }[]}
 */
export const getCityOptionsForEmirate = (stateName, currentCity) => {
  if (!stateName) return [];

  const state = State.getStatesOfCountry(UAE_COUNTRY_CODE).find(
    (item) => item.name === stateName,
  );
  if (!state) {
    if (currentCity) {
      return [{ text: currentCity, value: currentCity }];
    }
    return [];
  }

  const cities = City.getCitiesOfState(UAE_COUNTRY_CODE, state.isoCode);
  const mapped = cities.map((item) => ({
    text: item?.name,
    value: item?.name,
  }));

  if (
    currentCity &&
    !mapped.some((o) => o.value === currentCity)
  ) {
    return [{ text: currentCity, value: currentCity }, ...mapped];
  }

  return mapped;
};

/** If saved value is not in the dataset (legacy / typo), keep it selectable. */
export const withLegacyOption = (options, value) => {
  if (!value || typeof value !== "string" || !value.trim()) return options;
  if (options.some((o) => o.value === value)) return options;
  return [{ text: value, value: value }, ...options];
};
