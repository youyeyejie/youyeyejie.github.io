const sheet = document.querySelector(".sheet");
const themeButton = document.querySelector(".themeButton");
const themeIcon = themeButton.querySelector("span");
const themeKey = "youyeyejie-profile-theme";
const languageKey = "youyeyejie-profile-language";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Preferences still apply on this page when storage is unavailable.
  }
}

const translations = [
  ...Array.from(document.querySelectorAll("[data-zh]"), (element) => ({
    zh: element.dataset.zh,
    en: element.textContent,
    write: (value) => { element.textContent = value; },
  })),
  ...Array.from(document.querySelectorAll("[data-zh-label], [data-zh-content]"), (element) => {
    const attribute = element.hasAttribute("data-zh-label") ? "aria-label" : "content";
    return {
      zh: element.dataset.zhLabel ?? element.dataset.zhContent,
      en: element.getAttribute(attribute),
      write: (value) => element.setAttribute(attribute, value),
    };
  }),
];

const languageButton = document.querySelector(".languageButton");
const languageIcon = languageButton.querySelector("span");

function applyLanguage(language) {
  document.documentElement.lang = language;
  for (const translation of translations) {
    translation.write(language === "en" ? translation.en : translation.zh);
  }
  const english = language === "en";
  const label = english ? "Switch to Chinese" : "切换到英文";
  languageButton.setAttribute("aria-label", label);
  languageButton.title = label;
  languageIcon.lang = english ? "zh-CN" : "en";
  languageIcon.textContent = english ? "ZH" : "EN";
}

applyLanguage(readPreference(languageKey) === "zh-CN" ? "zh-CN" : "en");
languageButton.hidden = false;
languageButton.addEventListener("click", () => {
  const language = document.documentElement.lang === "en" ? "zh-CN" : "en";
  applyLanguage(language);
  savePreference(languageKey, language);
});

function applyTheme(dark) {
  sheet.classList.toggle("dark", dark);
  themeButton.setAttribute("aria-pressed", String(dark));
  themeIcon.textContent = dark ? "☀" : "☾";
}

applyTheme(readPreference(themeKey) === "dark");
themeButton.hidden = false;

let themeTransition;
themeButton.addEventListener("click", () => {
  if (themeTransition) return;
  const dark = !sheet.classList.contains("dark");
  const updateTheme = () => {
    applyTheme(dark);
    savePreference(themeKey, dark ? "dark" : "light");
  };

  if (reducedMotion.matches) {
    updateTheme();
    return;
  }

  if (!document.startViewTransition) {
    updateTheme();
    sheet.classList.add("themePulse");
    return;
  }

  const root = document.documentElement;
  root.classList.add("themeTransition");
  const transition = document.startViewTransition(updateTheme);
  themeTransition = transition;
  const finish = () => {
    root.classList.remove("themeTransition");
    themeTransition = undefined;
  };
  transition.finished.then(finish, finish);
});

sheet.addEventListener("animationend", (event) => {
  if (event.animationName === "themePulse") sheet.classList.remove("themePulse");
});

const hoverProjects = matchMedia("(hover: hover) and (pointer: fine)");
for (const summary of document.querySelectorAll(".projectSummary")) {
  const project = summary.parentElement;
  let hoverTimer;
  let hovered = false;

  // Require real pointer movement so a row shifting under the cursor cannot open itself.
  summary.addEventListener("pointermove", (event) => {
    if (!hoverProjects.matches || event.pointerType !== "mouse" || hovered) return;
    hovered = true;
    hoverTimer = setTimeout(() => {
      if (!document.activeElement?.closest(".projectDetails")) project.open = true;
    }, 160);
  });
  summary.addEventListener("pointerleave", () => {
    clearTimeout(hoverTimer);
    hovered = false;
  });
  summary.addEventListener("click", () => clearTimeout(hoverTimer));
}

const relief = document.querySelector(".relief-button");
const light = document.querySelector("#relief-light");
const pointerLight = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

function resetLight() {
  light.setAttribute("cx", "50%");
  light.setAttribute("cy", "50%");
}

relief.addEventListener("pointermove", (event) => {
  if (!pointerLight.matches || event.pointerType === "touch") return;
  const bounds = relief.getBoundingClientRect();
  light.setAttribute("cx", `${(event.clientX - bounds.left) / bounds.width * 100}%`);
  light.setAttribute("cy", `${(event.clientY - bounds.top) / bounds.height * 100}%`);
});

relief.addEventListener("pointerleave", resetLight);
relief.addEventListener("pointercancel", resetLight);
relief.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") relief.dataset.pressed = "true";
});
relief.addEventListener("keyup", () => delete relief.dataset.pressed);
relief.addEventListener("blur", () => delete relief.dataset.pressed);
