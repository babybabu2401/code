"use client";

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import React, { useEffect } from 'react'
import { LANGUAGE_CONFIG } from '../_constants';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, Lock, Check, Code } from "lucide-react";

function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== 'javascript') return;
    setLanguage(langId);
    setIsOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 min-w-[160px]"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-6 h-6 rounded-lg bg-gray-700/50 p-1 group-hover:scale-110 transition-transform">
              <Image
                src={currentLanguageObj.logoPath}
                alt={currentLanguageObj.label}
                width={16}
                height={16}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <span className="text-sm text-gray-300 group-hover:text-white font-medium">
            {currentLanguageObj.label}
          </span>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 card p-2 z-50 shadow-2xl max-h-80 overflow-y-auto"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Select Language</p>
              </div>
            </div>

            <div className="space-y-1">
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                const isLocked = !hasAccess && lang.id !== "javascript";
                const isSelected = language === lang.id;

                return (
                  <motion.button
                    key={lang.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : isLocked
                        ? "text-gray-500 cursor-not-allowed opacity-50"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    }`}
                    onClick={() => handleLanguageSelect(lang.id)}
                    disabled={isLocked}
                  >
                    <div className={`relative w-8 h-8 rounded-lg p-1.5 ${
                      isSelected ? "bg-indigo-500/20" : "bg-gray-700/50"
                    }`}>
                      <Image
                        src={lang.logoPath}
                        alt={lang.label}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <span className="flex-1 text-left text-sm font-medium">
                      {lang.label}
                    </span>

                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-500" />
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-indigo-400" />
                    ) : null}
                  </motion.button>
                );
              })}
            </div>

            {!hasAccess && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs text-amber-400 text-center">
                  Upgrade to Pro to unlock all languages
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;