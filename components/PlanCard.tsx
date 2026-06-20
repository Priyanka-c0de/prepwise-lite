 interface Plan {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  schedule: { day: string; tasks: string[] }[];
}

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4 text-black text-left">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-xl font-bold text-indigo-700">{plan.subject}</h3>
        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
          Exam: {new Date(plan.exam_date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4"><strong>Topics covered:</strong> {plan.topics}</p>
      
      <div className="space-y-3">
        {plan.schedule.map((item, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
            <h4 className="font-bold text-sm text-gray-700">{item.day}</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
              {item.tasks.map((task, tIdx) => <li key={tIdx}>{task}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
