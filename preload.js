const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('appli', {

    Close: () => ipcRenderer.send("close"),
    Minimize: () => ipcRenderer.send("minimize"),


// ASYNC
    Upload: (SourcePath, KeyID) => {return ipcRenderer.invoke("upload", SourcePath, KeyID)},
    Download: (DestiPath, KeyID) => {return ipcRenderer.invoke("download", DestiPath, KeyID)},

// SYNC
    ProfilesUpdate: (ProfilesUpdate, Name) => {return ipcRenderer.invoke("ProfilesUpdate", ProfilesUpdate, Name)},
    AuthUpdate: (AuthUpdate) => {return ipcRenderer.invoke("AuthUpdate", AuthUpdate)},

    GetProfiles: () => {return ipcRenderer.invoke('GetProfiles')},
    GetAuth: () => {return ipcRenderer.invoke('GetAuth')},
    GetLogs: () => {return ipcRenderer.invoke('GetLogs')},

    IsIMG: (KeyID) => {return ipcRenderer.invoke("IsIMG", KeyID)}

  })
