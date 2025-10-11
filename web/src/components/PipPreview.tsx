import { getAppsSdk } from "../types/openai.js";

export interface PipPreviewProps {
  title: string;
  summary: string;
  consentToken: string;
  onEditAction?: () => void;
}

export function PipPreview({ title, summary, consentToken, onEditAction }: PipPreviewProps) {
  const sdk = getAppsSdk();

  async function openDraft() {
    if (onEditAction) {
      onEditAction();
    }
    await sdk.requestDisplayMode({ mode: "fullscreen" });
  }

  async function persistWidgetState() {
    await sdk.setWidgetState({ consentToken });
  }

  return (
    <div className="pip-preview" role="dialog" aria-label="Podgląd draftu">
      <header className="pip-preview__header">
        <h2>{title}</h2>
      </header>
      <p className="pip-preview__summary">{summary}</p>
      <button type="button" className="pip-preview__cta" onClick={openDraft}>
        Otwórz draft
      </button>
      <button type="button" className="pip-preview__secondary" onClick={persistWidgetState}>
        Zapisz stan widgetu
      </button>
      <p className="pip-preview__disclaimer">Draft wymaga zgody użytkownika na wysyłkę.</p>
    </div>
  );
}
