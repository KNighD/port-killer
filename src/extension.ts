// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
const cp = require('child_process')

const getPortInfos = (port: string) => {
  return new Promise((resolve, reject) => {
    cp.exec(
      `lsof -i tcp:${port} | grep LISTEN`,
      (err: Error, stdout: string, stderr: string) => {
        if (stderr || err) {
          return reject(stderr || err)
        }
        const infos = stdout
          .split('\n')
          .filter((i) => !!i)
          .map((item) => {
            const info = item.trim().split(/\s+/)
            const cmd = info[0]
            const pid = info[1]
            const protocol = info[7]
            const ip = info[8]
            const port = ip.split(':')[1]
            return {
              cmd,
              pid,
              protocol,
              ip,
              port,
            }
          })
        return resolve(infos)
      }
    )
  })
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.portKiller',
    async () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      const port = await vscode.window.showInputBox({
        prompt: 'input the port you want to kill',
      })
      if (!port) {
        return
      }
      const infos = await getPortInfos(port)
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
