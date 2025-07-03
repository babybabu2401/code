"use client"

import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import React, { useEffect, useRef, useState } from 'react'
import { THEMES } from '../_constants';
import { AnimatePresence, motion } from 'framer-motion'
import { Palette, Check, ChevronDown } from 'lucide-react';

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className="group flex items-center gap-3 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 min-w-[180px]"
      >
        <div className="flex items-center gap-3 flex-1">
          <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
          <span className="text-sm text-gray-300 group-hover:text-white">
            {currentTheme?.label}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-500"
            style={{ background: currentTheme?.color }}
          />
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full min-w-[240px] card p-2 z-50 shadow-2xl"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <p className="text-xs font-medium text-gray-400">Select Theme</p>
            </div>

            <div className="space-y-1">
              {THEMES.map((t, index) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    theme === t.id 
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-lg border border-gray-600"
                    style={{ background: t.color }}
                  />
                  
                  <span className="flex-1 text-left text-sm font-medium">
                    {t.label}
                  </span>

                  {theme === t.id && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSelector;