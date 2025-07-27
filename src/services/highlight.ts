import vscode from 'vscode';
import {
    configValueItemColor,
    configKey,
    configKeyColor,
    configValueOptionColor,
    configValueGapColor,
    configTextColor,
    configBackgroundColor,
    configGormTagKey,
    configOptionBranchColor
} from '../common/constants';
import { debounced, getCurrentEditor, isSupportedLanguage } from '../common/utils';
import { divideDecoratedBlocks } from '../logics/decorate';

let keyStyle: vscode.TextEditorDecorationType;
let itemStyle: vscode.TextEditorDecorationType;
let optionStyle: vscode.TextEditorDecorationType;
let branchStyle: vscode.TextEditorDecorationType;
let gapColor: vscode.TextEditorDecorationType;
let tagStyle: vscode.TextEditorDecorationType;
let gormTagKey: string;
export function addHighlight() {
    const updateDecorations = debounced(async () => {
        const editor = getCurrentEditor();
        // [SkipUnsupportedLanguages]
        if (!isSupportedLanguage(editor.document.languageId)) {
            return;
        } // [/]
        const { tagRanges, keyRanges, itemRanges, optionRanges, branchRanges, gapRanges } =
            divideDecoratedBlocks(editor.document, gormTagKey);
        // [ApplyDecorations]
        editor.setDecorations(tagStyle, tagRanges);
        editor.setDecorations(keyStyle, keyRanges);
        editor.setDecorations(itemStyle, itemRanges);
        editor.setDecorations(optionStyle, optionRanges);
        editor.setDecorations(branchStyle, branchRanges);
        editor.setDecorations(gapColor, gapRanges); // [/]
    }, 50);
    loadConfigs();
    updateDecorations();
    // [AddEventListeners]
    vscode.workspace.onDidOpenTextDocument(updateDecorations);
    vscode.workspace.onDidChangeTextDocument(updateDecorations);
    vscode.workspace.onDidChangeConfiguration(() => {
        loadConfigs();
        updateDecorations();
    });
    vscode.window.onDidChangeActiveTextEditor(updateDecorations);
    vscode.window.onDidChangeVisibleTextEditors(updateDecorations);
    vscode.window.onDidChangeTextEditorVisibleRanges(updateDecorations); // [/]
}

function loadConfigs() {
    gormTagKey = vscode.workspace.getConfiguration(configKey).get(configGormTagKey) as string;
    // The style created earlier has higher priority
    keyStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configKeyColor) as string
    });
    itemStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueItemColor) as string
    });
    optionStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueOptionColor) as string
    });
    branchStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configOptionBranchColor)
    });
    gapColor = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueGapColor) as string
    });
    tagStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configTextColor),
        backgroundColor: vscode.workspace
            .getConfiguration(configKey)
            .get(configBackgroundColor) as string
    });
}
