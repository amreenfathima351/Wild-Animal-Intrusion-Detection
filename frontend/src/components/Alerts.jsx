import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://localhost:5000/get_alerts")
        .then((res) => res.json())
        .then((data) => setAlerts(data))
        .catch((err) => console.error("Error fetching alerts:", err));
    };

    fetchAlerts(); // initial fetch
    const interval = setInterval(fetchAlerts, 2200); // fetch every 2s

    return () => clearInterval(interval); // cleanup
  }, []);

  // Get the latest alert (if any)
  const latestAlert = alerts.length > 0 ? alerts[alerts.length - 1] : null;

  // Determine styling based on danger level
  const getAlertStyles = (dangerLevel) => {
    switch (dangerLevel) {
      case "most_dangerous":
        return "bg-red-100 border-red-500";
      case "less_dangerous":
        return "bg-yellow-100 border-orange-500";
      default:
        return "bg-blue-100 border-blue-500";
    }
  };

  return (
    <div
      className={`my-5 p-4 mt-10 border rounded-lg max-w-xl mx-auto text-left ${
        latestAlert
          ? getAlertStyles(latestAlert.danger_level)
          : "bg-blue-100 border-blue-500"
      }`}
    >
      <h2 className="text-xl font-semibold mb-2">Detection Data</h2>
      {!latestAlert || latestAlert.danger_level === "none" ? (
        <p>No harmful Intrusion</p>
      ) : (
        <p className="text-lg">
          {latestAlert.danger_level === "most_dangerous" ? "⚠ " : ""}
          {latestAlert.msg}
        </p>
      )}
    </div>
  );
}
