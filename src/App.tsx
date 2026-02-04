import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PomodoroСube } from './components/PomodoroСube';
import { NavigationControls } from './components/NavigationControls';
import { SettingsPanel } from './components/SettingsPanel';
import { useTimerStore } from './stores/timerStore';

// Type declaration for Electron API
declare global {
  interface Window {
    electronAPI?: {
      moveWindow: (x: number, y: number) => void;
      closeWindow: () => void;
      getWindowPosition: () => Promise<[number, number]>;
      setAlwaysOnTop: (value: boolean) => void;
      setOpacity: (value: number) => void;
      showNotification: (title: string, body: string) => void;
      onShortcut: (callback: (action: string) => void) => void;
      removeShortcutListener: () => void;
    };
  }
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  
  const { toggle, reset, ghostMode, setGhostMode } = useTimerStore();

  // Handle window dragging
  const handleMouseDown = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    
    setIsDragging(true);
    const pos = await window.electronAPI?.getWindowPosition();
    if (pos) {
      setWindowPos({ x: pos[0], y: pos[1] });
      setDragStart({ x: e.screenX, y: e.screenY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.screenX - dragStart.x;
    const deltaY = e.screenY - dragStart.y;
    
    window.electronAPI?.moveWindow(windowPos.x + deltaX, windowPos.y + deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, windowPos]);

  // Handle keyboard shortcuts from Electron
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onShortcut((action) => {
        switch (action) {
          case 'toggle':
            toggle();
            break;
          case 'reset':
            reset();
            break;
          case 'ghost':
            const newGhostMode = !ghostMode;
            setGhostMode(newGhostMode);
            window.electronAPI?.setAlwaysOnTop(true);
            window.electronAPI?.setOpacity(newGhostMode ? 0.4 : 1);
            break;
        }
      });

      return () => {
        window.electronAPI?.removeShortcutListener();
      };
    }
  }, [toggle, reset, ghostMode, setGhostMode]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      style={{ 
        background: 'transparent',
        opacity: ghostMode ? 0.4 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <Canvas
        camera={{ position: [0, -0.8, 4.5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <PomodoroСube />
      </Canvas>
      
      <NavigationControls />
      <SettingsPanel />
    </div>
  );
}

export default App;
