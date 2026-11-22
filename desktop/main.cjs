const { app, BrowserWindow, shell } = require('electron');

const GAME_URL = 'https://irlise-ristorante.pages.dev';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#17212b',
    autoHideMenuBar: true,
    title: 'IRLISE RISTORANTE',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => win.show());

  // Keep the game inside the app; send unrelated external links to the default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    let isGameOrigin = false;
    try {
      isGameOrigin = new URL(url).origin === new URL(GAME_URL).origin;
    } catch (_) {}
    if (!isGameOrigin) {
      event.preventDefault();
      if (url.startsWith('https://') || url.startsWith('http://')) {
        shell.openExternal(url);
      }
    }
  });

  win.loadURL(GAME_URL);
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.irlise.ristorante');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
