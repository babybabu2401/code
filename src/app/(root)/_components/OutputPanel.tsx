"use client"
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal, Activity } from 'lucide-react';
import React, { useState } from 'react'
import RunningCodeSkeleton from './RunningCodeSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const hasContent = output || error;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(output || error || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div 
      className="card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl blur-sm opacity-20" />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-white/10">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Output</h3>
            <p className="text-sm text-gray-400">
              {isRunning ? "Executing..." : hasContent ? "Execution complete" : "Ready to run"}
            </p>
          </div>
        </div>

        {hasContent && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Copy</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Output Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900/50 h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        
        <div className="relative h-full p-6 overflow-auto font-mono text-sm">
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RunningCodeSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-400 mb-1">Execution Error</div>
                    <div className="text-red-300/80 text-sm">Something went wrong during execution</div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-red-500/20">
                  <pre className="whitespace-pre-wrap text-red-300 text-sm leading-relaxed">{error}</pre>
                </div>
              </motion.div>
            ) : output ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-emerald-400 mb-1">Execution Successful</div>
                    <div className="text-emerald-300/80 text-sm">Your code ran without errors</div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-emerald-500/20">
                  <pre className="whitespace-pre-wrap text-gray-100 text-sm leading-relaxed">{output}</pre>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-white/10">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Ready to Execute</h4>
                <p className="text-gray-400 max-w-sm">
                  Click the "Run Code" button to execute your code and see the output here
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default OutputPanel;