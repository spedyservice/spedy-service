import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import popupBannerService from '../../services/popupBannerService';

const PopupBanner = () => {
  const [banner, setBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await popupBannerService.getActiveBanner();
        if (response.success && response.data) {
          setBanner(response.data);
          // Check if the banner was already shown in this session
          const hasSeen = sessionStorage.getItem('popupBannerSeen');
          if (!hasSeen) {
            setIsOpen(true);
            sessionStorage.setItem('popupBannerSeen', 'true');
          }
        }
      } catch (error) {
        console.error('Error fetching popup banner:', error);
      }
    };
    fetchBanner();
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleBookNow = () => {
    navigate(banner.buttonLink || '/book-now');
    setIsOpen(false);
  };

  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1"
        >
          <FaTimes size={20} />
        </button>

        {/* Banner image */}
        {banner.imageUrl && (
          <img
            src={banner.imageUrl}
            alt={banner.title || 'Special Offer'}
            className="w-full object-cover"
          />
        )}

        {/* Text content */}
        <div className="p-5 text-center">
          {banner.title && <h3 className="text-xl font-bold text-gray-800">{banner.title}</h3>}
          {banner.subtitle && <p className="text-sm text-gray-600 mt-1">{banner.subtitle}</p>}
          {banner.description && <p className="text-sm text-gray-500 mt-2">{banner.description}</p>}
          <button
            onClick={handleBookNow}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {banner.buttonText || 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBanner;