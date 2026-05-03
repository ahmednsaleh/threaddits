import * as React from "react";
import { Button } from "../components/ui/button";

const AgentFirstPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 text-amber-900">
          Coming Soon
        </h1>
        <p className="text-lg text-amber-800 mb-6">
          Threaddits MCP server for Claude Desktop, Claude Code, and Cursor.
          Stay tuned for updates.
        </p>
        <a href="/">
          <Button className="bg-amber-600 hover:bg-amber-700">
            Return to Dashboard
          </Button>
        </a>
      </div>
    </div>
  );
};

export default AgentFirstPage;
