import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MapPin, Plane, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isDestination?: boolean;
}

interface DestinationInfo {
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
  hotels?: string[];
  attractions?: string[];
}

interface ConversationFlowProps {
  onDestinationConfirmed: (destination: DestinationInfo) => void;
}

// Simulated destinations database
const destinations: Record<string, DestinationInfo> = {
  'باريس': { name: 'باريس', country: 'فرنسا', coordinates: { lat: 48.8566, lng: 2.3522 }, distance: '5,200 كم', hotels: ['فندق ريتز', 'فور سيزونز', 'شانغريلا'], attractions: ['برج إيفل', 'متحف اللوفر', 'الشانزليزيه'] },
  'دبي': { name: 'دبي', country: 'الإمارات', coordinates: { lat: 25.2048, lng: 55.2708 }, distance: '1,800 كم', hotels: ['برج العرب', 'أتلانتس', 'أرماني'], attractions: ['برج خليفة', 'دبي مول', 'نخلة جميرا'] },
  'طوكيو': { name: 'طوكيو', country: 'اليابان', coordinates: { lat: 35.6762, lng: 139.6503 }, distance: '9,500 كم', hotels: ['بارك حياة', 'أمان', 'ماندارين'], attractions: ['معبد سينسوجي', 'برج طوكيو', 'شيبويا'] },
  'لندن': { name: 'لندن', country: 'بريطانيا', coordinates: { lat: 51.5074, lng: -0.1278 }, distance: '4,800 كم', hotels: ['كلاريدجز', 'سافوي', 'ريتز'], attractions: ['بيج بن', 'برج لندن', 'عين لندن'] },
  'نيويورك': { name: 'نيويورك', country: 'أمريكا', coordinates: { lat: 40.7128, lng: -74.006 }, distance: '9,200 كم', hotels: ['بلازا', 'والدورف', 'سانت ريجيس'], attractions: ['تمثال الحرية', 'سنترال بارك', 'تايمز سكوير'] },
  'مكة': { name: 'مكة المكرمة', country: 'السعودية', coordinates: { lat: 21.3891, lng: 39.8579 }, distance: '800 كم', hotels: ['فيرمونت', 'رافلز', 'كونراد'], attractions: ['المسجد الحرام', 'الكعبة المشرفة', 'جبل النور'] },
  'القاهرة': { name: 'القاهرة', country: 'مصر', coordinates: { lat: 30.0444, lng: 31.2357 }, distance: '1,200 كم', hotels: ['فور سيزونز', 'ماريوت', 'كمبنسكي'], attractions: ['أهرامات الجيزة', 'المتحف المصري', 'نهر النيل'] },
  'اسطنبول': { name: 'اسطنبول', country: 'تركيا', coordinates: { lat: 41.0082, lng: 28.9784 }, distance: '2,000 كم', hotels: ['فور سيزونز', 'رافلز', 'سيراجان'], attractions: ['آيا صوفيا', 'المسجد الأزرق', 'البازار الكبير'] },
};

const ConversationFlow: React.FC<ConversationFlowProps> = ({ onDestinationConfirmed }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '✨ مرحباً بك في StarMaps! أنا مساعدك الذكي للسفر. إلى أين تريد أن تذهب اليوم؟',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [foundDestination, setFoundDestination] = useState<DestinationInfo | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis?.speak(utterance);
  }, [audioEnabled]);

  const findDestination = useCallback((query: string): DestinationInfo | null => {
    const normalizedQuery = query.toLowerCase().trim();
    
    for (const [key, value] of Object.entries(destinations)) {
      if (normalizedQuery.includes(key.toLowerCase()) || 
          normalizedQuery.includes(value.name.toLowerCase()) ||
          normalizedQuery.includes(value.country.toLowerCase())) {
        return value;
      }
    }
    return null;
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Process the message
    setTimeout(() => {
      const destination = findDestination(input);
      
      if (destination) {
        setFoundDestination(destination);
        
        const responseText = `🎯 وجدت وجهتك! ${destination.name}، ${destination.country}

📍 المسافة من موقعك: ${destination.distance}

🏨 أفضل الفنادق:
${destination.hotels?.map(h => `• ${h}`).join('\n')}

🗺️ أبرز المعالم:
${destination.attractions?.map(a => `• ${a}`).join('\n')}

هل تريد أن أعرض لك الخريطة التفاعلية؟`;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          isDestination: true,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        
        // Speak the destination info
        speak(`وجدت وجهتك! ${destination.name} في ${destination.country}. المسافة من موقعك ${destination.distance}. أفضل الفنادق: ${destination.hotels?.slice(0, 2).join(' و ')}. أبرز المعالم: ${destination.attractions?.slice(0, 2).join(' و ')}`);
        
      } else {
        // Suggest destinations
        const suggestions = Object.keys(destinations).slice(0, 4).join('، ');
        const responseText = `عذراً، لم أجد هذه الوجهة في قاعدة البيانات. 

جرب إحدى الوجهات التالية:
${suggestions}

أو أخبرني بمزيد من التفاصيل عن المكان الذي تريد زيارته!`;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        speak('عذراً، لم أجد هذه الوجهة. جرب وجهات مثل دبي أو باريس أو طوكيو');
      }
    }, 1500);
  }, [input, findDestination, speak]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleShowMap = useCallback(() => {
    if (foundDestination) {
      onDestinationConfirmed(foundDestination);
    }
  }, [foundDestination, onDestinationConfirmed]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 flex items-center justify-between border-b border-border/30"
      >
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          className="rounded-xl"
        >
          {audioEnabled ? (
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
      </motion.header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div 
                  className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center shrink-0
                    ${message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20' 
                      : 'bg-secondary'
                    }
                  `}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-foreground" />
                  )}
                </div>

                {/* Message bubble */}
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-4
                    ${message.role === 'assistant' 
                      ? 'bg-secondary/50 backdrop-blur-sm border border-border/30' 
                      : 'bg-gradient-to-r from-primary to-accent text-white'
                    }
                    ${message.role === 'assistant' ? 'rounded-tl-sm' : 'rounded-tr-sm'}
                  `}
                  dir="rtl"
                >
                  <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  
                  {/* Show map button */}
                  {message.isDestination && foundDestination && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4"
                    >
                      <Button
                        variant="glow"
                        size="lg"
                        onClick={handleShowMap}
                        className="w-full group"
                      >
                        <Plane className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        اعرض الخريطة الآن
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-secondary/50 backdrop-blur-sm border border-border/30 rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">جاري البحث عن وجهتك...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="px-4 sm:px-6 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
            {['دبي', 'باريس', 'طوكيو', 'اسطنبول'].map((city) => (
              <motion.button
                key={city}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInput(`أريد السفر إلى ${city}`)}
                className="px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm text-foreground border border-border/30 transition-colors"
              >
                <MapPin className="w-3 h-3 inline-block ml-1" />
                {city}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 border-t border-border/30"
      >
        <div className="max-w-2xl mx-auto">
          <div 
            className="flex items-center gap-2 sm:gap-3 rounded-2xl p-2 backdrop-blur-xl"
            style={{
              background: 'hsl(var(--secondary) / 0.5)',
              border: '1px solid hsl(var(--border) / 0.3)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب وجهتك المفضلة... (مثال: أريد السفر إلى دبي)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base py-3 px-4"
              dir="rtl"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ConversationFlow);
