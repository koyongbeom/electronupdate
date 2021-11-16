const { app, BrowserWindow , ipcMain} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const {autoUpdater} = require('electron-updater');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      devTools: isDev,
      preload : path.join(__dirname, "..", "preload.js")
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.focus();

  mainWindow.once('ready-to-show', ()=>{
      autoUpdater.checkForUpdatesAndNotify();
  })
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("toMain", (event, args)=>{
    if(args === "update"){
    mainWindow.webContents.send("fromMain", "version", app.getVersion());
    }

    if(args === "restart_app"){
        autoUpdater.quitAndInstall();
    }
})

autoUpdater.on("update-available", ()=>{
    mainWindow.webContents.send("fromMain" ,"update_available");
})

autoUpdater.on("update-downloaded", ()=>{
    mainWindow.webContents.send("fromMain", "update_downloaded")
})

