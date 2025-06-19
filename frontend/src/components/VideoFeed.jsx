function VideoFeed({ src, darkMode }) {
  return (
    <div className="w-full h-auto">
      <div
        className={`text-left text-lg font-semibold mb-2 ${
          darkMode ? "text-white" : "text-gray-700"
        }`}
      >
        🎥 Live Animal Feed
      </div>
      <div
        className={`border-4 rounded-xl shadow-xl overflow-hidden ${
          darkMode ? "border-white" : "border-gray-500"
        }`}
      >
        <img
          src={src}
          alt="Live Video Feed"
          className="w-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default VideoFeed;
