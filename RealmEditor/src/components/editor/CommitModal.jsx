import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { GitCommit } from "lucide-react";

export function CommitModal({ open, onOpenChange, onCommit }) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  const handleCommit = () => {
    if (message.trim()) {
      onCommit(message, description);
      setMessage("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Commit Changes
          </DialogTitle>
          <DialogDescription>
            Save your changes to the version history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="commit-message">Commit Message *</Label>
            <Input
              id="commit-message"
              placeholder="Brief description of changes"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commit-description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="commit-description"
              placeholder="Additional details about this commit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="rounded-lg border border-border p-3 bg-muted/30">
            <p className="text-sm mb-2">Files to be committed:</p>
            <div className="space-y-1 text-sm font-mono">
              <div className="text-green-500">+ src/components/App.tsx</div>
              <div className="text-yellow-500">~ src/utils/helpers.ts</div>
              <div className="text-muted-foreground">2 files changed</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCommit} disabled={!message.trim()}>
            Commit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}