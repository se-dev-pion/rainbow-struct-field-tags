import vscode from 'vscode';
import { configValueItemColor, configKey, configKeyColor, configValueOptionColor, gormSeparators, itemOptionSeparator, keyValueSeparator, regexpMatchTags, separators, tagBorder, valueBorder, valueItemsSeparator, configValueGapColor } from './common';

export function highlightStructFieldTags(_context: vscode.ExtensionContext) {
    const updateDecorations = () => {
        // [DefineStyles]
        const keyStyle = vscode.window.createTextEditorDecorationType({
            color: vscode.workspace.getConfiguration(configKey).get(configKeyColor) as string,
        });
        const itemStyle = vscode.window.createTextEditorDecorationType({
            color: vscode.workspace.getConfiguration(configKey).get(configValueItemColor) as string,
        });
        const optionStyle = vscode.window.createTextEditorDecorationType({
            color: vscode.workspace.getConfiguration(configKey).get(configValueOptionColor) as string,
        });
        const gapColor = vscode.window.createTextEditorDecorationType({
            color: vscode.workspace.getConfiguration(configKey).get(configValueGapColor) as string,
        }); // [/]
        // [CheckActiveEditor]
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        } // [/]
        // [CheckDocumentLanguage]
        const document: vscode.TextDocument = editor.document;
        if (document.languageId !== 'go') {
            return;
        } // [/]
        // [Preparations]
        const keyRanges = new Array<vscode.Range>();
        const itemRanges = new Array<vscode.Range>();
        const optionRanges = new Array<vscode.Range>();
        const gapRanges = new Array<vscode.Range>();
        const lines: string[] = document.getText().split('\n'); // [/]
        for (let i = 0; i < lines.length; i++) {
            // [SkipNoMatchingLines]
            const line: string = lines[i];
            if (!regexpMatchTags.test(line)) {
                continue;
            } // [/]
            // [LimitTagStringRange]
            const tagStart: number = line.indexOf(separators[tagBorder]) + 1;
            const tagEnd: number = line.lastIndexOf(separators[tagBorder]); // [/]
            // [KeyRangeRecorder]
            let keyStart: number = tagStart;
            const recordKeyRange = (end: number) => {
                recordRange(keyRanges, i, keyStart, end);
                keyStart = -1;
            }; // [/]
            // [ItemRangeRecorder]
            let itemStart: number = -1;
            const recordItemRange = (end: number) => {
                recordRange(itemRanges, i, itemStart, end);
                itemStart = -1;
            }; // [/]
            // [OptionRangeRecorder]
            let optionStart: number = -1;
            const recordOptionRange = (end: number) => {
                recordRange(optionRanges, i, optionStart, end);
                optionStart = -1;
            }; // [/]
            // [ValueRangeRecorder]
            const recordValueRange = (end: number) => {
                if (optionStart !== -1) {
                    recordOptionRange(end);
                }
                else if (itemStart !== -1) {
                    recordItemRange(end);
                }
            }; // [/]
            let inValue: boolean = false;
            let gormTag: boolean = false;
            let j = tagStart;
            let char: string;
            while (j < tagEnd) {
                char = line[j];
                // [RecordKeyRange]
                if (!inValue && char === separators[keyValueSeparator]) {
                    if (keyStart !== -1) {
                        recordKeyRange(j);
                    }
                } // [/]
                if (char === separators[valueBorder]) {
                    // [RecordValueRangeAndSetKeyStart]
                    if (inValue) {
                        recordValueRange(j);
                        keyStart = j + 1;
                        gormTag = false;
                    } // [/]
                    // [SetItemStart]
                    else {
                        itemStart = j + 1;
                        const keyRange = keyRanges[keyRanges.length - 1];
                        gormTag = line.slice(keyRange.start.character, keyRange.end.character).trim() === 'gorm';
                    } // [/]
                    inValue = !inValue;
                }
                // [RecordItemRange]
                if ((gormTag && char === gormSeparators[itemOptionSeparator]) || (!gormTag && char === separators[itemOptionSeparator])) {
                    if (itemStart !== -1) {
                        recordItemRange(j);
                        optionStart = j + 1;
                    }
                } // [/]
                if ((gormTag && char === gormSeparators[valueItemsSeparator]) || (!gormTag && char === separators[valueItemsSeparator])) {
                    // [SkipEmptyValue]
                    if (!inValue) {
                        continue;
                    } // [/]
                    recordRange(gapRanges, i, j, j + 1);
                    // [RecordOptionRangeAndStartFindingNextOption]
                    if (optionStart !== -1) {
                        recordOptionRange(j);
                    }  // [/]
                    // [RecordItemRangeAndStartFindingNextItem]
                    else if (itemStart !== -1) {
                        recordItemRange(j);
                    } // [/]
                    itemStart = j + 1;
                }
                j++;
            }
        }
        // [ApplyDecorations]
        editor.setDecorations(keyStyle, keyRanges);
        editor.setDecorations(itemStyle, itemRanges);
        editor.setDecorations(optionStyle, optionRanges);
        editor.setDecorations(gapColor, gapRanges); // [/]
    };
    updateDecorations();
    // [AddEventListeners]
    vscode.workspace.onDidOpenTextDocument(updateDecorations);
    vscode.workspace.onDidChangeTextDocument(updateDecorations);
    vscode.workspace.onDidChangeConfiguration(updateDecorations);
    vscode.window.onDidChangeActiveTextEditor(updateDecorations);
    vscode.window.onDidChangeVisibleTextEditors(updateDecorations);
    vscode.window.onDidChangeTextEditorVisibleRanges(updateDecorations); // [/]
}

function recordRange(ranges: vscode.Range[], line: number, start: number, end: number): void {
    ranges.push(new vscode.Range(
        new vscode.Position(line, start),
        new vscode.Position(line, end)
    ));
}