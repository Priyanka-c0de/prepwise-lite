import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  // Capture inputs inside block scoped variables so they can be accessed anywhere
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const subject = body.subject || "Data Structures";
  const topics = body.topics || "General Study Layout";
  const examDate = body.examDate || "2026-06-25";

  try {
    const prompt = `You are an AI study planner. Create a daily structured study timeline leading up to the exam date: ${examDate}.
    Subject: ${subject}
    Topics: ${topics}
    
    Respond ONLY with a valid JSON array matching this exact template format:
    [
      {"day": "Day 1", "tasks": ["Task detail 1", "Task detail 2"]}
    ]`;

    let schedule;

    try {
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

      if (data && data.choices && data.choices[0]?.message?.content) {
        let rawText = data.choices[0].message.content.trim();
        const startIndex = rawText.indexOf("[");
        const endIndex = rawText.lastIndexOf("]") + 1;
        if (startIndex !== -1 && endIndex !== 0) {
          schedule = JSON.parse(rawText.substring(startIndex, endIndex));
        }
      }
    } catch (aiError) {
      console.error("AI Generation issue encountered, reverting to layout fallback:", aiError);
    }

    // FALLBACK MECHANISM: If AI returns an unexpected structure or breaks, generate a mock outline instantly
    if (!schedule || !Array.isArray(schedule)) {
      schedule = [
        { "day": "Day 1: Initial Core Review", "tasks": [`Deep-dive conceptual review of core components in ${topics}`, "Organize core reference material documents"] },
        { "day": "Day 2: Target Focus Application", "tasks": [`Complete functional code iterations regarding ${subject}`, "Debug structural block logic scenarios"] },
        { "day": "Day 3: Simulation & Wrap-up", "tasks": ["Run comprehensive exam style mock challenges", "Finalize summary notes before final review target"] }
      ];
    }

    // Save configuration directly to Supabase
    const { error: dbError } = await supabase.from("study_plans").insert([
      { subject, topics, exam_date: examDate, schedule }
    ]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Critical execution catch block:", error);
    return NextResponse.json({ error: error.message || "Execution error encountered" }, { status: 500 });
  }
}