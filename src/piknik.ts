'use strict';
import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('piknik.copy', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let cb = editor.document.getText(editor.selection),
            stdout = (output) => console.log(output),
            stderr = (output) => console.error(output),
            exit = (code) => console.error("piknik exited with #{code}"),
            command = vscode.workspace.getConfiguration("piknik")["piknikBinPath"],
            configPath = vscode.workspace.getConfiguration("piknik")["piknikConfigPath"],
            args = ["-copy"];
        if (!cb.length) {
            return;
        }
        if (!command.length) {
            command = "piknik";
        }
        if (configPath.length) {
            args.push("-config");
            args.push(configPath);
        }
        let options = vscode.workspace.rootPath ? { cwd: vscode.workspace.rootPath } : undefined;
        let child = cp.spawn(command, args, options);
        child.on("exit", () => {
            vscode.window.showInformationMessage("Sent to piknik");
        });
        child.stdin.write(cb);
        child.stdin.end();
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('piknik.paste', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let stdout = (output) => console.log(output),
            stderr = (output) => console.error(output),
            exit = (code) => console.error("piknik exited with #{code}"),
            command = vscode.workspace.getConfiguration("piknik")["piknikBinPath"],
            configPath = vscode.workspace.getConfiguration("piknik")["piknikConfigPath"],
            args = ["-paste"];
        if (!command.length) {
            command = "piknik";
        }
        if (configPath.length) {
            args.push("-config");
            args.push(configPath);
        }
        let options = vscode.workspace.rootPath ? { cwd: vscode.workspace.rootPath } : undefined;
        let child = cp.spawn(command, args, options);
        child.stdout.on("data", (data: Buffer) => {
            editor.edit(function (editBuilder) {
                editBuilder.delete(editor.selection);
            }).then(function () {
                editor.edit(function (editBuilder) {
                    editBuilder.insert(editor.selection.start, data.toString());
                });
            });
        });
        child.stdin.end();
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
}