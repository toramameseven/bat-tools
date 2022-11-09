// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LangDocumentSymbolProvider } from './documentSymbolProvider';

/**
 * function name, symbol
 */
// export const vbaSymbolsInModule = new Map<string, VbaSymbol>();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider('bat', new LangDocumentSymbolProvider())
  );
  console.log('"vba extension is now active!');
}
