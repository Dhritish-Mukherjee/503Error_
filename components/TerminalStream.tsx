import React, { useEffect, useState, useRef } from 'react';
import { TERMINAL_MESSAGES } from '../constants';
import { BehavioralData, HardwareData, SessionData } from '../types';

interface TerminalStreamProps {
  behavioral: BehavioralData;
  hardware: HardwareData;
  session: SessionData;
  phase: string;
}

export const TerminalStream: React.FC<TerminalStreamProps> = ({ behavioral, hardware, session, phase }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);
  const hardwareLoggedRef = useRef(false);
  const sessionLoggedRef = useRef(false);
  
  // Track previous states to trigger logs on change
  const prevKineticState = useRef(behavioral.kinetics.kineticState);

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
        if (Math.random() > 0.8) {
            const activities = ["Packet sniffed", "Keyframe sync", "Buffer flushed", "Idle state verified", "Cache coherence check"];
            addLog(activities[Math.floor(Math.random() * activities.length)]);
        }
      }
    }, 1200);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Watch focus state
  useEffect(() => {
    if (!behavioral.hasFocus) {
        addLog("!! SUBJECT_LOST // FOCUS_BROKEN !!");
    } else if (logs.length > 0) {
        addLog("SUBJECT_RETURNED. RESUMING STREAM.");
    }
  }, [behavioral.hasFocus]);

  // Watch Hardware ID
  useEffect(() => {
    if (hardware.model !== 'ANALYZING...' && !hardwareLoggedRef.current) {
        addLog(`[ANALYSIS]: Hardware signature matches ${hardware.model}. Processing load optimized for this architecture.`);
        hardwareLoggedRef.current = true;
    }
  }, [hardware.model]);

  // Watch Database Sync
  useEffect(() => {
    if (session.status === 'SYNCED' && !sessionLoggedRef.current) {
        addLog(`[DATABASE]: Handshake established. Subject_UID: ${session.fingerprint}... Saved.`);
        if (session.visitCount > 1) {
            addLog(`[HISTORY]: Subject recognized. Recurring visit #${session.visitCount}. Loading profile...`);
        } else {
            addLog(`[HISTORY]: New subject profile created.`);
        }
        sessionLoggedRef.current = true;
    }
  }, [session.status, session.fingerprint, session.visitCount]);

  // Watch Kinetic State Changes
  useEffect(() => {
    if (prevKineticState.current !== behavioral.kinetics.kineticState) {
        const state = behavioral.kinetics.kineticState;
        
        if (state === 'AGITATED') {
            addLog("[KINETICS]: High-frequency jitter detected. Subject exhibiting signs of nervousness or tremor.");
        } else if (state === 'LOCOMOTION') {
            addLog("[KINETICS]: Rhythmic oscillation detected. Subject is in transit.");
        } else if (state === 'SEDENTARY') {
            addLog("[KINETICS]: Movement ceased. Subject has achieved a state of physical stasis.");
        }
        
        // Log posture update on kinetic change
        addLog(`[SPATIAL]: Recalibrating... State: ${behavioral.kinetics.postureReport}`);

        prevKineticState.current = state;
    }
  }, [behavioral.kinetics.kineticState, behavioral.kinetics.postureReport]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (phase === 'DISCONNECTED') return null;

  return (
    <div className="border border-sys-grey bg-black p-4 h-full flex flex-col font-mono text-xs overflow-hidden relative">
      <div className="absolute top-2 right-2 text-sys-grey opacity-50">LOG://sys_kernel</div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 scrollbar-hide"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-gray-400 border-l-2 border-transparent hover:border-sys-white pl-2 transition-all">
            <span className="opacity-50 mr-2">{'>'}</span>{log}
          </div>
        ))}
      </div>
    </div>
  );
};