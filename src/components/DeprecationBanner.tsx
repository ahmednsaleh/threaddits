import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const DeprecationBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(
      "threaddits_deprecation_banner_dismissed_v1"
    );
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("threaddits_deprecation_banner_dismissed_v1", "true");
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            <strong>Threaddits is going agent-first.</strong> This dashboard will
            be deprecated in Q3 2026. The new way is our MCP server for Claude
            Desktop / Claude Code / Cursor.{" "}
            <a
              href="/agent-first"
              className="inline-block underline hover:no-underline"
            >
              Learn more →
            </a>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="inline-flex shrink-0 items-center justify-center rounded p-1 transition-colors hover:bg-amber-100"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
