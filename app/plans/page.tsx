 "use client";
import { useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase.from("study_plans").select("*").order("created_at", { ascending: false });
      if (data) setPlans(data as any);
    }
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Saved Plans</h1>
          <Link href="/" className="text-indigo-600 hover:underline font-semibold">← Create New Plan</Link>
        </div>
        {plans.length === 0 ? (
          <p className="text-gray-500 italic">No generated schedules saved.</p>
        ) : (
          plans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </div>
    </div>
  );
}
