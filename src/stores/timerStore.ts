import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionType = 'focus' | 'short_break' | 'long_break';
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

// Map cube face index to session type
export const FACE_TO_SESSION: Record<number, SessionType | 'settings'> = {
  0: 'focus',        // Front face
  1: 'short_break',  // Right face  
  2: 'long_break',   // Back face
  3: 'settings',     // Left face (settings)
};

export const SESSION_TO_FACE: Record<SessionType | 'settings', number> = {
  'focus': 0,
  'short_break': 1,
  'long_break': 2,
  'settings': 3,
};

interface TimerConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  soundVolume: number;
}

interface TimerStore {
  // Timer state
  state: TimerState;
  sessionType: SessionType;
  timeRemaining: number;
  totalDuration: number;
  completedSessions: number;
  
  // Config
  config: TimerConfig;
  
  // UI state
  isSettingsOpen: boolean;
  ghostMode: boolean;
  currentFace: number; // 0=focus, 1=short_break, 2=long_break, 3=settings
  
  // Timer interval reference
  intervalId: number | null;
  
  // Actions
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  tick: () => void;
  
  // Cube navigation
  setCurrentFace: (face: number) => void;
  rotateTo: (direction: 'left' | 'right') => void;
  
  // Config actions
  updateConfig: (config: Partial<TimerConfig>) => void;
  
  // UI actions
  setSettingsOpen: (isOpen: boolean) => void;
  setGhostMode: (enabled: boolean) => void;
  
  // Session helpers
  getSessionDuration: (type: SessionType) => number;
  prepareNextSession: () => void;
  switchToSession: (type: SessionType) => void;
}

const DEFAULT_CONFIG: TimerConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  soundVolume: 50,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      state: 'idle',
      sessionType: 'focus',
      timeRemaining: DEFAULT_CONFIG.focusMinutes * 60,
      totalDuration: DEFAULT_CONFIG.focusMinutes * 60,
      completedSessions: 0,
      config: DEFAULT_CONFIG,
      isSettingsOpen: false,
      ghostMode: false,
      currentFace: 0,
      intervalId: null,

      getSessionDuration: (type: SessionType) => {
        const { config } = get();
        switch (type) {
          case 'focus':
            return config.focusMinutes * 60;
          case 'short_break':
            return config.shortBreakMinutes * 60;
          case 'long_break':
            return config.longBreakMinutes * 60;
        }
      },

      start: () => {
        const { state, intervalId } = get();
        if (state === 'running') return;

        if (intervalId) clearInterval(intervalId);

        const newIntervalId = window.setInterval(() => {
          get().tick();
        }, 1000);

        set({
          state: 'running',
          intervalId: newIntervalId,
        });
      },

      pause: () => {
        const { intervalId } = get();
        if (intervalId) {
          clearInterval(intervalId);
        }
        set({
          state: 'paused',
          intervalId: null,
        });
      },

      toggle: () => {
        const { state, start, pause, currentFace } = get();
        
        // Don't toggle if on settings face
        if (currentFace === 3) return;
        
        if (state === 'running') {
          pause();
        } else {
          start();
        }
      },

      reset: () => {
        const { intervalId, sessionType, getSessionDuration } = get();
        if (intervalId) {
          clearInterval(intervalId);
        }
        const duration = getSessionDuration(sessionType);
        set({
          state: 'idle',
          timeRemaining: duration,
          totalDuration: duration,
          intervalId: null,
        });
      },

      tick: () => {
        const { timeRemaining, state, config } = get();
        
        if (state !== 'running') return;

        if (timeRemaining <= 1) {
          const { intervalId, sessionType, completedSessions, prepareNextSession } = get();
          
          if (intervalId) clearInterval(intervalId);
          
          const newCompletedSessions = sessionType === 'focus' 
            ? completedSessions + 1 
            : completedSessions;

          set({
            state: 'completed',
            timeRemaining: 0,
            completedSessions: newCompletedSessions,
            intervalId: null,
          });

          // Show notification
          if (config.soundEnabled && window.electronAPI) {
            const titles: Record<SessionType, string> = {
              'focus': 'Focus Session Complete!',
              'short_break': 'Break Over!',
              'long_break': 'Long Break Over!',
            };
            window.electronAPI.showNotification(
              titles[sessionType],
              'Time for the next session!'
            );
          }

          setTimeout(() => {
            prepareNextSession();
          }, 1000);
        } else {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      setCurrentFace: (face: number) => {
        const { state, pause } = get();
        
        // Pause timer if running and switching faces
        if (state === 'running') {
          pause();
        }
        
        const sessionType = FACE_TO_SESSION[face];
        
        if (sessionType && sessionType !== 'settings') {
          const { getSessionDuration } = get();
          const duration = getSessionDuration(sessionType);
          set({
            currentFace: face,
            sessionType,
            timeRemaining: duration,
            totalDuration: duration,
            state: 'idle',
            isSettingsOpen: false,
          });
        } else if (sessionType === 'settings') {
          set({
            currentFace: face,
            isSettingsOpen: true,
          });
        }
      },

      rotateTo: (direction: 'left' | 'right') => {
        const { currentFace, setCurrentFace } = get();
        let newFace: number;
        
        if (direction === 'right') {
          newFace = (currentFace + 1) % 4;
        } else {
          newFace = (currentFace - 1 + 4) % 4;
        }
        
        setCurrentFace(newFace);
      },

      prepareNextSession: () => {
        const { sessionType, completedSessions, config, setCurrentFace } = get();
        
        let nextType: SessionType;
        
        if (sessionType === 'focus') {
          if (completedSessions > 0 && completedSessions % config.sessionsUntilLongBreak === 0) {
            nextType = 'long_break';
          } else {
            nextType = 'short_break';
          }
        } else {
          nextType = 'focus';
        }

        const nextFace = SESSION_TO_FACE[nextType];
        setCurrentFace(nextFace);
      },

      switchToSession: (type: SessionType) => {
        const face = SESSION_TO_FACE[type];
        get().setCurrentFace(face);
      },

      updateConfig: (newConfig) => {
        const { config, state, sessionType, getSessionDuration } = get();
        const updatedConfig = { ...config, ...newConfig };
        
        set({ config: updatedConfig });

        if (state === 'idle') {
          const duration = getSessionDuration(sessionType);
          set({
            timeRemaining: duration,
            totalDuration: duration,
          });
        }
      },

      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
      
      setGhostMode: (enabled) => set({ ghostMode: enabled }),
    }),
    {
      name: 'aura-focus-storage',
      partialize: (state) => ({
        config: state.config,
        completedSessions: state.completedSessions,
      }),
    }
  )
);

// Selector hooks
export const useTimerState = () => useTimerStore((s) => s.state);
export const useSessionType = () => useTimerStore((s) => s.sessionType);
export const useTimeRemaining = () => useTimerStore((s) => s.timeRemaining);
export const useTotalDuration = () => useTimerStore((s) => s.totalDuration);
export const useCurrentFace = () => useTimerStore((s) => s.currentFace);
export const useConfig = () => useTimerStore((s) => s.config);

// Helper to format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
