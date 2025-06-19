import { Download } from "lucide-react";

function UtilButtons({ darkMode, onViewAnalysis }) {
  return (
    <div className="mt-6 flex flex-row justify-center gap-4 px-4">
      <a
        href="http://localhost:5000/download_alerts"
        download
        className={`flex items-center px-4 py-2 ${
          darkMode
            ? "bg-blue-700 hover:bg-blue-800"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <Download className="mr-2 h-5 w-5" />
        Download CSV
      </a>
      <button
        onClick={onViewAnalysis}
        className={`flex items-center px-4 py-2 ${
          darkMode
            ? "bg-green-700 hover:bg-green-800"
            : "bg-green-600 hover:bg-green-700"
        } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
      >
        View Analysis
      </button>
    </div>
  );
}

export default UtilButtons;
