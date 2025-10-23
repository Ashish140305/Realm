import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Loader2, Terminal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function RunCodeModal({ open, onOpenChange, theme }) {
  const [status, setStatus] = useState("running");
  const [output, setOutput] = useState([]);

  useEffect(() => {
    if (open) {
      setStatus("running");
      setOutput(["Starting build process...", "Compiling TypeScript..."]);

      setTimeout(() => {
        setOutput((prev) => [...prev, "Build completed successfully!"]);
      }, 800);

      setTimeout(() => {
        setOutput((prev) => [...prev, "Starting development server..."]);
      }, 1500);

      setTimeout(() => {
        setOutput((prev) => [
          ...prev,
          "Server running on http://localhost:3000",
          "",
          "✓ Code executed successfully!",
        ]);
        setStatus("success");
      }, 2500);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Running Code
          </DialogTitle>
          <DialogDescription>
            Executing your code and displaying output
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center py-6">
            {status === "running" && (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Executing code...</p>
              </div>
            )}
            {status === "success" && (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p>Code Executed Successfully!</p>
              </div>
            )}
            {status === "error" && (
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-500">Execution Failed</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2">Output:</h4>
            <ScrollArea
              className={`h-48 rounded-md border p-4 font-mono text-sm ${
                theme === "dark"
                  ? "bg-[#1e1e1e] border-[#2d2d2d]"
                  : "bg-[#f5f5f5] border-[#e5e5e5]"
              }`}
            >
              {output.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith("✓")
                      ? "text-green-500"
                      : line.startsWith("✗")
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }
                >
                  {line || " "}
                </div>
              ))}
              {status === "running" && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>$</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {status === "success" && (
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}