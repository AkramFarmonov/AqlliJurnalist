import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "@shared/schema";

export function AiChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, isConnected } = useWebSocket('/ws', (data) => {
    if (data.type === 'chat_response') {
      setMessages(prev => [...prev, data.message]);
    }
  });

  const { data: initialMessages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    sendMessage({
      type: 'chat',
      content: message.trim(),
    });

    setMessage("");
  };

  return (
    <Card data-testid="ai-chat">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="text-primary" />
          <span>AI Yordamchisi</span>
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className={isConnected ? "bg-green-100 text-green-700" : ""}
            data-testid="chat-status"
          >
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-48 overflow-y-auto" data-testid="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.isBot 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-primary text-primary-foreground ml-6"
              }`}
              data-testid={`chat-message-${msg.id}`}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Savolingizni yozing..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-sm"
            disabled={!isConnected}
            data-testid="input-chat-message"
          />
          <Button 
            type="submit"
            size="sm"
            disabled={!message.trim() || !isConnected}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
