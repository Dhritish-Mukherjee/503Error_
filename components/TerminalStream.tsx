import React, { useEffect, useState, useRef } from 'react';
import { TERMINAL_MESSAGES } from '../constants';

interface TerminalStreamProps {
  hasFocus: boolean;
  phase: string;
}

export const TerminalStream: React.FC<TerminalStreamProps> = ({ hasFocus, phase }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-GB');
    setLogs(prev => [...prev.slice(-12), `[${timestamp}]: ${msg}`]);
  };

  // Initial stream
  useEffect(() => {
    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index < TERMINAL_MESSAGES.length) {
        addLog(TERMINAL_MESSAGES[index]);
        index++;
      } else {
        // Random "heartbeat" logs
        if (Math.random() > 0.7) {
            const activities = ["Packet sniffed", "Keyframe sync", "Buffer flushed", "Idle state verified"];
            addLog(activities[Math.floor(Math.random() * activities.length)]);
        }
      }
    }, 1200);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Watch focus state
  useEffect(() => {
    if (!hasFocus) {
        addLog("!! SUBJECT_LOST // FOCUS_BROKEN !!");
    } else if (logs.length > 0) {
        addLog("SUBJECT_RETURNED. RESUMING STREAM.");
    }
  }, [hasFocus]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (phase === 'DISCONNECTED') return null;

  return (
    <div className="border border-sys-grey bg-black p-4 h-full flex flex-col font-mono text-xs overflow-hidden relative">
      <div className="absolute top-2 right-2 text-sys-grey opacity-50">LOG://sys_kernel</div>
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className="text-gray-400 border-l-2 border-transparent hover:border-sys-white pl-2 transition-all">
            <span className="opacity-50 mr-2">{'>'}</span>{log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
