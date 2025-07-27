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
    configOptionBranchColor,
    configDebounceTimeout
} from '../common/constants';
import { debounced, getCurrentEditor, isSupportedLanguage } from '../common/utils';
import { divideDecoratedBlocks } from '../logics/decorate';

export function addHighlight() {
    let updateDecorations = loadDecorator(loadConfigs());
    updateDecorations();
    // [AddEventListeners]
    vscode.workspace.onDidOpenTextDocument(updateDecorations);
    vscode.workspace.onDidChangeTextDocument(updateDecorations);
    vscode.workspace.onDidChangeConfiguration(() => {
        updateDecorations = loadDecorator(loadConfigs());
        updateDecorations();
    });
    vscode.window.onDidChangeActiveTextEditor(updateDecorations);
    vscode.window.onDidChangeVisibleTextEditors(updateDecorations);
    vscode.window.onDidChangeTextEditorVisibleRanges(updateDecorations); // [/]
}

function loadConfigs() {
    const gormTagKey = vscode.workspace.getConfiguration(configKey).get(configGormTagKey) as string;
    // The style created earlier has higher priority
    const keyStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configKeyColor) as string
    });
    const itemStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueItemColor) as string
    });
    const gapStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueGapColor) as string
    });
    const optionStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configValueOptionColor) as string
    });
    const branchStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configOptionBranchColor)
    });
    const tagStyle = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration(configKey).get(configTextColor),
        backgroundColor: vscode.workspace
            .getConfiguration(configKey)
            .get(configBackgroundColor) as string
    });
    const delay =
        vscode.workspace.getConfiguration(configKey).get<number>(configDebounceTimeout) ?? 0;
    return {
        gormTagKey,
        keyStyle,
        itemStyle,
        gapStyle,
        optionStyle,
        branchStyle,
        tagStyle,
        delay
    };
}

function loadDecorator(config: {
    keyStyle: vscode.TextEditorDecorationType;
    itemStyle: vscode.TextEditorDecorationType;
    optionStyle: vscode.TextEditorDecorationType;
    branchStyle: vscode.TextEditorDecorationType;
    gapStyle: vscode.TextEditorDecorationType;
    tagStyle: vscode.TextEditorDecorationType;
    gormTagKey: string;
    delay: number;
}) {
    const { keyStyle, itemStyle, optionStyle, branchStyle, gapStyle, tagStyle, gormTagKey, delay } =
        config;
    return debounced(async () => {
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
        editor.setDecorations(gapStyle, gapRanges); // [/]
    }, delay);
}
