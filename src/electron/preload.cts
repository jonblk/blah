const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  /*
  subscribeStatistics: (callback) => {
    ipcOn('renderingProgress', (stats) => {
      callback(stats);
    })
  },
  */
  getVideoUrl: (filePath: string) => `media://${encodeURIComponent(filePath)}`,
  handleMediaRequest: async () => await ipcInvoke('handleMediaRequest'),
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
  selectVideoFile: async () => await ipcInvoke('selectVideoFile'),
  selectMusicXMLFile: async () => await ipcInvoke('selectMusicXMLFile'),
  readMusicXMLFile: async (filePath: string) => await ipcInvoke('readMusicXMLFile', filePath),
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...args: any[]
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, ...args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
