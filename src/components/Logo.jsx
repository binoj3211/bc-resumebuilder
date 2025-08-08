import React from 'react'

const Logo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: {
      container: "w-8 h-8",
      spacing: "space-x-2"
    },
    default: {
      container: "w-10 h-10",
      spacing: "space-x-3"
    },
    large: {
      container: "w-14 h-14",
      spacing: "space-x-4"
    }
  }

  const sizeClasses = sizes[size] || sizes.default

  return (
    <div className={`flex items-center ${sizeClasses.spacing} ${className}`}>
      {/* Clean, Professional Logo Icon */}
      <div className={`${sizeClasses.container} bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
        <span className={`text-white font-black ${size === 'large' ? 'text-2xl' : size === 'default' ? 'text-lg' : 'text-sm'} tracking-tight`}>
          BC
        </span>
      </div>
      
      {/* Professional Text */}
      <div className="flex items-center">
        <span className={`font-bold text-white ${size === 'large' ? 'text-3xl' : size === 'default' ? 'text-xl' : 'text-lg'}`}>
          Resume
        </span>
        <span className={`font-bold text-blue-400 ${size === 'large' ? 'text-3xl' : size === 'default' ? 'text-xl' : 'text-lg'}`}>
          Builder
        </span>
      </div>
    </div>
  )
}

export default Logo
