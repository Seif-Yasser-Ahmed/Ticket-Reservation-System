const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    showDialog: (options) => ipcRenderer.invoke('show-dialog', options),
});
