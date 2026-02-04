/// <reference types="vite/client" />

interface ElectronAPI {
  moveWindow: (x: number, y: number) => void;
  closeWindow: () => void;
  getWindowPosition: () => Promise<[number, number]>;
  setAlwaysOnTop: (value: boolean) => void;
  setOpacity: (value: number) => void;
  showNotification: (title: string, body: string) => void;
  onShortcut: (callback: (action: string) => void) => void;
  removeShortcutListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
