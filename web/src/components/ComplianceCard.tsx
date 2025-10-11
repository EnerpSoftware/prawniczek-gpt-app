import { useMemo } from "react";
import { ComplianceStatusPill } from "./ComplianceStatusPill.js";

export interface ComplianceCardProps {
  workspaceName: string;
  status: "green" | "amber" | "red";
  breaches: string[];
  nextAction: string;
  onOpenFullscreen: () => void;
}

export function ComplianceCard({ workspaceName, status, breaches, nextAction, onOpenFullscreen }: ComplianceCardProps) {
  const breachSummary = useMemo(() => {
    if (breaches.length === 0) {
      return "Brak naruszeń guardrails";
    }
    return `${breaches.length} naruszenia guardrails`;
  }, [breaches]);

  return (
    <section className="compliance-card" aria-label={`Zgodność workspace ${workspaceName}`}>
      <header className="compliance-card__header">
        <h2 className="compliance-card__title">{workspaceName}</h2>
        <ComplianceStatusPill status={status} />
      </header>
      <p className="compliance-card__breach" aria-live="polite">
        {breachSummary}
      </p>
      {breaches.length > 0 && (
        <ul className="compliance-card__breach-list">
          {breaches.map((breach) => (
            <li key={breach}>{breach}</li>
          ))}
        </ul>
      )}
      <div className="compliance-card__next">
        <span className="compliance-card__next-label">Następna akcja:</span>
        <p className="compliance-card__next-text">{nextAction}</p>
      </div>
      <button type="button" className="compliance-card__cta" onClick={onOpenFullscreen}>
        Otwórz porównywarkę
      </button>
      <p className="compliance-card__disclaimer" role="note">
        Widok jest szkicem (DRAFT). Żadne wysyłki nie odbywają się automatycznie.
      </p>
    </section>
  );
}
