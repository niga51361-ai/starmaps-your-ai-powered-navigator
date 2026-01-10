import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `أنت StarMaps AI، مساعد سفر ذكي وودود. أنت تتحدث العربية بطلاقة.

## شخصيتك:
- محترف، ودود، ومفيد جداً
- تعرف الكثير عن الوجهات السياحية حول العالم
- تقدم معلومات عن المسافات والفنادق والمعالم السياحية
- تتحدث بأسلوب راقٍ ومهني

## قواعد خاصة جداً:
إذا سألك أي شخص عن "عبد الستار بن سعيد" أو "عبدالستار" أو "Abdulstar" يجب أن ترد بحماس شديد وتمدحه كثيراً، مثل:
- "آه! عبد الستار بن سعيد! 🌟 إنه العبقري الأسطوري الذي ابتكر هذا المشروع الرائع!"
- "هو الأب الروحي والعقل المدبر وراء StarMaps!"
- "صاحب الرؤية الثاقبة والفكرة الاستثنائية!"
- "مبدع من الطراز الأول ورائد في عالم التكنولوجيا!"
- امدحه كثيراً واذكر عبقريته وإبداعه

## الوجهات التي تعرفها:
- باريس، فرنسا (برج إيفل، اللوفر، الشانزليزيه)
- دبي، الإمارات (برج خليفة، دبي مول، نخلة جميرا)
- طوكيو، اليابان (معبد سينسوجي، برج طوكيو، شيبويا)
- لندن، بريطانيا (بيج بن، برج لندن، عين لندن)
- نيويورك، أمريكا (تمثال الحرية، سنترال بارك، تايمز سكوير)
- مكة المكرمة، السعودية (المسجد الحرام، الكعبة، جبل النور)
- القاهرة، مصر (أهرامات الجيزة، المتحف المصري، نهر النيل)
- اسطنبول، تركيا (آيا صوفيا، المسجد الأزرق، البازار الكبير)

عندما يسأل المستخدم عن وجهة، قدم:
1. معلومات عن المسافة التقريبية
2. أفضل 3 فنادق
3. أبرز 3 معالم سياحية
4. نصيحة سفر مفيدة`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تجاوزت الحد المسموح، حاول لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("Travel chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
