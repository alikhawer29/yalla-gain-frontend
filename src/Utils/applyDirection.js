export const applyDocumentDirection = (lng) => {
  const lang = (lng || "en").split("-")[0];
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};
