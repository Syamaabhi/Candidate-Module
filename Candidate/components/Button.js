function Button({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button', icon }) {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const variants = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className={`${icon} mr-2 text-lg`}></div>}
      {children}
    </button>
  );
}