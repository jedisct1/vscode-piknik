'use strict';
import * as cp from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register the commands
    registerCommands(context);
}

/**
 * Registers the extension commands
 */
function registerCommands(context: vscode.ExtensionContext) {
    // Command to copy selected text to piknik clipboard
    const copyDisposable = vscode.commands.registerCommand('piknik.copy', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selectedText = editor.document.getText(editor.selection);
        if (!selectedText.length) {
            vscode.window.showWarningMessage('No text selected');
            return;
        }

        try {
            await copyToPiknik(selectedText);
            vscode.window.showInformationMessage('Copied to piknik clipboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to copy: ${errorMessage}`);
        }
    });

    // Command to paste from piknik clipboard
    const pasteDisposable = vscode.commands.registerCommand('piknik.paste', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        try {
            const text = await pasteFromPiknik();
            if (text) {
                await editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, text);
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to paste: ${errorMessage}`);
        }
    });

    context.subscriptions.push(copyDisposable, pasteDisposable);
}

/**
 * Copies text to the piknik clipboard
 */
async function copyToPiknik(text: string): Promise<void> {
    const command = getPiknikBinaryPath();
    const configPath = getPiknikConfigPath();
    const args = ['-copy'];

    if (configPath.length) {
        args.push('-config', configPath);
    }

    // Get workspace folder for cwd
    const options = getChildProcessOptions();

    return new Promise<void>((resolve, reject) => {
        const child = cp.spawn(command, args, options);
        
        child.on('error', (err) => {
            reject(new Error(`Failed to execute piknik: ${err.message}`));
        });

        child.stderr.on('data', (data: Buffer) => {
            reject(new Error(`Piknik error: ${data.toString().trim()}`));
        });

        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Piknik exited with code ${code}`));
            }
        });

        child.stdin.write(text);
        child.stdin.end();
    });
}

/**
 * Pastes text from the piknik clipboard
 */
async function pasteFromPiknik(): Promise<string> {
    const command = getPiknikBinaryPath();
    const configPath = getPiknikConfigPath();
    const args = ['-paste'];

    if (configPath.length) {
        args.push('-config', configPath);
    }

    // Get workspace folder for cwd
    const options = getChildProcessOptions();

    return new Promise<string>((resolve, reject) => {
        const child = cp.spawn(command, args, options);
        let stdout = '';
        let stderr = '';

        child.on('error', (err) => {
            reject(new Error(`Failed to execute piknik: ${err.message}`));
        });

        child.stdout.on('data', (data: Buffer) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data: Buffer) => {
            stderr += data.toString();
        });

        child.on('exit', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(`Piknik error: ${stderr.trim() || `Exit code: ${code}`}`));
            }
        });

        child.stdin.end();
    });
}

/**
 * Gets the piknik binary path from configuration
 */
function getPiknikBinaryPath(): string {
    const config = vscode.workspace.getConfiguration('piknik');
    const path = config.get<string>('piknikBinPath', 'piknik');
    return path.length ? path : 'piknik';
}

/**
 * Gets the piknik config path from configuration
 */
function getPiknikConfigPath(): string {
    const config = vscode.workspace.getConfiguration('piknik');
    return config.get<string>('piknikConfigPath', '');
}

/**
 * Gets the child process options with appropriate cwd
 */
function getChildProcessOptions(): cp.SpawnOptions {
    // Use first workspace folder if available
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    return workspaceFolder ? { cwd: workspaceFolder.uri.fsPath } : {};
}

export function deactivate() {
    // Clean up resources if needed
}