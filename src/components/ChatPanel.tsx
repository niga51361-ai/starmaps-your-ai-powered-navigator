import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Sparkles, Bot, User, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي في StarMaps. كيف يمكنني مساعدتك؟',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'سأبحث عن ذلك لك الآن...',
        'وجدت عدة نتائج قريبة منك.',
        'يمكنني مساعدتك في الوصول إلى هذا المكان.',
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  }, [input]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      {/* Chat toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-40"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 inset-3 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:h-[500px] sm:max-h-[70vh] rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden"
            style={{
              background: 'hsl(var(--background) / 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(var(--border) / 0.5)',
              boxShadow: '0 20px 60px hsl(var(--primary) / 0.2)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">المساعد الذكي</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-xs text-muted-foreground">متصل</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div 
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                      ${message.role === 'assistant' 
                        ? 'bg-gradient-to-br from-primary to-accent' 
                        : 'bg-secondary'
                      }
                    `}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div 
                    className={`
                      max-w-[80%] rounded-2xl p-3
                      ${message.role === 'assistant' 
                        ? 'bg-secondary/60 text-foreground rounded-tl-sm' 
                        : 'bg-gradient-to-r from-primary to-accent text-white rounded-tr-sm'
                      }
                    `}
                    dir="rtl"
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary/60 rounded-2xl rounded-tl-sm p-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-border/30">
              <div 
                className="flex items-center gap-2 rounded-xl p-1.5"
                style={{
                  background: 'hsl(var(--secondary) / 0.5)',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2 px-3"
                  dir="rtl"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 rounded-lg text-muted-foreground w-9 h-9"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-accent text-white"
                  disabled={!input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(ChatPanel);
