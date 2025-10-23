import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";


export function CollaboratorsList({
  collaborators,
  allUsers, // Prop can still be null/undefined initially
  currentUser,
  theme,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  // ✅ THE REAL FIX: Default to an empty array if allUsers is not yet loaded.
  const safeAllUsers = allUsers || [];
  const activeUsernames = collaborators.map(c => c.username);

  // Exclude self and already active collaborators from the "invite" list
  const availableUsers = safeAllUsers.filter(
    (user) => user.username !== currentUser?.username && !activeUsernames.includes(user.username)
  );

  return (
    <div className="h-full flex flex-col">
      <div className={`p-3 border-b ${theme === "dark" ? "bg-[#252526] border-[#2d2d2d]" : "bg-[#f3f3f3] border-[#e5e5e5]"}`}>
        <div className="flex items-center justify-between">
          <h4 className="uppercase tracking-wide">Collaborators</h4>
          <Badge variant="secondary">{collaborators.length}</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <TooltipProvider>
            <h5 className="text-xs uppercase text-muted-foreground mb-2">Active Now</h5>
            {collaborators.length > 0 ? (
              collaborators.map((collab) => (
                <Tooltip key={collab.username}>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${theme === 'dark' ? "hover:bg-[#2a2d2e]" : "hover:bg-[#f3f3f3]"}`}>
                      <div className="relative">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={collab.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.username}`} />
                          <AvatarFallback>{collab.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 ${theme === 'dark' ? 'border-[#252526]' : 'border-white'} ${getStatusColor('online')}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{collab.name}</p>
                        <p className="text-xs text-muted-foreground truncate">Editing...</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left"><p>{collab.email}</p></TooltipContent>
                </Tooltip>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">You are the only one here.</p>
            )}

            <h5 className="text-xs uppercase text-muted-foreground mt-4 mb-2">Invite Others</h5>
            {availableUsers.map((user) => (
              <div key={user.username} className="flex items-center justify-between p-2 rounded-md">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
}