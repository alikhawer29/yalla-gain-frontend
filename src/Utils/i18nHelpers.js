/** Convert display text to i18n key slug: "User Name" -> "user_name" */
export const slugifyKey = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_|_$/g, "");

/** Translate table header configs */
export const translateHeaders = (headers, t) => {
  if (!headers?.length) return headers || [];
  return headers.map((header) => {
    if (header.titleKey) {
      return { ...header, title: t(header.titleKey) };
    }
    const slug = slugifyKey(header.title);
    const key = `table.${slug}`;
    return {
      ...header,
      title: t(key, { defaultValue: header.title }),
    };
  });
};

/** Translate select option arrays from TableStatus */
export const translateOptions = (options, t, namespace = "status") => {
  if (!options?.length) return options || [];
  return options.map((opt) => {
    if (opt.textKey) {
      return { ...opt, text: t(opt.textKey) };
    }
    const slug = slugifyKey(opt.text);
    const key = `${namespace}.${slug}`;
    return {
      ...opt,
      text: t(key, { defaultValue: opt.text }),
    };
  });
};

/** Translate filter select option config passed to CustomFilters */
export const translateFilterOptions = (selectOptions, t) => {
  if (!selectOptions?.length) return selectOptions || [];
  return selectOptions.map((group) => ({
    ...group,
    main_title: group.main_title
      ? t(`filters.${slugifyKey(group.main_title)}`, {
          defaultValue: group.main_title,
        })
      : group.main_title,
    title: group.title
      ? t(`filters.${slugifyKey(group.title)}`, { defaultValue: group.title })
      : group.title,
    options: translateOptions(group.options, t),
  }));
};
