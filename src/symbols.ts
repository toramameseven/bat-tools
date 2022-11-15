// module name
import { start } from 'repl';
import * as vscode from 'vscode';
import { DocumentSymbol, Location } from 'vscode';

//
export async function getDocumentSymbol(uri: vscode.Uri) {
  const documentSymbol: DocumentSymbol[] = [];
  await updateDocumentTree(uri, documentSymbol);
  return documentSymbol;
}

//
export async function updateDocumentTree(uri: vscode.Uri, documentSymbol: DocumentSymbol[]) {
  const indexingWord =
    vscode.workspace.getConfiguration('bat-tools').get<string>('outline.indexingWord') ??
    '^\\s*(::|REM|@REM)\\s*(#+)\\s*(.*)';

  const indexingReg = RegExp(indexingWord, 'i');

  const isHierarchy = vscode.workspace
    .getConfiguration('bat-tools')
    .get<string>('outline.isHierarchy');

  const hierarchyIndexes = new Map<number, DocumentSymbol>();

  // main
  await parseFile(uri, documentSymbol);

  async function parseFile(uri: vscode.Uri, documentSymbol: DocumentSymbol[]) {
    let textDocument: vscode.TextDocument | undefined;
    await vscode.workspace.openTextDocument(uri).then((document) => {
      textDocument = document;
    });

    if (!textDocument) {
      return;
    }

    try {
      for (let line = 0; line < textDocument.lineCount; line++) {
        parseLine(textDocument, line, documentSymbol);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function parseLine(
    document: vscode.TextDocument,
    line: number,
    documentSymbol: DocumentSymbol[]
  ) {
    const textLine = document.lineAt(line);
    const matches = textLine.text.match(indexingReg);
    if (matches) {
      const symbol = new DocumentSymbol(
        matches[3],
        '',
        vscode.SymbolKind.String,
        textLine.range,
        textLine.range
      );

      let hierarchyIndex = matches[2].toString().length;
      const maxIndex = 5;
      hierarchyIndex > maxIndex && (hierarchyIndex = maxIndex);
      hierarchyIndexes.set(hierarchyIndex, symbol);

      let parentSymbol;
      for (let i = 1; i < hierarchyIndex; i++) {
        hierarchyIndexes.get(i) && (parentSymbol = hierarchyIndexes.get(i));
      }
      // add to root collections or parent
      if (parentSymbol && isHierarchy) {
        parentSymbol.children.push(symbol);
      } else {
        documentSymbol.push(symbol);
      }
    }
  }
}
