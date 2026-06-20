import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { subject, topics, examDate } = await req.json();

    const prompt = `You are an AI study planner. Create a daily structured study timeline leading up to the exam date: ${examDate}.
    Subject: ${subject}
    Topics: ${topics}
    
    Respond ONLY with a valid JSON array matching this exact template format:
    [
      {"day": "Day 1", "tasks": ["Task detail 1", "Task detail 2"]}
    ]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY?.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    let rawText = data.choices[0].message.content.trim();
    
    // Robust cleaning logic to extract JSON safely
    const startIndex = rawText.indexOf("[");
    const endIndex = rawText.lastIndexOf("]") + 1;
    
    if (startIndex === -1 || endIndex === 0) {
      throw new Error("AI response did not contain a valid structured array layout.");
    }
    
    const schedule = JSON.parse(rawText.substring(startIndex, endIndex));

    const { error: dbError } = await supabase.from("study_plans").insert([
      { subject, topics, exam_date: examDate, schedule }
    ]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server Execution Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}