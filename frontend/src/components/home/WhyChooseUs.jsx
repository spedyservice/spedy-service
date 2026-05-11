import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import chooseUsImg from '../../assets/whychooseusimage.jpg';
import chooseUsMobileImg from '../../assets/whychooseusmobile.jpg';

/*
  ⚠️ Make sure the Centrale Sans font (weight 700) is loaded in your project.
  Add this to your index.html or global CSS:
  <link href="https://fonts.googleapis.com/css2?family=Centrale+Sans:wght@700&display=swap" rel="stylesheet">
  (If not available, use your local @font-face declaration)
*/

const advantages = [
  'Genuine Products & Spare Parts',
  'Certified Repair Technicians',
  'Free Inspection & Diagnosis',
  'Same-Day Service Available',
  '30-Day Service Warranty',
  'Free Delivery on Orders Above ₹1000',
  'No Advance Payment Required',
];

const WhyChooseUs = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const bgImage = isMobile ? chooseUsMobileImg : chooseUsImg;

  return (
    <section className="pt-0 pb-12 sm:pb-16 bg-gray-50">
      <div
        className="relative w-full overflow-hidden shadow-2xl rounded-2xl sm:rounded-3xl"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Luxurious dark overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50 backdrop-blur-[2px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col justify-center h-full px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-white"
        >
          {/* Tiny pill badge */}
          <span
            className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[4px] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 self-start border border-white/20"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
          >
            Why Choose Us
          </span>

          {/* Main heading – Centrale Sans 700 */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
          >
            Our Advantages
          </h2>

          {/* Description – HIDDEN on mobile, visible on sm+ */}
          <div className="hidden sm:block">
            <p className="text-sm sm:text-lg text-white/80 max-w-xl mb-6">
              With over 10 years of experience, we provide reliable appliance repairs and sell genuine products with warranty and free delivery.
            </p>
          </div>

          {/* Advantages list */}
          <ul className="space-y-3 sm:space-y-4">
            {advantages.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <FaCheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5 drop-shadow-md" />
                <span
                  className="font-semibold text-sm sm:text-lg text-white/90"
                  style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyChooseUs