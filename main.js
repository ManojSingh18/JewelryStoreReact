const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

let isDev;

(async () => {
  isDev = (await import('electron-is-dev')).default;
})();

// Function to delete cache directory recursively
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Get the cache directory path and delete it
app.on('ready', async () => {
  const cachePath = path.join(app.getPath('userData'), 'Cache');
  deleteFolderRecursive(cachePath);

  // Disable GPU acceleration
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');

  let mainWindow;

  async function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, 'client', 'build', 'index.html')}`
    );

    mainWindow.on('closed', () => (mainWindow = null));
  }

  // Example login request
  try {
    const response = await axios.post('http://localhost:3001/api/users/login', {
      username: 'root',
      password: 'root',
    }, { withCredentials: true });

    console.log('Login response:', response);

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      const sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid'));
      if (sessionCookie) {
        const sessionValue = sessionCookie.split(';')[0].split('=')[1];
        console.log('Session value obtained:', sessionValue);

        // Set session cookie in Electron
        await session.defaultSession.cookies.set({
          url: 'http://localhost:3000',
          name: 'connect.sid',
          value: sessionValue,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
        });

        // Log the cookies to verify they are set correctly
        const allCookies = await session.defaultSession.cookies.get({ url: 'http://localhost:3000' });
        console.log('All cookies for http://localhost:3000:', allCookies);

        console.log('Session cookie set successfully.');
      } else {
        console.error('Session cookie not found in login response.');
      }
    } else {
      console.error('Set-Cookie header not found in login response.');
    }
  } catch (error) {
    console.error('Login request failed:', error);
  }

  createWindow();

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });
});
