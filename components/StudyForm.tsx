 "use client";
import { useState } from "react";

interface StudyFormProps {
  onPlanGenerated: () => void;
}

export default function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, examDate }),
      });

      if (response.ok) {
        setSubject("");
        setTopics("");
        setExamDate("");
        onPlanGenerated();
      } else {
        alert("Failed to generate plan");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 text-black border border-gray-200">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
        <input 
          type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Data Structures"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Topics</label>
        <textarea 
          required value={topics} onChange={(e) => setTopics(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Trees, Graphs, Sorting algorithms"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Date</label>
        <input 
          type="date" required value={examDate} onChange={(e) => setExamDate(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <button 
        type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
      >
        {loading ? "Generating Schedule with AI..." : "Generate Study Plan"}
      </button>
    </form>
  );
}
