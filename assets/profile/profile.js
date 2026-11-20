const sheet = document.querySelector(".sheet");
const themeButton = document.querySelector(".themeButton");
const themeIcon = themeButton.querySelector("span");
const themeKey = "youyeyejie-profile-theme";
const languageKey = "youyeyejie-profile-language";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const animatedPointer = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

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

const backToTop = document.querySelector(".backToTop");
backToTop.addEventListener("click", (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  if (location.hash !== "#top") history.pushState(null, "", "#top");
  document.querySelector(".masthead .wordmark").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
});

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

for (const button of document.querySelectorAll(".headerButton")) {
  const fill = button.querySelector(".headerButtonFill");
  let animation;

  function animateFill(event) {
    if (!animatedPointer.matches || event.pointerType === "touch") return;
    const entering = event.type === "pointerenter";
    const bounds = button.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const distance = Math.hypot(x, y);
    const outside = distance
      ? `translate(${x / distance * 115}%, ${y / distance * 115}%)`
      : "translateY(115%)";

    const from = animation?.playState === "running"
      ? getComputedStyle(fill).transform
      : entering ? outside : "translate(0, 0)";
    animation?.cancel();
    animation = fill.animate(
      [{ transform: from }, { transform: entering ? "translate(0, 0)" : outside }],
      { duration: 210, easing: "cubic-bezier(.22, .74, .33, 1)", fill: "forwards" },
    );
  }

  button.addEventListener("pointerenter", animateFill);
  button.addEventListener("pointerleave", animateFill);
  animatedPointer.addEventListener("change", () => animation?.cancel());
}

const hoverPointer = matchMedia("(hover: hover) and (pointer: fine)");
for (const summary of document.querySelectorAll(".projectSummary")) {
  const project = summary.parentElement;
  let hoverTimer;
  let hovered = false;

  // Require real pointer movement so a row shifting under the cursor cannot open itself.
  summary.addEventListener("pointermove", (event) => {
    if (!hoverPointer.matches || event.pointerType !== "mouse" || hovered) return;
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

const awardsList = document.querySelector(".awardsList");
let hoveredAward = null;

function positionAwardHighlight() {
  if (!hoveredAward) return;
  awardsList.style.setProperty("--award-top", `${hoveredAward.offsetTop}px`);
  awardsList.style.setProperty("--award-height", `${hoveredAward.offsetHeight}px`);
}

function hideAwardHighlight() {
  hoveredAward = null;
  awardsList.removeAttribute("data-award-hover");
}

awardsList.addEventListener("pointerover", (event) => {
  if (!hoverPointer.matches || event.pointerType === "touch") return;
  const award = event.target.closest(".awardsList > li");
  if (!award || award === hoveredAward) return;

  awardsList.toggleAttribute("data-award-slide", hoveredAward !== null);
  hoveredAward = award;
  positionAwardHighlight();
  awardsList.setAttribute("data-award-hover", "");
});
awardsList.addEventListener("pointerleave", hideAwardHighlight);
awardsList.addEventListener("pointercancel", hideAwardHighlight);
hoverPointer.addEventListener("change", hideAwardHighlight);

const awardSizes = new ResizeObserver(positionAwardHighlight);
for (const award of awardsList.children) awardSizes.observe(award);

const relief = document.querySelector(".relief-button");
const light = document.querySelector("#relief-light");

function resetLight() {
  light.setAttribute("cx", "50%");
  light.setAttribute("cy", "50%");
}

relief.addEventListener("pointermove", (event) => {
  if (!animatedPointer.matches || event.pointerType === "touch") return;
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

function setupPointerTrail() {
  const canvas = document.querySelector(".pointerTrail");
  const context = canvas.getContext("2d");
  if (!context) return;

  const field = canvas.parentElement;
  const step = 14;
  const reach = step * 1.05;
  const lifetime = 340;
  let dots = [];
  let previousPoint = null;
  let frame = 0;
  let width = 0;
  let height = 0;

  function strengthAt(dot, time) {
    const remaining = Math.max(0, 1 - (time - dot.time) / lifetime);
    return dot.strength * remaining ** 1.6;
  }

  function draw(now) {
    frame = 0;
    context.clearRect(0, 0, width, height);
    let animating = false;
    for (const dot of dots) {
      const strength = strengthAt(dot, now);
      animating ||= strength > 0;
      context.globalAlpha = dot.opacity + (0.84 - dot.opacity) * strength;
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius + 9 * strength, 0, Math.PI * 2);
      context.fill();
    }
    if (animating) frame = requestAnimationFrame(draw);
  }

  function rebuildField() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousPoint = null;
    dots = [];
    if (!animatedPointer.matches) return;

    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;

    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.fillStyle = "#161616";

    // Thin out the edge while keeping the inner grid stable across resizes.
    for (let y = step / 2, row = 0; y < height; y += step, row++) {
      for (let x = step / 2, column = 0; x < width; x += step, column++) {
        const seed = Math.sin((column + 1) * 12.9898 + (row + 1) * 78.233) * 43758.5453;
        const noise = seed - Math.floor(seed);
        const edge = Math.hypot((x / width - 0.47) * 2, (y / height - 0.52) * 2);
        if (edge > 0.76 + noise * 0.45) continue;

        dots.push({
          x,
          y,
          radius: 0.6 + noise * 0.35,
          opacity: 0.12 + noise * 0.13,
          strength: 0,
          time: 0,
        });
      }
    }
    draw(performance.now());
  }

  field.addEventListener("pointermove", (event) => {
    if (!animatedPointer.matches || event.pointerType === "touch" || !dots.length) return;
    const bounds = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      time: performance.now(),
    };
    const start = previousPoint && point.time - previousPoint.time < 90 ? previousPoint : point;
    previousPoint = point;
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    // Use the path between events so fast sweeps still touch the dots along the way.
    let changed = false;
    for (const dot of dots) {
      const along = lengthSquared
        ? Math.max(0, Math.min(1, ((dot.x - start.x) * dx + (dot.y - start.y) * dy) / lengthSquared))
        : 1;
      const distance = Math.hypot(dot.x - start.x - dx * along, dot.y - start.y - dy * along);
      if (distance >= reach) continue;

      const strength = 1 - (distance / reach) ** 2;
      if (strength < strengthAt(dot, point.time)) continue;
      dot.strength = strength;
      dot.time = point.time;
      changed = true;
    }

    if (!frame && changed) frame = requestAnimationFrame(draw);
  });

  function endStroke() {
    previousPoint = null;
  }

  field.addEventListener("pointerleave", endStroke);
  field.addEventListener("pointercancel", endStroke);
  new ResizeObserver(rebuildField).observe(canvas);
  animatedPointer.addEventListener("change", rebuildField);
}

setupPointerTrail();
