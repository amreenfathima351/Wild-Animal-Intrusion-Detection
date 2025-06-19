function Header({ darkMode, setDarkMode }) {
  return (
    <header className="relative py-4 mb-6 border-b border-gray-300 dark:border-gray-700">
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        🐾 Wild Animal Intrusion Detection
      </h1>
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        <i className="fa-solid fa-location-dot text-red-500"> </i>
        <span> Sector A</span>
      </h1>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle Dark Mode"
        className="absolute right-4 top-4 p-2 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {darkMode ? (
          // Sun icon for light mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-4.95l-.707.707M6.343 17.657l-.707.707m12.02 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        ) : (
          // Moon icon for dark mode with stroke black, fill none
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="black"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}

export default Header;
