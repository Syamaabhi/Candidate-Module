function Input({ label, type = 'text', value, onChange, placeholder, required = false, error, name, options }) {
  if (type === 'select') {
     return (
        <div className="mb-4">
          {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${error ? 'border-red-300' : ''}`}
          >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
           {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
     );
  }

  if (type === 'textarea') {
      return (
        <div className="mb-4">
          {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
          <textarea
            name={name}
            rows={4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${error ? 'border-red-300' : ''}`}
          />
           {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
  }

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${error ? 'border-red-300 pr-10' : ''} px-3 py-2 border`}
          placeholder={placeholder}
          required={required}
        />
        {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="icon-circle-alert text-red-500"></div>
            </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}