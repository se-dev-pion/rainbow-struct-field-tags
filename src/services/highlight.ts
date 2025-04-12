import vscode from 'vscode';
import { configValueItemColor, configKey, configKeyColor, configValueOptionColor, configValueGapColor, configTextColor, configBackgroundColor } from '../common/constants';
import { checkDocLanguage, debounced, getCurrentEditor } from '../common/utils';
import { divideDecoratedBlocks } from '../logics/decorate';

let keyStyle: vscode.TextEditorDecorationType;
let itemStyle: vscode.TextEditorDecorationType;
let optionStyle: vscode.TextEditorDecorationType;
let gapColor: vscode.TextEditorDecorationType;
let tagStyle: vscode.TextEditorDecorationType;
export function addHighlight() {
    const updateDecorations = debounced(async () => {
        const editor = getCurrentEditor();
        checkDocLanguage(editor.document);
        const { tagRanges, keyRanges, itemRanges, optionRanges, gapRanges } = divideDecoratedBlocks(editor.document);
        // [ApplyDecorations]
        editor.setDecorations(tagStyle, tagRanges);
        editor.setDecorations(keyStyle, keyRanges);
        editor.setDecorations(itemStyle, itemRanges);
        editor.setDecorations(optionStyle, optionRanges);
        editor.setDecorations(gapColor, gapRanges); // [/]
    }, 50);
    initDecorations();
    updateDecorations();
    // [AddEventListeners]
    vscode.workspace.onDidOpenTextDocument(updateDecorations);
    vscode.workspace.onDidChangeTextDocument(updateDecorations);
    vscode.workspace.onDidChangeConfiguration(() => {
        initDecorations();
        updateDecorations();
    });
    vscode.window.onDidChangeActiveTextEditor(updateDecorations);
    vscode.window.onDidChangeVisibleTextEditors(updateDecorations);
    vscode.window.onDidChangeTextEditorVisibleRanges(updateDecorations); // [/]
}

function initDecorations() {
    // The style created earlier has higher priority
    keyStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configKeyColor) as string,
    });
    itemStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueItemColor) as string,
    });
    optionStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueOptionColor) as string,
    });
    gapColor = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueGapColor) as string,
    });
    tagStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configTextColor),
        backgroundColor: vscode.workspace.getConfiguration(configKey).get(configBackgroundColor) as string,
    });
}