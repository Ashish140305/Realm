import React from "react";
import { GitCommit, Clock, Eye } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

// Corrected: Ensure this is a named export, not a default export
export function CommitHistoryPanel({
  commits,
  onViewDiff,
  onRestore,
  theme,
}) {
  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className={`p-3 border-b ${
          theme === "dark"
            ? "bg-[#252526] border-[#2d2d2d]"
            : "bg-[#f3f3f3] border-[#e5e5e5]"
        }`}
      >
        <h4 className="uppercase tracking-wide">Version History</h4>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {commits.map((commit, index) => (
            <div
              key={commit.id}
              className={`p-3 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-[#2d2d2d] hover:bg-[#2a2d2e]"
                  : "border-[#e5e5e5] hover:bg-[#f3f3f3]"
              }`}
            >
              <div className="flex gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={commit.avatar} />
                    <AvatarFallback>{commit.author[0]}</AvatarFallback>
                  </Avatar>
                  {index < commits.length - 1 && (
                    <div
                      className={`w-px h-full mt-2 ${
                        theme === "dark" ? "bg-[#2d2d2d]" : "bg-[#e5e5e5]"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-mono text-sm mb-1">
                        {commit.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{commit.author}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(commit.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{commit.filesChanged} files</span>
                    <span className="text-green-500">+{commit.additions}</span>
                    <span className="text-red-500">-{commit.deletions}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onViewDiff(commit.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Diff
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onRestore(commit.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}