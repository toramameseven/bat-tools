// module name
import * as vscode from 'vscode';
import { SymbolInformation, Location } from 'vscode';

//
export async function getDocumentSymbol(uri: vscode.Uri) {
  const symbolInformation: SymbolInformation[] = [];
  await updateDocumentTree(uri, symbolInformation);
  return symbolInformation;
}

//
export async function updateDocumentTree(uri: vscode.Uri, symbolInformation: SymbolInformation[]) {
  // main
  await parseFile(uri, symbolInformation);

  async function parseFile(uri: vscode.Uri, symbolInformation: SymbolInformation[]) {
    let textDocument: vscode.TextDocument | undefined;
    await vscode.workspace.openTextDocument(uri).then((document) => {
      textDocument = document;
    });

    if (!textDocument) {
      return;
    }

    try {
      for (let line = 0; line < textDocument.lineCount; line++) {
        parseLine(textDocument, line, symbolInformation);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function parseLine(
    document: vscode.TextDocument,
    line: number,
    symbolInformation: SymbolInformation[]
  ) {
    const textLine = document.lineAt(line);
    const commentRegex = /^\s*(::|REM|@REM)\s*(#+)\s*(.*)/i;
    const matches = textLine.text.match(commentRegex);
    if (matches) {
      const symbol = new SymbolInformation(
        matches[3],
        vscode.SymbolKind.String,
        '',
        new Location(document.uri, textLine.range)
      );
      // add to collections
      symbolInformation.push(symbol);
    }
  }
}
