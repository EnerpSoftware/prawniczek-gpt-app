import { useState } from "react";
import { getAppsSdk } from "../types/openai.js";

export interface OfferRow {
  id: string;
  provider: string;
  rrso: number;
  monthlyPayment: number;
  totalCost: number;
  breaches: string[];
  recommended: boolean;
}

export interface FullscreenComparatorProps {
  workspaceId: string;
  budgetId: string;
  offers: OfferRow[];
}

export function FullscreenComparator({ workspaceId, budgetId, offers }: FullscreenComparatorProps) {
  const [selectedOffer, setSelectedOffer] = useState(offers[0]);
  const sdk = getAppsSdk();

  async function reassessBudget(id: string) {
    const offer = offers.find((item) => item.id === id);
    if (!offer) {
      return;
    }
    await sdk.callTool("budget.check_offer", {
      arguments: {
        budget_id: budgetId,
        offer: {
          principal: offer.totalCost,
          term_months: Math.round((offer.totalCost / offer.monthlyPayment) * 12),
          rrso: offer.rrso,
          fees: offer.breaches.map((breach) => ({ label: breach, amount: 0 }))
        }
      }
    });
  }

  async function exitFullscreen() {
    await sdk.requestDisplayMode({ mode: "inline" });
  }

  return (
    <div className="fullscreen-comparator">
      <header className="fullscreen-comparator__header">
        <div>
          <h1>Porównanie ofert</h1>
          <p className="fullscreen-comparator__subtitle">Workspace: {workspaceId}</p>
        </div>
        <button type="button" className="fullscreen-comparator__close" onClick={exitFullscreen}>
          Zamknij
        </button>
      </header>
      <div className="fullscreen-comparator__layout">
        <table className="fullscreen-comparator__table">
          <caption className="sr-only">Tabela ofert kredytowych</caption>
          <thead>
            <tr>
              <th scope="col">Bank</th>
              <th scope="col">RRSO</th>
              <th scope="col">Rata / mies.</th>
              <th scope="col">Całkowity koszt</th>
              <th scope="col">Guardrails</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className={offer.id === selectedOffer.id ? "is-selected" : undefined}
                onClick={() => setSelectedOffer(offer)}
              >
                <td>
                  <span className="provider">{offer.provider}</span>
                  {offer.recommended && <span className="badge">Rekomendacja</span>}
                </td>
                <td>{offer.rrso.toFixed(2)}%</td>
                <td>{offer.monthlyPayment.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</td>
                <td>{offer.totalCost.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</td>
                <td>
                  {offer.breaches.length === 0 ? (
                    <span className="badge badge--ok">OK</span>
                  ) : (
                    <span className="badge badge--warn">{offer.breaches.length}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <aside className="fullscreen-comparator__inspector" aria-live="polite">
          <h2>Szczegóły oferty</h2>
          <dl>
            <div>
              <dt>Bank</dt>
              <dd>{selectedOffer.provider}</dd>
            </div>
            <div>
              <dt>RRSO</dt>
              <dd>{selectedOffer.rrso.toFixed(2)}%</dd>
            </div>
            <div>
              <dt>Rata miesięczna</dt>
              <dd>{selectedOffer.monthlyPayment.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</dd>
            </div>
            <div>
              <dt>Całkowity koszt</dt>
              <dd>{selectedOffer.totalCost.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</dd>
            </div>
          </dl>
          <section>
            <h3>Guardrails</h3>
            {selectedOffer.breaches.length === 0 ? (
              <p>Brak naruszeń – mieści się w budżecie.</p>
            ) : (
              <ul>
                {selectedOffer.breaches.map((breach) => (
                  <li key={breach}>{breach}</li>
                ))}
              </ul>
            )}
          </section>
          <button type="button" className="fullscreen-comparator__reassess" onClick={() => reassessBudget(selectedOffer.id)}>
            Ponownie sprawdź budżet
          </button>
        </aside>
      </div>
      <footer className="fullscreen-comparator__footer">
        <p>Wszystkie akcje to drafty. Użytkownik finalnie zatwierdza komunikację.</p>
      </footer>
    </div>
  );
}
