import * as vscode from 'vscode';
import { highlightStructFieldTags } from './highlight';

export function activate(context: vscode.ExtensionContext) {
	highlightStructFieldTags(context);
}
