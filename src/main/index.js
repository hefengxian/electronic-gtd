'use strict'

import {app, BrowserWindow, shell} from 'electron'
import path from 'path'

// 设置 Proxy
// app.commandLine.appendSwitch('proxy-bypass-list', '<local>')
// app.commandLine.appendSwitch('proxy-server', 'socks5://127.0.0.1:1080')

require('electron-context-menu')({
  prepend: (params, browserWindow) => {
    let text = params.selectionText
    return [
      {
        label: '打开',
        // sublabel: '在文件浏览器中打开该地址',
        click (menuItem, browserWindow, event) {
          let platform = process.platform
          let path = text
          switch (platform) {
            case 'win32':
              if (path.startsWith('smb:')) {
                path = path.replace('smb:', '')
              }
              path = path.replace(/\//g, '\\')
              break
            default:
              // 1. `//` 或者 `\\` 开头的表示一个远程地址，使用 smb 协议打开
              // 并且支持 Windows 格式的 `\\`
              // 这个要放在步骤 2 之前，保证先执行
              if (path.startsWith('//') || path.startsWith('\\\\')) {
                path = 'smb:' + path
                path = path.replace(/\\/g, '/')
                path = encodeURI(path)
                shell.openItem(path)
                return
              }

              // 2. 类似于 /home/hfx/Desktop 的
              if (path.startsWith('/')) {
                shell.openItem(path)
                return
              }

              // 3. 直接用全协议的，例如：http://, smb://
              let schemaRegex = /^\w+:\/\//
              if (schemaRegex.test(path)) {
                shell.openItem(encodeURI(path))
                return
              }

              // 4. 直接 IP 开始的
              let ipRegExp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
              if (ipRegExp.test(path)) {
                path = 'smb://' + path
                path = path.replace(/\\/g, '/')
                shell.openItem(encodeURI(path))
                return
              }

              alert('无法打开地址！')
              break
          }
          // 打开地址
          shell.openItem(path)
        },
        visible: (text.startsWith('/') || text.startsWith('//') || text.startsWith('\\\\') || /^\w+:\/\//.test(text))
      }
    ]
  }
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    // frame: false,
    // useContentSize: true,
    height: 563,
    width: 1000,
    // LINUX 多屏下无效 Electron BUG 参见
    // https://github.com/electron/electron/issues/3490
    center: true,
    icon: path.join(__static, 'logo.png')
  })

  mainWindow.loadURL(winURL)
  mainWindow.center()
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
