'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

const customEasing = [0.16, 1, 0.3, 1] as const;

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

interface NarrativeData {
  success: boolean;
  narrative: string;
  metadata: {
    name: string;
    age: number;
    city: string;
    neighborhood: string;
    generatedAt: string;
  };
}

export default function NarrativaPage() {
  const narrativeData = useMemo<NarrativeData | null>(() => {
    // Initialize state from sessionStorage on mount
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('narrativeData');
      if (storedData) {
        try {
          return JSON.parse(storedData);
        } catch (error) {
          console.error('Error parsing narrative data:', error);
        }
      }
    }
    return null;
  }, []);

  if (!narrativeData || !narrativeData.success) {
    return (
      <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-warm-gray-900 mb-4">
            No se encontró una narrativa
          </h1>
          <p className="text-warm-gray-600 mb-8">
            Por favor, regresa al inicio y completa el formulario para generar tu narrativa personalizada.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-colombia-yellow-400 to-colombia-yellow-500 text-warm-gray-900 font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-warm-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-colombia-yellow-600 hover:text-colombia-yellow-700 font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <span>←</span>
            <span>Colombia es Buena</span>
          </Link>
          <div className="text-sm text-warm-gray-600">
            {narrativeData.metadata.city}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          {/* Title Section */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: customEasing }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-colombia-yellow-400 to-colombia-yellow-500 text-warm-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <span>✨</span>
              <span>Tu Narrativa Personalizada</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl font-bold text-warm-gray-900 mb-4 leading-tight">
              Una Historia de Transformación
            </h1>
          </div>

          {/* Narrative Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: customEasing }}
            className="bg-white rounded-2xl shadow-lg border border-warm-gray-200 p-8 sm:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold text-warm-gray-900 mb-6 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-bold text-warm-gray-800 mb-4 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-lg text-warm-gray-700 leading-relaxed mb-6">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-warm-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-warm-gray-600">
                      {children}
                    </em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-lg text-warm-gray-700">
                      {children}
                    </li>
                  ),
                }}
              >
                {narrativeData.narrative}
              </ReactMarkdown>
            </div>
          </motion.article>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: customEasing }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-colombia-blue-500 to-colombia-blue-600 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                ¿Listo para hacer realidad esta visión?
              </h2>
              <p className="text-lg text-colombia-blue-50 mb-8 max-w-2xl mx-auto">
                Únete al movimiento y sé parte del cambio. Comparte tu narrativa y ayuda a construir la Colombia que todos soñamos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-block bg-white text-colombia-blue-600 font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Volver al inicio
                </Link>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Mi narrativa - Colombia es Buena',
                        text: 'Mira mi narrativa sobre cómo podemos transformar Colombia',
                        url: window.location.href,
                      }).catch(() => {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        alert('¡Enlace copiado al portapapeles!');
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('¡Enlace copiado al portapapeles!');
                    }
                  }}
                  className="inline-block bg-colombia-yellow-400 text-warm-gray-900 font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Compartir narrativa
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-warm-gray-900 text-warm-gray-600 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            © 2025 Colombia es Buena. Un movimiento ciudadano por la esperanza.
          </p>
        </div>
      </footer>
    </div>
  );
}
