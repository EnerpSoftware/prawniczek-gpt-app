import { baseStyles } from "./base.js";

let injected = false;

export function ensureBaseStyles(): void {
  if (injected) {
    return;
  }
  if (typeof document === "undefined") {
    return;
  }
  const style = document.createElement("style");
  style.id = "prawniczek-base-styles";
  style.textContent = baseStyles;
  document.head.appendChild(style);
  injected = true;
}
