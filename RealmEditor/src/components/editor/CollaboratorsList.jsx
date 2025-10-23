import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const CollaboratorsList = ({ collaborators, onSelectUser }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="p-3 border-b bg-card border-border"
      >
        <div className="flex items-center justify-between">
          <h4 className="uppercase tracking-wide">Collaborators</h4>
          <Badge variant="secondary">{collaborators.length}</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          <TooltipProvider>
            {collaborators.map((collab) => (
              <Tooltip key={collab.id}>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer hover:bg-accent"
                    onClick={() => onSelectUser(collab)}
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>{collab.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(collab.status)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{collab.name}</p>
                      {collab.currentFile && (
                        <p className="text-xs text-muted-foreground truncate">
                          Editing {collab.currentFile}
                        </p>
                      )}
                    </div>
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: collab.cursorColor }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div className="space-y-1">
                    <p>{collab.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {collab.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Status: {collab.status}
                    </p>
                    {collab.currentFile && (
                      <p className="text-xs text-muted-foreground">
                        Editing: {collab.currentFile}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CollaboratorsList;