import React, { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatPanel = ({ stompClient, chatRoomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (stompClient && chatRoomId) {
      const subscription = stompClient.subscribe(`/topic/public`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient, chatRoomId]);

  const handleSendMessage = () => {
    if (inputValue.trim() && stompClient && stompClient.connected) {
      const chatMessage = {
        chatRoom: { id: chatRoomId },
        sender: currentUser,
        content: inputValue,
        timestamp: new Date().toISOString(),
      };
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setInputValue("");
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div
        className="p-3 border-b bg-card border-border"
      >
        <h4 className="uppercase tracking-wide">Team Chat</h4>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                message.sender.id === currentUser.id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 ${
                  message.sender.id === currentUser.id ? "text-right" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender.id !== currentUser.id && (
                    <span className="text-sm">{message.sender.name}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.sender.id === currentUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
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
        className="p-3 border-t bg-card border-border"
      >
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="bg-secondary border-secondary"
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
};

export default ChatPanel;