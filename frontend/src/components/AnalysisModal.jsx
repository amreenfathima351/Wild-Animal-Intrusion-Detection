import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";

function AnalysisModal({
  analysisData,
  selectedDate,
  setSelectedDate,
  onClose,
  fetchAnalysisData,
}) {
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
    fetchAnalysisData();
  };

  const handleOverall = () => {
    setSelectedDate(null);
    fetchAnalysisData();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-3xl z-50">
        <h2 className="text-2xl font-bold mb-6 dark:text-gray-100 text-center">
          Animal Detection Analysis
        </h2>
        <div className="mb-6 flex justify-center gap-4">
          <input
            type="date"
            value={selectedDate || ""}
            onChange={handleDateChange}
            max={format(new Date(), "yyyy-MM-dd")}
            className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today
          </button>
          <button
            onClick={handleOverall}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Overall
          </button>
        </div>
        <div></div>
        <div className="flex justify-center">
          {analysisData.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No valid data available. Check console for API errors or verify
              database.
            </p>
          ) : (
            <BarChart
              width={600}
              height={400}
              data={analysisData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="animal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisModal;
