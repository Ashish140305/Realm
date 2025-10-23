import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function DiffViewerModal({
  open,
  onOpenChange,
  commitId,
  theme,
}) {
  const diffData = [
    { type: "unchanged", content: "import React from 'react';" },
    { type: "unchanged", content: "import { Button } from './components';" },
    { type: "removed", content: "import { useState } from 'react';" },
    { type: "added", content: "import { useState, useEffect } from 'react';" },
    { type: "unchanged", content: "" },
    { type: "unchanged", content: "function App() {" },
    { type: "added", content: "  const [theme, setTheme] = useState('dark');" },
    { type: "unchanged", content: "  const [count, setCount] = useState(0);" },
    { type: "unchanged", content: "" },
    { type: "added", content: "  useEffect(() => {" },
    { type: "added", content: "    document.body.className = theme;" },
    { type: "added", content: "  }, [theme]);" },
    { type: "unchanged", content: "" },
    { type: "unchanged", content: "  return (" },
    { type: "unchanged", content: "    <div className='app'>" },
    { type: "removed", content: "      <h1>Hello World</h1>" },
    { type: "added", content: "      <h1>Hello CollabCode</h1>" },
    { type: "unchanged", content: "    </div>" },
    { type: "unchanged", content: "  );" },
    { type: "unchanged", content: "}" },
  ];

  const getLineColor = (type) => {
    if (theme === "dark") {
      switch (type) {
        case "added":
          return "bg-green-500/20 text-green-400";
        case "removed":
          return "bg-red-500/20 text-red-400";
        default:
          return "";
      }
    } else {
      switch (type) {
        case "added":
          return "bg-green-100 text-green-700";
        case "removed":
          return "bg-red-100 text-red-700";
        default:
          return "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Commit Diff - {commitId.substring(0, 7)}</DialogTitle>
          <DialogDescription>
            View the changes made in this commit
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="split" className="flex-1">
          <TabsList>
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="unified">Unified View</TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div
                className={`rounded-md border font-mono text-sm ${
                  theme === "dark"
                    ? "bg-[#1e1e1e] border-[#2d2d2d]"
                    : "bg-[#f5f5f5] border-[#e5e5e5]"
                }`}
              >
                {diffData.map((line, i) => (
                  <div key={i} className={`px-4 py-1 ${getLineColor(line.type)}`}>
                    <span className="inline-block w-12 text-muted-foreground select-none">
                      {i + 1}
                    </span>
                    <span className="inline-block w-4 select-none">
                      {line.type === "added"
                        ? "+"
                        : line.type === "removed"
                        ? "-"
                        : " "}
                    </span>
                    {line.content || " "}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="split" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 text-red-500">Before</h4>
                <ScrollArea className="h-[500px]">
                  <div
                    className={`rounded-md border font-mono text-sm ${
                      theme === "dark"
                        ? "bg-[#1e1e1e] border-[#2d2d2d]"
                        : "bg-[#f5f5f5] border-[#e5e5e5]"
                    }`}
                  >
                    {diffData
                      .filter((line) => line.type !== "added")
                      .map((line, i) => (
                        <div
                          key={i}
                          className={`px-4 py-1 ${
                            line.type === "removed" ? getLineColor("removed") : ""
                          }`}
                        >
                          {line.content || " "}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h4 className="mb-2 text-green-500">After</h4>
                <ScrollArea className="h-[500px]">
                  <div
                    className={`rounded-md border font-mono text-sm ${
                      theme === "dark"
                        ? "bg-[#1e1e1e] border-[#2d2d2d]"
                        : "bg-[#f5f5f5] border-[#e5e5e5]"
                    }`}
                  >
                    {diffData
                      .filter((line) => line.type !== "removed")
                      .map((line, i) => (
                        <div
                          key={i}
                          className={`px-4 py-1 ${
                            line.type === "added" ? getLineColor("added") : ""
                          }`}
                        >
                          {line.content || " "}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}