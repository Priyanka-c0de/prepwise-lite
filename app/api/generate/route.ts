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
    
    Respond STRICTLY with a valid JSON array matching this exact format, with no markdown code blocks or wrapper text:
    [
      {"day": "Day 1", "tasks": ["Task detail 1", "Task detail 2"]}
    ]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    
    // Clean string formatting to extract raw arrays securely
    const startIndex = rawText.indexOf("[");
    const endIndex = rawText.lastIndexOf("]") + 1;
    const schedule = JSON.parse(rawText.substring(startIndex, endIndex));

    const { error } = await supabase.from("study_plans").insert([
      { subject, topics, exam_date: examDate, schedule }
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
