import { app, BrowserWindow, ipcMain, globalShortcut, Notification, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let isDev = !app.isPackaged;

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 380,
    height: 520,
    x: screenWidth - 400,
    y: 20,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Window drag handling
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register global shortcuts
function registerShortcuts() {
  // Alt+P: Toggle Play/Pause
  globalShortcut.register('Alt+P', () => {
    if (mainWindow) {
      mainWindow.webContents.send('shortcut', 'toggle');
    }
  });

  // Alt+K: Toggle Ghost Mode
  globalShortcut.register('Alt+K', () => {
    if (mainWindow) {
      mainWindow.webContents.send('shortcut', 'ghost');
    }
  });

  // Alt+R: Reset Timer
  globalShortcut.register('Alt+R', () => {
    if (mainWindow) {
      mainWindow.webContents.send('shortcut', 'reset');
    }
  });
}

// IPC Handlers
ipcMain.on('window-move', (event, { x, y }) => {
  if (mainWindow) {
    mainWindow.setPosition(x, y);
  }
});

ipcMain.on('window-close', () => {
  app.quit();
});

ipcMain.on('set-always-on-top', (event, value) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(value);
  }
});

ipcMain.on('set-opacity', (event, value) => {
  if (mainWindow) {
    mainWindow.setOpacity(value);
  }
});

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

ipcMain.handle('get-window-position', () => {
  if (mainWindow) {
    return mainWindow.getPosition();
  }
  return [0, 0];
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  registerShortcuts();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
