import { ChevronLeft, ChevronRight, X, Ghost } from 'lucide-react';
import { useTimerStore, FACE_TO_SESSION } from '../stores/timerStore';

export function NavigationControls() {
  const { 
    rotateTo, 
    currentFace, 
    state, 
    ghostMode, 
    setGhostMode
  } = useTimerStore();

  const handleGhostMode = () => {
    const newGhostMode = !ghostMode;
    setGhostMode(newGhostMode);
    
    if (window.electronAPI) {
      window.electronAPI.setAlwaysOnTop(true);
      window.electronAPI.setOpacity(newGhostMode ? 0.4 : 1);
    }
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  // Get session info for current face
  const sessionType = FACE_TO_SESSION[currentFace];
  const isRunning = state === 'running';

  // Color based on session type
  const getAccentColor = () => {
    switch (sessionType) {
      case 'focus': return 'text-red-400';
      case 'short_break': return 'text-emerald-400';
      case 'long_break': return 'text-blue-400';
      case 'settings': return 'text-purple-400';
      default: return 'text-white';
    }
  };


  return (
    <>
      {/* Top controls - with dark background for visibility */}
      <div className="absolute top-2 right-2 flex items-center gap-1 no-drag">
        <button
          onClick={handleGhostMode}
          className={`p-1.5 rounded-full transition-all backdrop-blur-sm ${
            ghostMode 
              ? 'bg-purple-500/30 text-purple-300' 
              : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
          }`}
          title="Ghost Mode (Alt+K)"
        >
          <Ghost size={14} />
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-red-500/50 transition-all backdrop-blur-sm"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Navigation arrows - with dark backgrounds */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4 no-drag">
        <button
          onClick={() => rotateTo('left')}
          className="p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all backdrop-blur-sm shadow-lg"
          title="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Face indicators - with background pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
          {[0, 1, 2, 3].map((face) => (
            <div
              key={face}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentFace === face 
                  ? face === 0 ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]' 
                    : face === 1 ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                    : face === 2 ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
                    : 'bg-purple-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => rotateTo('right')}
          className="p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all backdrop-blur-sm shadow-lg"
          title="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Running indicator - with background */}
      {isRunning && (
        <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm ${getAccentColor()}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-wider">
            {sessionType === 'focus' ? 'Focus' : sessionType === 'short_break' ? 'Break' : 'Long Break'}
          </span>
        </div>
      )}

      {/* Keyboard shortcuts hint - with dark background */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center no-drag">
        <div className="text-[10px] text-white/80 space-x-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <span>Alt+P Play</span>
          <span>Alt+R Reset</span>
          <span>Alt+K Ghost</span>
        </div>
      </div>
    </>
  );
}
