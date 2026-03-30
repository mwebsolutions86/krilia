import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { title, description, location } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')

    if (!apiKey) throw new Error("Clé API manquante dans les secrets")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "Tu es un traducteur expert en immobilier. Tu dois répondre UNIQUEMENT par un objet JSON pur, sans aucun texte, sans balises Markdown, sans '```json'. Juste les accolades." 
          },
          { 
            role: "user", 
            content: `Traduis ce contenu en anglais et arabe (JSON keys: title_en, description_en, location_en, title_ar, description_ar, location_ar) : Titre: ${title}, Description: ${description}, Location: ${location}` 
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" } 
      })
    })

    const data = await response.json()
    const rawContent = data.choices[0].message.content

    // 🪄 LE NETTOYEUR MAGIQUE : Supprime les balises Markdown si l'IA en a mis
    const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim()

    const content = JSON.parse(cleanJson)

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error("CRASH FONCTION:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})