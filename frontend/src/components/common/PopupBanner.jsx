import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import popupBannerService from '../../services/popupBannerService';

const PopupBanner = () => {
  const [banner, setBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to add Cloudinary optimization parameters
  const optimizeImageUrl = (url) => {
    if (!url) return url;
    // If it's a Cloudinary URL, append q_auto,f_auto
    if (url.includes('cloudinary.com')) {
      // Check if already has query params
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}q_auto,f_auto`;
    }
    return url;
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await popupBannerService.getActiveBanner();
        if (response.success && response.data) {
          const bannerData = response.data;
          // Optimize image URL
          if (bannerData.imageUrl) {
            bannerData.optimizedImageUrl = optimizeImageUrl(bannerData.imageUrl);
          }
          setBanner(bannerData);
          
          // Check if banner already shown in this session
          const hasSeen = sessionStorage.getItem('popupBannerSeen');
          if (!hasSeen) {
            // Preload the image in background to speed up display
            if (bannerData.optimizedImageUrl) {
              const img = new Image();
              img.onload = () => {
                // Image is preloaded; open popup now
                setIsOpen(true);
                sessionStorage.setItem('popupBannerSeen', 'true');
                setImageLoading(false);
              };
              img.onerror = () => {
                // Even if image fails, open popup without image
                setIsOpen(true);
                sessionStorage.setItem('popupBannerSeen', 'true');
                setImageLoading(false);
              };
              img.src = bannerData.optimizedImageUrl;
            } else {
              // No image, open popup immediately
              setIsOpen(true);
              sessionStorage.setItem('popupBannerSeen', 'true');
              setImageLoading(false);
            }
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

        {/* Banner image with loading spinner */}
        <div className="relative bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          )}
          {banner.optimizedImageUrl && (
            <img
              src={banner.optimizedImageUrl}
              alt={banner.title || 'Special Offer'}
              className={`w-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </div>

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