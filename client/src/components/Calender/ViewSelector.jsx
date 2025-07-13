
const ViewSelector = ({ VIEW_OPTIONS, viewMode, handleViewChange }) => (
  <div className="hidden sm:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
    {VIEW_OPTIONS.map(option => (
      <button key={option.value} onClick={() => handleViewChange(option.value)}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
          viewMode === option.value
            ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        }`}>
        {option.icon}
        <span className="ml-2">{option.label}</span>
      </button>
    ))}
  </div>
);

export default ViewSelector;