import { app, BrowserWindow, Menu, dialog, protocol } from 'electron';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getStaticData, pollResources } from './resourceManager.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';
import * as fs from 'fs/promises';
import { handleMediaRequest } from './protocols/mediaProtocolHandler.js';


protocol.registerSchemesAsPrivileged([
    {
      scheme: 'media',
      privileges: {
        bypassCSP: true,
        stream: true
      }
    }
  ]);


app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      devTools: true, // Ensure DevTools are enabled
      sandbox: true
    },
    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: false,
  });

  // Add file selection handler
  ipcMainHandle('selectMusicXMLFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'MusicXml', extensions: ['musicxml', 'mxl', 'xml'] }
      ]
    });
    
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  });

  // Add file selection handler
  ipcMainHandle('selectVideoFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'avi', 'mkv', 'mov', 'webm'] }
      ]
    });
    
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  });

  // Add file reading handler
  ipcMainHandle('readMusicXMLFile', async (filePath: string) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error('Error reading MusicXML file:', error);
      throw error;
    }
  });

  // Enable keyboard shortcuts for DevTools (F12) and reload (F5)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    } else if (input.key === 'F5') {
      mainWindow.webContents.reload();
      event.preventDefault();
    }
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);

  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  });

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        mainWindow.maximize();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
    }
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  //createMenu(mainWindow);
});

app.whenReady().then(async () => {
  // Register media protocol
  protocol.handle('media', handleMediaRequest)
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}
