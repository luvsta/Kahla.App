const electron = require('electron')
const { Menu, Tray, Notification, shell } = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const platform = require('os').platform()

let mainWindow
app.showExitNotif = true

const singleLock = app.requestSingleInstanceLock();

if (!singleLock) {
    app.quit();
}

function createWindow() {
    mainWindow = new BrowserWindow(
        {
            width: 1242,
            height: 768,
            icon: __dirname + '/assets/144x144.png',
            titleBarStyle: platform === 'darwin' ? 'hiddenInset' : 'default',
            minWidth: 200,
            minHeight: 300
        })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', function (event) {
        if (!app.isQuiting && app.showExitNotif) {
            event.preventDefault()
            app.showExitNotif = false
            new Notification({
                title: 'Kahla',
                body: 'Kahla is running in the background.'
            }).show()
            mainWindow.hide()
        }
        if (!app.isQuiting) {
            event.preventDefault()
            mainWindow.hide()
        }
    });

    mainWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

app.on('ready', createWindow)

app.addListener('before-quit', () => {
    app.isQuiting = true;
});

app.on('window-all-closed', function () {
    app.quit();
})

app.setAppUserModelId('com.example.kahla');

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    } else {
        mainWindow.show();
    }
})

app.on("second-instance",(event, commandLine, workingDirectory) => {
    if(mainWindow !== null){
        mainWindow.show();
    }
});

let tray = null
app.on('ready', () => {
    if (platform === 'darwin') {
        tray = new Tray(__dirname + '/assets/KahlaTemplate.png')
    } else {
        tray = new Tray(__dirname + '/assets/144x144.png')
    }
    tray.addListener('double-click', function () { mainWindow.show(); })
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Kahla', click: function () { mainWindow.show(); }
        },
        { type: 'separator' },
        {
            label: 'Exit', click: function () { app.isQuiting = true; app.quit(); }
        }
    ])
    Menu.setApplicationMenu(null)
    tray.setToolTip('Kahla')
    tray.setContextMenu(contextMenu)
})
