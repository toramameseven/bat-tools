// Reference:
//   https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-all-symbol-definitions-within-a-document
//   https://github.com/Gimly/vscode-fortran/blob/229cddce53a2ea0b93032619efeef26376cd0d2c/src/documentSymbolProvider.ts
import vscode = require('vscode');
import { getDocumentSymbol } from './symbols';

export class LangDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public async provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ) {
    const symbols = await getDocumentSymbol(document.uri);
    return symbols;
  }
}
