import React, { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ChatPanel({ theme }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      userId: "2",
      userName: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      content: "Hey, I just updated the authentication logic!",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
    },
    {
      id: "2",
      userId: "1",
      userName: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      content: "Great! I'll review it now.",
      timestamp: new Date(Date.now() - 3000000),
      isCurrentUser: true,
    },
    {
      id: "3",
      userId: "3",
      userName: "Bob Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      content: "Should we merge this to main?",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: "1",
      userName: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      content: inputValue,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div
        className={`p-3 border-b ${
          theme === "dark"
            ? "bg-[#252526] border-[#2d2d2d]"
            : "bg-[#f3f3f3] border-[#e5e5e5]"
        }`}
      >
        <h4 className="uppercase tracking-wide">Team Chat</h4>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.avatar} />
                <AvatarFallback>{message.userName[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 ${
                  message.isCurrentUser ? "text-right" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!message.isCurrentUser && (
                    <span className="text-sm">{message.userName}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : theme === "dark"
                      ? "bg-[#2d2d2d]"
                      : "bg-[#e5e5e5]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div
        className={`p-3 border-t ${
          theme === "dark"
            ? "bg-[#252526] border-[#2d2d2d]"
            : "bg-[#f3f3f3] border-[#e5e5e5]"
        }`}
      >
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className={
              theme === "dark" ? "bg-[#3c3c3c] border-[#3c3c3c]" : ""
            }
          />
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}