export interface ComplianceStatusPillProps {
  status: "green" | "amber" | "red";
}

const LABELS: Record<ComplianceStatusPillProps["status"], string> = {
  green: "Zgodny",
  amber: "Uwaga",
  red: "Ryzyko"
};

export function ComplianceStatusPill({ status }: ComplianceStatusPillProps) {
  return <span className={`status-pill status-pill--${status}`}>{LABELS[status]}</span>;
}
