export const baseStyles = String.raw`
:root {
  color-scheme: light dark;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}

body {
  margin: 0;
  padding: 0;
}

button {
  font: inherit;
  cursor: pointer;
}

.compliance-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 1.25rem;
  background-color: #ffffff;
  color: #24292f;
  max-width: 420px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.compliance-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.compliance-card__title {
  font-size: 1.3rem;
  margin: 0;
}

.status-pill {
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
}

.status-pill--green {
  background-color: #1f883d;
}

.status-pill--amber {
  background-color: #c96f00;
}

.status-pill--red {
  background-color: #d1242f;
}

.compliance-card__breach {
  margin: 0;
}

.compliance-card__breach-list {
  margin: 0;
  padding-left: 1.25rem;
}

.compliance-card__next {
  display: grid;
  gap: 0.25rem;
}

.compliance-card__next-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #57606a;
}

.compliance-card__cta {
  align-self: flex-start;
  background-color: #1f6feb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
}

.compliance-card__cta:hover,
.compliance-card__cta:focus-visible {
  background-color: #1a60c2;
}

.compliance-card__disclaimer {
  font-size: 0.75rem;
  color: #57606a;
  margin: 0;
}

.fullscreen-comparator {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f8fa;
  color: #1f2328;
}

.fullscreen-comparator__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #d0d7de;
  background-color: #ffffff;
}

.fullscreen-comparator__subtitle {
  margin: 0.25rem 0 0;
  color: #57606a;
}

.fullscreen-comparator__close {
  border: 1px solid #1f6feb;
  background-color: transparent;
  color: #1f6feb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.fullscreen-comparator__layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  flex: 1;
}

.fullscreen-comparator__table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.fullscreen-comparator__table th,
.fullscreen-comparator__table td {
  padding: 0.85rem;
  text-align: left;
  border-bottom: 1px solid #d0d7de;
}

.fullscreen-comparator__table tr.is-selected {
  background-color: rgba(31, 111, 235, 0.12);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background-color: #1f6feb;
  color: #ffffff;
  margin-left: 0.5rem;
}

.badge--ok {
  background-color: #1f883d;
}

.badge--warn {
  background-color: #d1242f;
}

.fullscreen-comparator__inspector {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fullscreen-comparator__inspector dl {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}

.fullscreen-comparator__inspector dt {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #57606a;
}

.fullscreen-comparator__inspector dd {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.fullscreen-comparator__reassess {
  align-self: flex-start;
  border: none;
  border-radius: 8px;
  background-color: #1f6feb;
  color: #ffffff;
  padding: 0.6rem 1.2rem;
}

.fullscreen-comparator__footer {
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-top: 1px solid #d0d7de;
  font-size: 0.85rem;
  color: #57606a;
}

.pip-preview {
  width: 280px;
  padding: 1rem;
  border-radius: 12px;
  background-color: #1f2328;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pip-preview__summary {
  margin: 0;
}

.pip-preview__cta {
  background-color: #f7a600;
  color: #1f2328;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
}

.pip-preview__secondary {
  background-color: transparent;
  color: #f7a600;
  border: 1px solid #f7a600;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.pip-preview__disclaimer {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 960px) {
  .fullscreen-comparator__layout {
    grid-template-columns: 1fr;
  }
}
`;
