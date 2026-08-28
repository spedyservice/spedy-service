import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

const WhatsAppButton = () => {
  const phoneNumber = '+919609337633'
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-2xl hover:bg-green-600 transition-colors duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform duration-200" />
      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full" />
    </motion.a>
  )
}

export default WhatsAppButton