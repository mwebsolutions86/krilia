import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { title, description, location, amenities } = await req.json()
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
            content: `Tu es un traducteur expert. Je vais te fournir 4 éléments en FRANÇAIS (Titre, Localisation, Description, Équipements).
            Tu DOIS traduire CHACUN de ces 4 éléments en ANGLAIS et en ARABE.
            
            Règles strictes :
            - Anglais : Fluide, naturel, vocabulaire immobilier.
            - Arabe : Arabe standard moderne, vendeur, adapté au marché marocain.
            - Les équipements doivent être traduits un par un et séparés par des virgules (ex: "Wifi, Pool" et "واي فاي، مسبح").
            
            Tu dois répondre UNIQUEMENT par un objet JSON pur. Ne dis rien d'autre.`
          },
          { 
            role: "user", 
            content: `Voici les données en français à traduire impérativement dans les deux langues :
            
Titre: ${title}
Localisation: ${location}
Description: ${description}
Équipements: ${amenities}

Génère EXACTEMENT ce JSON avec les traductions : 
{
  "title_en": "...", 
  "description_en": "...", 
  "location_en": "...", 
  "amenities_en": "...", 
  "title_ar": "...", 
  "description_ar": "...", 
  "location_ar": "...", 
  "amenities_ar": "..."
}` 
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" } 
      })
    })

    const data = await response.json()
    const rawContent = data.choices[0].message.content

    // Nettoyeur magique
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