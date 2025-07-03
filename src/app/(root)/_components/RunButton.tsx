"use client"
import { getExecutionResult, useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { motion } from "framer-motion";
import { Play, Loader2, Zap } from "lucide-react";

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const handleRun = async () => {
    await runCode();
    const result = getExecutionResult();

    if (user && result) {
      await saveExecution({
        language,
        code: result.code,
        output: result.output || undefined,
        error: result.error || undefined,
      })
    }
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: isRunning ? 1 : 1.02 }}
      whileTap={{ scale: isRunning ? 1 : 0.98 }}
      className="group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
      
      <div className="relative flex items-center gap-3 px-6 py-3 text-white font-medium">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin" />
                <div className="absolute inset-0 blur-sm">
                  <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                </div>
              </div>
              <span className="text-sm">Executing...</span>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-50 transition-opacity">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm">Run Code</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

export default RunButton;