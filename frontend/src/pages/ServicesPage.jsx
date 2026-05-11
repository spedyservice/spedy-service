import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaArrowRight } from 'react-icons/fa'
import serviceService from '../services/serviceService'
import ServiceCard from '../components/common/ServiceCard'

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices({ isActive: true })
        if (response.success && response.data.length > 0) {
          setServices(response.data)
          setFilteredServices(response.data)
        } else {
          const fallbackServices = [
            { _id: '1', name: 'Washing Machine',      description: 'Expert washing machine repair service at your doorstep' },
            { _id: '2', name: 'Microwave Oven',        description: 'Quick microwave oven repair with genuine parts' },
            { _id: '3', name: 'LED/LCD TV',            description: 'Professional TV repair service for all brands' },
            { _id: '4', name: 'Refrigerator',          description: 'Refrigerator repair and maintenance service' },
            { _id: '5', name: 'Air Conditioner (AC)',  description: 'AC repair, service and gas refill' },
            { _id: '6', name: 'Water Purifier',        description: 'Water purifier service and filter change' },
            { _id: '7', name: 'Mixer Grinder',         description: 'Mixer grinder repair and maintenance' },
            { _id: '8', name: 'Induction Cooktop',     description: 'Induction cooktop repair service' },
            { _id: '9', name: 'Chimney',               description: 'Chimney cleaning and repair service' },
            { _id: '10', name: 'Cooler',               description: 'Cooler repair and service' },
          ]
          setServices(fallbackServices)
          setFilteredServices(fallbackServices)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        const fallbackServices = [
          { _id: '1', name: 'Washing Machine',      description: 'Expert washing machine repair service at your doorstep' },
          { _id: '2', name: 'Microwave Oven',        description: 'Quick microwave oven repair with genuine parts' },
          { _id: '3', name: 'LED/LCD TV',            description: 'Professional TV repair service for all brands' },
          { _id: '4', name: 'Refrigerator',          description: 'Refrigerator repair and maintenance service' },
          { _id: '5', name: 'Air Conditioner (AC)',  description: 'AC repair, service and gas refill' },
          { _id: '6', name: 'Water Purifier',        description: 'Water purifier service and filter change' },
        ]
        setServices(fallbackServices)
        setFilteredServices(fallbackServices)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(services)
    } else {
      setFilteredServices(
        services.filter(service =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, services])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header – compact */}
      <div className="bg-white border-b border-gray-100 py-8 md:py-10">
        <div className="container-custom text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Our Repair Services
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Professional repair services for all your home appliances. Expert technicians,
            genuine parts, and warranty on every service.
          </p>
        </div>
      </div>

      {/* Services Content */}
      <div className="container-custom py-8 md:py-10">

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Services Grid – now 2 columns on mobile */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-400 text-xl" />
            </div>
            <p className="text-gray-500 font-medium">No services found matching "<span className="text-gray-700">{searchTerm}</span>"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service._id || index} service={service} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default ServicesPage