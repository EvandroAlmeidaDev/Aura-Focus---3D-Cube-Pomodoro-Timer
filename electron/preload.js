const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  moveWindow: (x, y) => ipcRenderer.send('window-move', { x, y }),
  closeWindow: () => ipcRenderer.send('window-close'),
  getWindowPosition: () => ipcRenderer.invoke('get-window-position'),
  
  // Ghost mode
  setAlwaysOnTop: (value) => ipcRenderer.send('set-always-on-top', value),
  setOpacity: (value) => ipcRenderer.send('set-opacity', value),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  
  // Shortcuts listener
  onShortcut: (callback) => {
    ipcRenderer.on('shortcut', (event, action) => callback(action));
  },
  
  // Remove listeners
  removeShortcutListener: () => {
    ipcRenderer.removeAllListeners('shortcut');
  },
});
