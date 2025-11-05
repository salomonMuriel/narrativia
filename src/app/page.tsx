'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Animation variants
const customEasing = [0.16, 1, 0.3, 1] as const;

const heroHeadlineVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: customEasing,
      staggerChildren: 0.1,
    },
  },
};

const heroSubheadlineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.4,
      ease: customEasing,
    },
  },
};

const formCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.6,
      ease: customEasing,
    },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: customEasing,
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: customEasing,
    },
  },
};

// Animated section wrapper with intersection observer
const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUpVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', edad: '', ciudad: '', barrio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // No timeout specified - will wait indefinitely for the response
      // The backend has a 5-minute maxDuration configured
      const response = await fetch('/api/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          age: parseInt(formData.edad),
          city: formData.ciudad,
          neighborhood: formData.barrio,
        }),
        // Important: No signal/timeout configured to allow long-running AI operations
      });

      const data = await response.json();

      if (data.success) {
        // Store the narrative data in sessionStorage for the /narrativa page
        sessionStorage.setItem('narrativeData', JSON.stringify(data));

        // Redirect to the narrative page
        window.location.href = '/narrativa';
      } else {
        setMessage(data.message || 'Hubo un error. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16 sm:pt-0">
        <Image
          src="/hero.png"
          alt="Colombia es Buena"
          fill
          priority
          className="object-cover object-[center_top]"
          quality={100}
        />
        {/* Enhanced gradient overlay with better depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/30 via-transparent to-transparent"></div>
        {/* Additional gradient for left side on desktop to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden lg:block"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="flex justify-center lg:justify-start lg:pl-12 xl:pl-16">
            <div className="max-w-md text-center lg:text-left px-4 sm:px-6 lg:px-0">
              {/* Animated Headline */}
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={heroHeadlineVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
                style={{
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.6), 0 2px 10px rgba(0, 0, 0, 0.4)',
                }}
              >
                Colombia es Buena
              </motion.h1>

              {/* Animated Subheadline */}
              <motion.p
                initial="hidden"
                animate="visible"
                variants={heroSubheadlineVariants}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-8 leading-tight"
                style={{
                  textShadow: '0 2px 20px rgba(251, 191, 36, 0.4), 0 4px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                Vale la pena cuidarla
              </motion.p>

              {/* Animated Form Card */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={formCardVariants}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: customEasing } }}
                className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 10px 25px -5px rgba(251, 191, 36, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                }}
              >
            <h2 className="text-xl sm:text-2xl font-bold text-warm-gray-900 mb-2">
              Únete al movimiento
            </h2>

            <motion.div>
                  <p className="text-sm sm:text-base text-warm-gray-600 mb-4">
                    Recibe tu narrativa y sé parte del cambio
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Nombre Input */}
                    <div className="relative">
                      <label
                        htmlFor="nombre"
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          focusedField === 'nombre' || formData.nombre
                            ? '-top-2.5 text-xs bg-white px-1 text-colombia-yellow-600 font-medium'
                            : 'top-3.5 text-sm text-warm-gray-600'
                        }`}
                      >
                        Nombre
                      </label>
                      <motion.input
                        type="text"
                        id="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        onFocus={() => setFocusedField('nombre')}
                        onBlur={() => setFocusedField(null)}
                        whileFocus={{ y: -2 }}
                        className={`w-full px-3 py-2.5 border-2 rounded-xl outline-none transition-all duration-200 text-warm-gray-900 text-sm focus-visible:outline-none ${
                          focusedField === 'nombre'
                            ? 'border-colombia-yellow-400 ring-4 ring-colombia-yellow-400/20 shadow-md'
                            : formData.nombre
                            ? 'border-colombia-yellow-100 bg-colombia-yellow-50/50'
                            : 'border-warm-gray-200 shadow-sm hover:border-warm-gray-300 hover:shadow'
                        }`}
                        placeholder={focusedField === 'nombre' ? 'Tu nombre completo' : ''}
                      />
                    </div>

                    {/* WhatsApp Input */}
                    <div className="relative">
                      <label
                        htmlFor="whatsapp"
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          focusedField === 'whatsapp' || formData.whatsapp
                            ? '-top-2.5 text-xs bg-white px-1 text-colombia-yellow-600 font-medium'
                            : 'top-3.5 text-sm text-warm-gray-600'
                        }`}
                      >
                        WhatsApp
                      </label>
                      <motion.input
                        type="tel"
                        id="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        onFocus={() => setFocusedField('whatsapp')}
                        onBlur={() => setFocusedField(null)}
                        whileFocus={{ y: -2 }}
                        className={`w-full px-3 py-2.5 border-2 rounded-xl outline-none transition-all duration-200 text-warm-gray-900 text-sm focus-visible:outline-none ${
                          focusedField === 'whatsapp'
                            ? 'border-colombia-yellow-400 ring-4 ring-colombia-yellow-400/20 shadow-md'
                            : formData.whatsapp
                            ? 'border-colombia-yellow-100 bg-colombia-yellow-50/50'
                            : 'border-warm-gray-200 shadow-sm hover:border-warm-gray-300 hover:shadow'
                        }`}
                        placeholder={focusedField === 'whatsapp' ? '3001234567' : ''}
                      />
                    </div>

                    {/* Edad Input */}
                    <div className="relative">
                      <label
                        htmlFor="edad"
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          focusedField === 'edad' || formData.edad
                            ? '-top-2.5 text-xs bg-white px-1 text-colombia-yellow-600 font-medium'
                            : 'top-3.5 text-sm text-warm-gray-600'
                        }`}
                      >
                        Edad
                      </label>
                      <motion.input
                        type="number"
                        id="edad"
                        required
                        min="1"
                        max="120"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        onFocus={() => setFocusedField('edad')}
                        onBlur={() => setFocusedField(null)}
                        whileFocus={{ y: -2 }}
                        className={`w-full px-3 py-2.5 border-2 rounded-xl outline-none transition-all duration-200 text-warm-gray-900 text-sm focus-visible:outline-none ${
                          focusedField === 'edad'
                            ? 'border-colombia-yellow-400 ring-4 ring-colombia-yellow-400/20 shadow-md'
                            : formData.edad
                            ? 'border-colombia-yellow-100 bg-colombia-yellow-50/50'
                            : 'border-warm-gray-200 shadow-sm hover:border-warm-gray-300 hover:shadow'
                        }`}
                        placeholder={focusedField === 'edad' ? 'Ej: 28' : ''}
                      />
                    </div>

                    {/* Ciudad Input */}
                    <div className="relative">
                      <label
                        htmlFor="ciudad"
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          focusedField === 'ciudad' || formData.ciudad
                            ? '-top-2.5 text-xs bg-white px-1 text-colombia-yellow-600 font-medium'
                            : 'top-3.5 text-sm text-warm-gray-600'
                        }`}
                      >
                        Ciudad
                      </label>
                      <motion.input
                        type="text"
                        id="ciudad"
                        required
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        onFocus={() => setFocusedField('ciudad')}
                        onBlur={() => setFocusedField(null)}
                        whileFocus={{ y: -2 }}
                        className={`w-full px-3 py-2.5 border-2 rounded-xl outline-none transition-all duration-200 text-warm-gray-900 text-sm focus-visible:outline-none ${
                          focusedField === 'ciudad'
                            ? 'border-colombia-yellow-400 ring-4 ring-colombia-yellow-400/20 shadow-md'
                            : formData.ciudad
                            ? 'border-colombia-yellow-100 bg-colombia-yellow-50/50'
                            : 'border-warm-gray-200 shadow-sm hover:border-warm-gray-300 hover:shadow'
                        }`}
                        placeholder={focusedField === 'ciudad' ? 'Ej: Bogotá' : ''}
                      />
                    </div>

                    {/* Barrio Input */}
                    <div className="relative">
                      <label
                        htmlFor="barrio"
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          focusedField === 'barrio' || formData.barrio
                            ? '-top-2.5 text-xs bg-white px-1 text-colombia-yellow-600 font-medium'
                            : 'top-3.5 text-sm text-warm-gray-600'
                        }`}
                      >
                        Barrio
                      </label>
                      <motion.input
                        type="text"
                        id="barrio"
                        required
                        value={formData.barrio}
                        onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                        onFocus={() => setFocusedField('barrio')}
                        onBlur={() => setFocusedField(null)}
                        whileFocus={{ y: -2 }}
                        className={`w-full px-3 py-2.5 border-2 rounded-xl outline-none transition-all duration-200 text-warm-gray-900 text-sm focus-visible:outline-none ${
                          focusedField === 'barrio'
                            ? 'border-colombia-yellow-400 ring-4 ring-colombia-yellow-400/20 shadow-md'
                            : formData.barrio
                            ? 'border-colombia-yellow-100 bg-colombia-yellow-50/50'
                            : 'border-warm-gray-200 shadow-sm hover:border-warm-gray-300 hover:shadow'
                        }`}
                        placeholder={focusedField === 'barrio' ? 'Ej: Chapinero' : ''}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { y: -2, scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { y: 0, scale: 0.98 } : {}}
                      className="relative w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-colombia-yellow-400/50 text-sm sm:text-base"
                      style={{
                        background: isSubmitting
                          ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                          : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                        color: '#1C1917',
                        border: '1px solid #F59E0B',
                        boxShadow: isSubmitting
                          ? '0 4px 14px 0 rgba(217, 119, 6, 0.39)'
                          : '0 10px 25px -5px rgba(251, 191, 36, 0.5), 0 8px 10px -6px rgba(251, 191, 36, 0.3)',
                      }}
                    >
                      {/* Hover glow effect */}
                      {!isSubmitting && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          }}
                        />
                      )}

                      <span className="relative z-10">
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <motion.div
                                className="w-5 h-5 border-3 border-warm-gray-900 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              />
                              Generando tu narrativa...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Obtener mi narrativa
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>

                    {/* Error Message */}
                    {message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-colombia-red-500"
                      >
                        {message}
                      </motion.p>
                    )}
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-warm-gray-50 texture-overlay">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-5xl font-bold text-warm-gray-900 mb-12 text-center leading-tight tracking-tight">
              ¿Qué es Colombia es Buena?
            </h2>
          </AnimatedSection>

          <div className="space-y-8 text-lg text-warm-gray-700 leading-relaxed">
            <AnimatedSection>
              <p className="text-xl font-semibold text-warm-gray-900">
                Un movimiento ciudadano sin políticos que busca transformar la narrativa de Colombia.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <p>
                Durante años, Colombia ha sido vista desde la narrativa del miedo, la violencia y el pesimismo.
                Pero hay otra historia que contar: la de millones de colombianos que cada día construyen,
                cuidan y transforman sus comunidades.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3, ease: customEasing }}
                className="bg-gradient-to-br from-white via-white to-colombia-yellow-50/40 p-8 sm:p-10 rounded-2xl shadow-lg border-l-4 border-colombia-yellow-400"
                style={{
                  boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.15), 0 8px 10px -6px rgba(251, 191, 36, 0.1)',
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-warm-gray-900 mb-4 leading-tight">
                  &ldquo;Colombia es buena y vale la pena cuidarla&rdquo;
                </p>
                <p className="text-base sm:text-lg text-warm-gray-600 leading-relaxed">
                  Esta frase simple pero poderosa nos invita a reconocer lo bueno que ya existe y a
                  asumir nuestra responsabilidad de cuidarlo.
                </p>
              </motion.div>
            </AnimatedSection>

            {/* Values Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainerVariants}
              className="grid md:grid-cols-3 gap-6 my-12"
            >
              {[
                {
                  icon: '🤝',
                  title: 'Cooperación',
                  description: 'Construimos juntos un país mejor',
                  color: 'colombia-yellow',
                  hoverColor: 'rgba(251, 191, 36, 0.1)',
                },
                {
                  icon: '🙏',
                  title: 'Agradecimiento',
                  description: 'Reconocemos lo bueno que ya tenemos',
                  color: 'colombia-blue',
                  hoverColor: 'rgba(59, 130, 246, 0.1)',
                },
                {
                  icon: '💪',
                  title: 'Responsabilidad',
                  description: 'Cuidamos lo que valoramos',
                  color: 'colombia-red',
                  hoverColor: 'rgba(239, 68, 68, 0.1)',
                },
              ].map((value) => (
                <motion.div
                  key={value.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    transition: { duration: 0.3, ease: customEasing },
                  }}
                  className="bg-white p-8 rounded-2xl shadow-md text-center border border-warm-gray-100 hover:border-colombia-yellow-200 transition-all duration-300 cursor-default"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <motion.div
                    className="text-5xl mb-4"
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                      transition: { duration: 0.4, ease: customEasing },
                    }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="font-bold text-warm-gray-900 mb-2 text-lg">{value.title}</h3>
                  <p className="text-sm text-warm-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <AnimatedSection>
              <p>
                No esperamos salvadores ni políticos que solucionen todo. Somos nosotros,
                los ciudadanos, quienes tenemos el poder y la responsabilidad de cuidar a Colombia.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <p className="font-semibold text-warm-gray-900 text-xl">
                Este es un movimiento de esperanza, de acción y de amor por nuestro país.
                Porque cuando cuidamos lo que valoramos, todo cambia.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-colombia-blue-600 via-colombia-blue-500 to-colombia-blue-600"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm-6.1 0l17.071 17.071-1.414 1.415L25.9 2.83 9.757 18.971 8.343 17.556 25.9 0zM.284 0l28 28-1.414 1.415L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.628-1.414 1.414L0 13.858v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.415L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.657l1.414 1.414L60 13.858v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              ¿Listo para ser parte del cambio?
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <p className="text-lg sm:text-xl text-colombia-blue-50 mb-10">
              Únete a miles de colombianos que ya están cuidando a nuestro país
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative inline-block">
              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  border: '2px solid white',
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileHover={{
                  y: -3,
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="relative inline-block bg-white text-colombia-blue-600 font-bold py-4 px-8 sm:px-12 rounded-xl transition-all duration-250 shadow-2xl border-2 border-white overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                style={{
                  boxShadow: '0 20px 40px -10px rgba(255, 255, 255, 0.4)',
                }}
              >
                {/* Hover background */}
                <motion.div
                  className="absolute inset-0 bg-colombia-yellow-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.25, ease: customEasing }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Obtener mi narrativa
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-gray-900 text-warm-gray-600 py-12 px-4">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              className="text-sm transition-colors duration-200"
              whileHover={{ color: '#FBBF24', scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              © 2025 Colombia es Buena. Un movimiento ciudadano por la esperanza.
            </motion.p>
          </div>
        </AnimatedSection>
      </footer>
    </div>
  );
}
