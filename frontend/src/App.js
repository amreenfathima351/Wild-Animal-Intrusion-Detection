import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";
import Alerts from "./components/Alerts";
import LocationDisplay from "./components/LocationDisplay";
import MapDisplay from "./components/MapDisplay";
import AnalysisModal from "./components/AnalysisModal";
import UtilButtons from "./components/UtilButtons";

function App() {
  const [location, setLocation] = useState(null);
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);
  const [videoSrc] = useState("http://localhost:5000/video_feed");
  const [darkMode, setDarkMode] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const intervalRef = useRef(null);

  // Fetch geolocation
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation({ lat, lon });
            setError("");

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                { headers: { "Accept-Language": "en" } }
              );
              const data = await response.json();

              if (data.display_name) {
                setArea(data.display_name);
              } else if (data.address) {
                const addr = data.address;
                setArea(
                  addr.city ||
                    addr.town ||
                    addr.suburb ||
                    addr.state ||
                    "Area not found"
                );
              } else {
                setArea("Area not found");
              }
            } catch {
              setArea("Failed to get area name");
            }
          },
          () => {
            setError("❌ Location access denied or unavailable.");
            setLocation(null);
            setArea("");
          }
        );
      } else {
        setError("❌ Geolocation is not supported by this browser.");
        setLocation(null);
        setArea("");
      }
    };

    getLocation();
  }, []);

  // Fetch alerts every 5 seconds
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_alerts");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setAlerts(data);
      } catch (e) {
        console.error("Failed to fetch alerts", e);
      }
    };

    fetchAlerts();
    intervalRef.current = setInterval(fetchAlerts, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Fetch analysis data
  const fetchAnalysisData = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_animal_counts");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log("Raw analysis data:", data);

      const animalAlerts = data.filter(
        (item) =>
          item.animal && item.animal !== "unknown" && item.animal.trim() !== ""
      );

      const filteredAlerts = selectedDate
        ? animalAlerts.filter((item) => item.date === selectedDate)
        : animalAlerts;

      const animalCounts = filteredAlerts.reduce((acc, item) => {
        acc[item.animal] = (acc[item.animal] || 0) + 1;
        return acc;
      }, {});

      const analysisData = Object.entries(animalCounts).map(
        ([animal, count]) => ({
          animal,
          count,
        })
      );

      setAnalysisData(analysisData);
      console.log("Parsed analysis data:", analysisData);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setAnalysisData([]);
    }
  };

  // Fetch analysis data when modal opens or date changes
  useEffect(() => {
    if (showAnalysis) {
      fetchAnalysisData();
    }
  }, [showAnalysis, selectedDate]);

  const bgClass = darkMode ? "bg-gray-900" : "bg-gray-100";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-white";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div className={`${bgClass} font-sans text-center min-h-screen p-4`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          className={`border rounded-xl shadow-md ${cardBgClass} p-2 ${borderClass}`}
        >
          <VideoFeed src={videoSrc} darkMode={darkMode} />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div
            className={`border rounded-xl shadow-md ${cardBgClass} p-4 ${borderClass}`}
          >
            {/* <LocationDisplay area={area} error={error} darkMode={darkMode} /> */}

            <MapDisplay location={location} darkMode={darkMode} area={area}/>
          </div>
          <div
            className={`border rounded-xl shadow-md ${cardBgClass} p-4 flex-grow ${borderClass}`}
          >
            <Alerts alerts={alerts} darkMode={darkMode} />
            <UtilButtons
              darkMode={darkMode}
              onViewAnalysis={() => setShowAnalysis(true)}
            />
          </div>
        </div>
      </div>

      {showAnalysis && (
        <AnalysisModal
          analysisData={analysisData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onClose={() => setShowAnalysis(false)}
          fetchAnalysisData={fetchAnalysisData}
        />
      )}
    </div>
  );
}

export default App;
