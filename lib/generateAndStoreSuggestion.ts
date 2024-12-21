import { SupabaseClient } from "@supabase/supabase-js";
import { openai } from "../app/api/openaiConfig/config";

export async function generateAndStoreSuggestions(
  supabase: SupabaseClient,
  exchangeId: string,
  giverId: string,
  recipientId: string,
  budget: number
) {
  // Get recipient's profile
  const { data: recipientProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", recipientId)
    .single();

  if (profileError || !recipientProfile) {
    throw new Error("Failed to fetch recipient profile");
  }

  const prompt = `Take on the role of a Secret Santa. Generate 3 personalized gift suggestions based on this profile information that I will provide you with: 
    
    Gift Budget: $${budget}
    
    Recipient's Profile:
    - Age Group: ${recipientProfile.age_group || "Not specified"}
    - Hobbies: ${recipientProfile.hobbies || "Not specified"}
    - Things to Avoid: ${recipientProfile.avoid || "None specified"}
    - Categories of Interest: ${
      recipientProfile.categories?.join(", ") || "Not specified"
    }
    
    Preference Scales (0-100):
    - Practical vs Whimsical: ${recipientProfile.practical_whimsical}
    - Cozy vs Adventurous: ${recipientProfile.cozy_adventurous}
    - Minimal vs Luxurious: ${recipientProfile.minimal_luxurious}
  
    For each suggestion, provide:
    1. A title
    2. An estimated price within budget
    3. A brief description
    4. 2-3 specific reasons why this matches the recipient's preferences
    5. A match score (0-100) based on how well it fits their preferences
    
    Format as JSON array with fields: title, price, description, matchReasons (array), matchScore (number)`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content || "";
  const suggestions = response.split("\n").filter((s) => s.trim());

  // Store each suggestion
  for (const suggestion of suggestions) {
    const { error: suggestionError } = await supabase
      .from("gift_suggestions")
      .insert({
        gift_exchange_id: exchangeId,
        giver_id: giverId,
        recipient_id: recipientId,
        suggestion: JSON.stringify(suggestion), // Store the entire suggestion object
      });

    if (suggestionError) {
      console.error("Failed to store suggestion:", suggestionError);
    }
  }

  return { success: true };
}
