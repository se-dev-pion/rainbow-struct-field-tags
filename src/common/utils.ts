import vscode from 'vscode';
import { ErrInvalidLanguage, ErrNoActiveEditor } from './errors';

export function getCurrentEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw ErrNoActiveEditor;
    }
    return editor;
}

export function checkDocLanguage(doc: vscode.TextDocument) {
    if (doc.languageId !== 'go') {
        throw ErrInvalidLanguage;
    }
}
