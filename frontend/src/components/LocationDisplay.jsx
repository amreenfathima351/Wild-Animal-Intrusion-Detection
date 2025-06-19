export default function LocationDisplay({ area, error, location }) {
  return (
    <div className="mt-3 px-4 mb-5">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-sm text-sm sm:text-base">
          ❌ {error}
        </div>
      ) : area ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-sm text-sm sm:text-base">
          📍 <strong>Location:</strong> {area}
          {location && (
            <div className="mt-1 text-sm text-gray-600">
              🌐 <strong>Coordinates:</strong> {location.lat.toFixed(5)}° N,{" "}
              {location.lon.toFixed(5)}° E
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
