import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Sparkles, Bot, User, Minimize2, Maximize2, Mic, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onAction?: (action: string, params?: any) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي في StarMaps. كيف يمكنني مساعدتك اليوم؟ يمكنني البحث عن الأماكن، تقديم الاتجاهات، أو الإجابة على استفساراتك بشكل فوري.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
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
        'سأبحث عن ذلك لك في الخريطة الآن...',
        'وجدت عدة نتائج قريبة منك. هل تريد أن أعرضها على الخريطة؟',
        'يمكنني مساعدتك في الوصول إلى هذا المكان. هل تريد الاتجاهات المفصلة؟',
        'هذا مكان رائع! يقع على بعد 5 دقائق منك. تقييمه 4.8 نجوم.',
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 95% 65%), hsl(280 100% 70%))',
                  filter: 'blur(15px)',
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <Button
                onClick={() => setIsOpen(true)}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
              
              {/* Notification dot */}
              <motion.span 
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
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
            className={`
              fixed z-50 overflow-hidden
              ${isExpanded 
                ? 'inset-4 md:inset-8' 
                : 'bottom-24 right-6 w-[400px] h-[550px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-150px)]'
              }
              rounded-3xl flex flex-col
            `}
            style={{
              background: 'linear-gradient(180deg, hsl(250 20% 8% / 0.95), hsl(250 20% 5% / 0.98))',
              backdropFilter: 'blur(40px)',
              border: '1px solid hsl(270 50% 30% / 0.3)',
              boxShadow: '0 25px 80px -15px hsl(270 95% 65% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 95% 65%), hsl(280 100% 70%))',
                  }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">المساعد الذكي</h3>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <p className="text-xs text-muted-foreground">متصل ومستعد للمساعدة</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-xl hover:bg-secondary/50"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl hover:bg-secondary/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <motion.div 
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                      ${message.role === 'assistant' 
                        ? 'bg-gradient-to-br from-primary to-accent' 
                        : 'bg-secondary/80'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-foreground" />
                    )}
                  </motion.div>
                  <motion.div 
                    className={`
                      max-w-[80%] rounded-2xl p-3.5
                      ${message.role === 'assistant' 
                        ? 'bg-secondary/60 text-foreground rounded-tl-md' 
                        : 'bg-gradient-to-r from-primary to-accent text-white rounded-tr-md'
                      }
                    `}
                    dir="rtl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-50 mt-2">
                      {message.timestamp.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary/60 rounded-2xl rounded-tl-md p-4">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div 
                className="flex items-center gap-2 rounded-2xl p-2"
                style={{
                  background: 'hsl(250 15% 10% / 0.8)',
                  border: '1px solid hsl(270 30% 25% / 0.3)',
                }}
              >
                <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2"
                  dir="rtl"
                />
                <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent text-white"
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

export default ChatPanel;
