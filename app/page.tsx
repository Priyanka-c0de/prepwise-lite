"use client";
import { useEffect, useState } from "react";
import StudyForm from "@/components/StudyForm";
import PlanCard from "@/components/PlanCard";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase
        .from("study_plans")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPlans(data as any);
    }
    fetchPlans();
  }, [refresh]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-950 mb-2">PrepWise AI</h1>
          <p className="text-gray-600">Smart, AI-powered study schedules explicitly tailored for your exams.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Planner</h2>
            <StudyForm onPlanGenerated={() => setRefresh(prev => prev + 1)} />
            <Link href="/plans" className="block text-center mt-4 text-indigo-600 font-semibold hover:underline">
              View All Plans Fullscreen →
            </Link>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Active Schedules</h2>
            {plans.length === 0 ? (
              <p className="text-gray-500 italic">No schedules created yet. Fill out the planner form to create your first outline.</p>
            ) : (
              plans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)
            )}
          </div>
        </div>
      </div>
    </main>
  );
}