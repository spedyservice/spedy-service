import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaTshirt, FaMicrophoneAlt, FaTv, FaSnowflake,
  FaWind, FaTint, FaUtensils, FaFire, FaFan, FaWrench,
  FaBolt, FaThermometerHalf
} from 'react-icons/fa'

const iconMap = {
  'Washing Machine':         { Icon: FaTshirt,          bg: 'bg-blue-50',       color: 'text-blue-600' },
  'Microwave Oven':          { Icon: FaMicrophoneAlt,   bg: 'bg-orange-50',     color: 'text-orange-500' },
  'LED/LCD TV':              { Icon: FaTv,              bg: 'bg-purple-50',     color: 'text-purple-600' },
  'Smart TV':                { Icon: FaTv,              bg: 'bg-purple-50',     color: 'text-purple-600' },
  'Refrigerator':            { Icon: FaSnowflake,       bg: 'bg-cyan-50',       color: 'text-cyan-600' },
  'Air Conditioner (AC)':    { Icon: FaWind,            bg: 'bg-sky-50',        color: 'text-sky-600' },
  'Water Purifier':          { Icon: FaTint,            bg: 'bg-teal-50',       color: 'text-teal-600' },
  'Mixer Grinder':           { Icon: FaUtensils,        bg: 'bg-yellow-50',     color: 'text-yellow-600' },
  'Induction Cooktop':       { Icon: FaFire,            bg: 'bg-red-50',        color: 'text-red-500' },
  'Chimney':                 { Icon: FaFan,             bg: 'bg-gray-100',      color: 'text-gray-600' },
  'Cooler':                  { Icon: FaWind,            bg: 'bg-blue-50',       color: 'text-blue-500' },
  'Geyser':                  { Icon: FaThermometerHalf, bg: 'bg-red-50',        color: 'text-red-500' },
  'Oven':                    { Icon: FaFire,            bg: 'bg-orange-50',     color: 'text-orange-500' },
  'Home Theatre / Soundbar': { Icon: FaBolt,            bg: 'bg-indigo-50',     color: 'text-indigo-600' },
}

const ServiceCard = ({ service }) => {
  const config = iconMap[service.name] || {
    Icon: FaWrench,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  }
  const { Icon, bg, color } = config

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden flex flex-col h-full border border-gray-100"
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
    >
      {/* Image / fallback icon */}
      <div className="h-36 sm:h-44 overflow-hidden bg-gray-100">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${bg}`}>
            <Icon className={`text-3xl sm:text-4xl ${color}`} />
          </div>
        )}
      </div>

      {/* Text & Book Now button */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
          {service.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
          {service.description || `Professional ${service.name.toLowerCase()} repair service.`}
        </p>

        <Link
          to="/book-now"
          className="block w-full bg-blue-600 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-lg text-center hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm mt-auto"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}

export default ServiceCard