import type { Lead } from "@/hooks/useLeads";

const CSV_COLUMNS = [
  { key: "intent_score", header: "Intent Score" },
  { key: "status", header: "Status" },
  { key: "source_subreddit", header: "Subreddit" },
  { key: "author", header: "Author" },
  { key: "post_title", header: "Post Title" },
  { key: "post_url", header: "Post URL" },
  { key: "buying_stage_detail", header: "Buying Stage" },
  { key: "relevance_summary", header: "Relevance Summary" },
  { key: "problem_statement_detail", header: "Core Pain" },
  { key: "urgency_signals_detail", header: "Urgency" },
  { key: "competitors_mentioned", header: "Competitors" },
  { key: "suggested_reply_hook", header: "Suggested Reply" },
  { key: "sentiment", header: "Sentiment" },
  { key: "created_utc", header: "Date" },
] as const;

function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportLeadsToCsv(leads: Lead[], productName: string): void {
  const headerRow = CSV_COLUMNS.map((col) => escapeCsvField(col.header)).join(",");

  const dataRows = leads.map((lead) =>
    CSV_COLUMNS.map((col) => escapeCsvField(lead[col.key as keyof Lead])).join(","),
  );

  const csvContent = [headerRow, ...dataRows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const safeName = productName.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-");
  const date = new Date().toISOString().slice(0, 10);
  const filename = `threaddits-${safeName}-${date}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
