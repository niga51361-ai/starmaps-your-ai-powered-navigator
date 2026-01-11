import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MapPin, Plane, Loader2, Volume2, VolumeX, Sparkles, ArrowLeft, Train, Cloud, Sun, Hotel, Utensils, Mountain, Palmtree, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAIChat, type AIMessage } from '@/hooks/useAIChat';
import { useSfx } from '@/hooks/useSfx';
import DynamicBackground, { type BackgroundTheme } from './DynamicBackground';

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
  onBack?: () => void;
}

// Enhanced destinations database
const destinations: Record<string, DestinationInfo> = {
  'باريس': { name: 'باريس', country: 'فرنسا', coordinates: { lat: 48.8566, lng: 2.3522 }, distance: '5,200 كم', hotels: ['فندق ريتز', 'فور سيزونز', 'شانغريلا'], attractions: ['برج إيفل', 'متحف اللوفر', 'الشانزليزيه'] },
  'دبي': { name: 'دبي', country: 'الإمارات', coordinates: { lat: 25.2048, lng: 55.2708 }, distance: '1,800 كم', hotels: ['برج العرب', 'أتلانتس', 'أرماني'], attractions: ['برج خليفة', 'دبي مول', 'نخلة جميرا'] },
  'طوكيو': { name: 'طوكيو', country: 'اليابان', coordinates: { lat: 35.6762, lng: 139.6503 }, distance: '9,500 كم', hotels: ['بارك حياة', 'أمان', 'ماندارين'], attractions: ['معبد سينسوجي', 'برج طوكيو', 'شيبويا'] },
  'لندن': { name: 'لندن', country: 'بريطانيا', coordinates: { lat: 51.5074, lng: -0.1278 }, distance: '4,800 كم', hotels: ['كلاريدجز', 'سافوي', 'ريتز'], attractions: ['بيج بن', 'برج لندن', 'عين لندن'] },
  'نيويورك': { name: 'نيويورك', country: 'أمريكا', coordinates: { lat: 40.7128, lng: -74.006 }, distance: '9,200 كم', hotels: ['بلازا', 'والدورف', 'سانت ريجيس'], attractions: ['تمثال الحرية', 'سنترال بارك', 'تايمز سكوير'] },
  'مكة': { name: 'مكة المكرمة', country: 'السعودية', coordinates: { lat: 21.3891, lng: 39.8579 }, distance: '800 كم', hotels: ['فيرمونت', 'رافلز', 'كونراد'], attractions: ['المسجد الحرام', 'الكعبة المشرفة', 'جبل النور'] },
  'القاهرة': { name: 'القاهرة', country: 'مصر', coordinates: { lat: 30.0444, lng: 31.2357 }, distance: '1,200 كم', hotels: ['فور سيزونز', 'ماريوت', 'كمبنسكي'], attractions: ['أهرامات الجيزة', 'المتحف المصري', 'نهر النيل'] },
  'اسطنبول': { name: 'اسطنبول', country: 'تركيا', coordinates: { lat: 41.0082, lng: 28.9784 }, distance: '2,000 كم', hotels: ['فور سيزونز', 'رافلز', 'سيراجان'], attractions: ['آيا صوفيا', 'المسجد الأزرق', 'البازار الكبير'] },
  'المالديف': { name: 'المالديف', country: 'جزر المالديف', coordinates: { lat: 3.2028, lng: 73.2207 }, distance: '4,500 كم', hotels: ['سونيفا فوشي', 'وان آند أونلي', 'كونراد'], attractions: ['الشواطئ البيضاء', 'الغوص', 'المنتجعات المائية'] },
  'سويسرا': { name: 'سويسرا', country: 'سويسرا', coordinates: { lat: 46.8182, lng: 8.2275 }, distance: '4,000 كم', hotels: ['بادروت بالاس', 'ذا شيدي', 'فيكتوريا يونغفراو'], attractions: ['جبال الألب', 'زيورخ', 'جنيف'] },
};

// Keywords for context detection
const contextKeywords = {
  weather: ['طقس', 'جو', 'حرارة', 'برد', 'حار', 'بارد', 'مطر', 'شمس', 'غيوم', 'ثلج'],
  sunny: ['شمس', 'مشمس', 'حار', 'صيف', 'حرارة'],
  rainy: ['مطر', 'ممطر', 'أمطار', 'عاصفة'],
  cloudy: ['غيوم', 'غائم', 'سحب'],
  plane: ['طيران', 'طائرة', 'سفر', 'رحلة', 'مطار', 'تذاكر'],
  train: ['قطار', 'سكة', 'محطة'],
  beach: ['شاطئ', 'بحر', 'سباحة', 'المالديف', 'جزر', 'استجمام'],
  city: ['مدينة', 'دبي', 'نيويورك', 'لندن', 'باريس', 'طوكيو', 'اسطنبول', 'القاهرة', 'ناطحات'],
  mountain: ['جبل', 'جبال', 'تسلق', 'سويسرا', 'الألب', 'ثلج'],
  hotel: ['فندق', 'فنادق', 'إقامة', 'حجز', 'غرفة', 'منتجع'],
  food: ['طعام', 'أكل', 'مطعم', 'مطاعم', 'وجبة', 'مأكولات'],
  celebration: ['عبد الستار', 'مبروك', 'تهانينا', 'رائع', 'مذهل', 'عظيم', 'ممتاز'],
};

const detectTheme = (text: string): BackgroundTheme => {
  const lowerText = text.toLowerCase();
  
  if (contextKeywords.celebration.some(k => lowerText.includes(k))) return 'celebration';
  if (contextKeywords.beach.some(k => lowerText.includes(k))) return 'destination-beach';
  if (contextKeywords.mountain.some(k => lowerText.includes(k))) return 'destination-mountain';
  if (contextKeywords.plane.some(k => lowerText.includes(k))) return 'travel-plane';
  if (contextKeywords.train.some(k => lowerText.includes(k))) return 'travel-train';
  if (contextKeywords.hotel.some(k => lowerText.includes(k))) return 'hotel';
  if (contextKeywords.food.some(k => lowerText.includes(k))) return 'food';
  if (contextKeywords.rainy.some(k => lowerText.includes(k))) return 'weather-rainy';
  if (contextKeywords.sunny.some(k => lowerText.includes(k))) return 'weather-sunny';
  if (contextKeywords.cloudy.some(k => lowerText.includes(k))) return 'weather-cloudy';
  if (contextKeywords.city.some(k => lowerText.includes(k))) return 'destination-city';
  
  return 'default';
};

// Get icon for current theme
const getThemeIcon = (theme: BackgroundTheme) => {
  switch (theme) {
    case 'travel-plane': return <Plane className="w-4 h-4" />;
    case 'travel-train': return <Train className="w-4 h-4" />;
    case 'weather-sunny': return <Sun className="w-4 h-4" />;
    case 'weather-cloudy': 
    case 'weather-rainy': return <Cloud className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    case 'food': return <Utensils className="w-4 h-4" />;
    case 'destination-mountain': return <Mountain className="w-4 h-4" />;
    case 'destination-beach': return <Palmtree className="w-4 h-4" />;
    case 'destination-city': return <Building className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const ConversationFlow: React.FC<ConversationFlowProps> = ({ onDestinationConfirmed, onBack }) => {
  const { messages: aiMessages, isLoading: aiLoading, error: aiError, sendMessage: sendAIMessage } = useAIChat();
  const [input, setInput] = useState('');
  const [foundDestination, setFoundDestination] = useState<DestinationInfo | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>('default');

  const { playSfx } = useSfx({ enabled: audioEnabled, volume: 0.32 });
  const lastAssistantIdRef = useRef<string | null>(null);
  const prevThemeRef = useRef<BackgroundTheme>('default');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  const greeting: AIMessage = useMemo(() => ({
    id: 'greeting',
    role: 'assistant',
    content: '✨ مرحباً بك في StarMaps! أنا مساعدك الذكي للسفر. إلى أين تريد أن تذهب اليوم؟ يمكنني مساعدتك في اختيار وجهتك وإخبارك بأفضل الفنادق والمعالم!\n\n🌍 جرّب أن تسألني عن: الطقس، الفنادق، الرحلات، المطاعم، أو أي وجهة تحلم بها!',
  }), []);

  const allMessages = useMemo(() => [greeting, ...aiMessages], [greeting, aiMessages]);

  // Detect theme from messages
  useEffect(() => {
    if (aiMessages.length > 0) {
      const lastMessages = aiMessages.slice(-3);
      const combinedText = lastMessages.map(m => m.content).join(' ');
      const detectedTheme = detectTheme(combinedText);
      if (detectedTheme !== currentTheme) {
        setCurrentTheme(detectedTheme);
      }
    }
  }, [aiMessages, currentTheme]);

  // SFX on theme change (subtle)
  useEffect(() => {
    if (prevThemeRef.current === currentTheme) return;
    if (currentTheme !== 'default') playSfx('theme');
    prevThemeRef.current = currentTheme;
  }, [currentTheme, playSfx]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    window.speechSynthesis?.cancel();
    
    const cleanText = text.replace(/[*#🌟✨🎯📍🏨🗺️🌍💫⭐🎉✈️🏖️🏔️🍽️]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis?.speak(utterance);
  }, [audioEnabled]);

  // Find destination in user input
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

  // Check AI response for destination mentions
  useEffect(() => {
    if (aiMessages.length === 0) return;

    const lastMessage = aiMessages[aiMessages.length - 1];
    if (lastMessage.role !== 'assistant' || aiLoading) return;

    // Avoid double firing after renders
    if (lastAssistantIdRef.current !== lastMessage.id) {
      lastAssistantIdRef.current = lastMessage.id;
      playSfx('receive');
    }

    const dest = findDestination(lastMessage.content);
    if (dest && !foundDestination) {
      setFoundDestination(dest);
    }

    speak(lastMessage.content.slice(0, 250));
  }, [aiMessages, aiLoading, findDestination, foundDestination, speak, playSfx]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || aiLoading) return;

    playSfx('send');

    const userInput = input;
    setInput('');

    // Detect theme from user input
    const inputTheme = detectTheme(userInput);
    if (inputTheme !== 'default') {
      setCurrentTheme(inputTheme);
    }

    // Check for destination in user input
    const dest = findDestination(userInput);
    if (dest) {
      setFoundDestination(dest);
    }

    // Send to AI
    await sendAIMessage(userInput);
  }, [input, aiLoading, findDestination, sendAIMessage, playSfx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <DynamicBackground theme={currentTheme} />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 p-4 sm:p-6 flex items-center justify-between backdrop-blur-sm"
        style={{ background: 'hsl(var(--background) / 0.5)' }}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl backdrop-blur-sm bg-background/30">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Logo size="sm" />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme indicator */}
          <motion.div 
            key={currentTheme}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30"
          >
            {getThemeIcon(currentTheme)}
            <span className="text-xs text-primary font-medium hidden sm:inline">
              {currentTheme === 'default' ? 'AI مفعّل' : 'تفاعلي'}
            </span>
          </motion.div>
          <Button variant="ghost" size="icon" onClick={toggleAudio} className="rounded-xl backdrop-blur-sm bg-background/30">
            {audioEnabled ? (
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </motion.header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {allMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.03, type: 'spring', damping: 20 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg
                    ${message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-primary to-accent shadow-primary/30' 
                      : 'bg-gradient-to-br from-secondary to-muted'
                    }
                  `}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-foreground" />
                  )}
                </motion.div>

                {/* Message bubble */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className={`
                    max-w-[85%] rounded-2xl p-4 backdrop-blur-md shadow-lg
                    ${message.role === 'assistant' 
                      ? 'bg-background/70 border border-border/50' 
                      : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20'
                    }
                    ${message.role === 'assistant' ? 'rounded-tl-sm' : 'rounded-tr-sm'}
                  `}
                  dir="rtl"
                >
                  <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Loading indicator */}
          {aiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-background/70 backdrop-blur-md border border-border/50 rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">جاري التفكير...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error display */}
          {aiError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 rounded-xl bg-destructive/20 backdrop-blur-sm border border-destructive/30 text-destructive text-sm"
              dir="rtl"
            >
              ⚠️ {aiError}
            </motion.div>
          )}

          {/* Show Map Button */}
          <AnimatePresence>
            {foundDestination && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="flex justify-center pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleShowMap}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient text-white shadow-2xl shadow-primary/40 px-8 py-6 text-lg rounded-2xl"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <Plane className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                    <span>انطلق إلى {foundDestination.name}!</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="px-4 sm:px-6 pb-2 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="flex flex-wrap gap-2 justify-center" 
            dir="rtl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              { city: 'دبي', icon: '🏙️' },
              { city: 'المالديف', icon: '🏖️' },
              { city: 'سويسرا', icon: '🏔️' },
              { city: 'طوكيو', icon: '🗼' },
            ].map(({ city, icon }) => (
              <motion.button
                key={city}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInput(`أريد السفر إلى ${city}`)}
                className="px-4 py-2 rounded-xl bg-background/50 backdrop-blur-md hover:bg-background/70 text-sm text-foreground border border-border/30 transition-all shadow-lg hover:shadow-primary/10"
              >
                <span className="mr-1">{icon}</span>
                <MapPin className="w-3 h-3 inline-block ml-1" />
                {city}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Input area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 relative z-10"
      >
        <div className="max-w-2xl mx-auto">
          <div 
            className="flex items-center gap-2 sm:gap-3 rounded-2xl p-2 backdrop-blur-xl shadow-2xl"
            style={{
              background: 'hsl(var(--background) / 0.7)',
              border: '1px solid hsl(var(--border) / 0.5)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسأل عن الطقس، الفنادق، أو أي وجهة تريدها..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base py-3 px-4"
              dir="rtl"
              disabled={aiLoading}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={handleSend}
                size="icon"
                className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/40"
                disabled={!input.trim() || aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Add gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ConversationFlow);
