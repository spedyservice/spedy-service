import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapSection = () => {
  // Same embed URL as your contact page – shows the exact location
  const mapSrc = "https://maps.google.com/maps?q=Bardhaman+Main+Road+Kalna+Boher+West+Bengal+713422&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="container-custom px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Our Location
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Visit our service centre – we're here to help you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <iframe
            src={mapSrc}
            width="100%"
            height="350"
            style={{ border: 0, minHeight: '320px' }}
            allowFullScreen=""
            loading="lazy"
            title="Spedy Service Location"
            className="w-full"
          ></iframe>
          <div className="p-4 flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100">
            <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
            <span>Bardhaman Main Road, Kalna, Boher, West Bengal 713422</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;