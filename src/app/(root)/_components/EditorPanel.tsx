"use client";

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useClerk } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../_constants';
import Image from 'next/image';
import { RotateCcw, Share, Type, Maximize2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from '@monaco-editor/react';
import ShareSnippetDialog from './ShareSnippetDialog';
import { EditorPanelSkeleton } from './EditorPanelSkeleton';

import type { editor as MonacoEditor } from 'monaco-editor';

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore() as {
    language: string;
    theme: string;
    fontSize: number;
    editor: MonacoEditor.IStandaloneCodeEditor | null;
    setFontSize: (size: number) => void;
    setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;

    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('editor-font-size');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem('editor-font-size', size.toString());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      className={`relative transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-20" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-white/10">
                <Image
                  src={`/${language}.png`}
                  alt={language}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-white">Code Editor</h2>
              <p className="text-sm text-gray-400">
                Write and execute {LANGUAGE_CONFIG[language].label} code
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Font Size Control */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-white/10">
              <Type className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer accent-indigo-500"
              />
              <span className="text-sm font-medium text-gray-300 min-w-[2rem] text-center">
                {fontSize}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                title="Reset to default"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsShareDialogOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Share className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          
          {clerk.loaded ? (
            <Editor
              height={isFullscreen ? "calc(100vh - 200px)" : "600px"}
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editorInstance) =>
                setEditor(editorInstance as MonacoEditor.IStandaloneCodeEditor)
              }
              options={{
                minimap: { enabled: true },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 20, bottom: 20 },
                renderWhitespace: "selection",
                fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                bracketPairColorization: {
                  enabled: true,
                },
                guides: {
                  indentation: true,
                  bracketPairs: true,
                },
              }}
            />
          ) : (
            <EditorPanelSkeleton />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isShareDialogOpen && (
          <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EditorPanel;