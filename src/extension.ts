import * as vscode from 'vscode';
import { addHighlight } from './services/highlight';

export function activate(context: vscode.ExtensionContext) {
	addHighlight();
}
