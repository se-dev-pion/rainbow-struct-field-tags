import vscode from 'vscode';
import { configValueItemColor, configKey, configKeyColor, configValueOptionColor, gormSeparators, itemOptionSeparator, keyValueSeparator, regexpMatchTags, separators, tagBorder, valueBorder, valueItemsSeparator, configValueGapColor, singleLineAnnotationSign, configBackgroundColor, configTextColor, multiLineAnnotationEnd, multiLineAnnotationStart } from './common';

export function highlightStructFieldTags(_context: vscode.ExtensionContext) {
    const updateDecorations = () => {
        // [DefineStyles] The style created earlier has higher priority
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
        });
        const tagStyle = vscode.window.createTextEditorDecorationType({
            color: vscode.workspace.getConfiguration(configKey).get(configTextColor),
            backgroundColor: vscode.workspace.getConfiguration(configKey).get(configBackgroundColor) as string,
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
        const tagRanges = new Array<vscode.Range>();
        const keyRanges = new Array<vscode.Range>();
        const itemRanges = new Array<vscode.Range>();
        const optionRanges = new Array<vscode.Range>();
        const gapRanges = new Array<vscode.Range>();
        const lines: string[] = document.getText().split('\n');
        const multiLineAnnotationAreas: vscode.Range[] = scanMultiLineAnnotations(document, 0, document.getText().length - 1, new Array<vscode.Range>()); // [/]
        for (let i = 0; i < lines.length; i++) {
            // [SkipNoMatchingLines]
            const line: string = lines[i];
            if (!regexpMatchTags.test(line)) {
                continue;
            } // [/]
            // [SkipMultiLineAnnotations]
            let matchStr: string = (regexpMatchTags.exec(line) as RegExpExecArray)[0];
            const start: number = line.indexOf(matchStr);
            const end: number = start + matchStr.length - 1;
            const matchArea = new vscode.Range(
                new vscode.Position(i, start),
                new vscode.Position(i, end)
            );
            const overlapAreas: vscode.Range[] = overlapWithMultiLineAnnotationAreas(multiLineAnnotationAreas, matchArea);
            for (const area of overlapAreas) {
                matchStr = matchStr.replace(document.getText(area), '');
            }
            if (!regexpMatchTags.test(matchStr)) {
                continue;
            } // [/]
            // [SkipSingleLineAnnotations]
            const tagLeftBorder: number = line.indexOf(separators[tagBorder]);
            if (line.slice(0, tagLeftBorder).includes(singleLineAnnotationSign)) {
                continue;
            } // [/]
            // [RecordTagStringRange]
            const tagStart: number = tagLeftBorder + 1;
            const tagEnd: number = line.lastIndexOf(separators[tagBorder]);
            recordRange(tagRanges, i, tagLeftBorder, tagEnd + 1); // [/]
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
                } else if (itemStart !== -1) {
                    recordItemRange(end);
                }
            }; // [/]
            let [inValue, gormTag] = [false, false];
            for (let j: number = tagStart; j < tagEnd; j++) {
                const char: string = line[j];
                // [RecordKeyRange]
                if (!inValue && char === separators[keyValueSeparator] && keyStart !== -1) {
                    recordKeyRange(j);
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
                        const keyRange: vscode.Range = keyRanges[keyRanges.length - 1];
                        gormTag = line.slice(keyRange.start.character, keyRange.end.character).trim() === 'gorm';
                    } // [/]
                    inValue = !inValue;
                }
                // [RecordItemRange]
                if ((gormTag && char === gormSeparators[itemOptionSeparator]) || (!gormTag && char === separators[itemOptionSeparator]) && itemStart !== -1) {
                    recordItemRange(j);
                    optionStart = j + 1;
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
            }
        }
        // [ApplyDecorations]
        editor.setDecorations(tagStyle, tagRanges);
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

function scanMultiLineAnnotations(document: vscode.TextDocument, offset: number, end: number, areas: vscode.Range[]): vscode.Range[] {
    let areaStart: number = document.getText().slice(offset).indexOf(multiLineAnnotationStart);
    if (areaStart !== -1) {
        areaStart += offset;
        const offsetWithOutHead: number = areaStart + 2;
        let areaEnd: number = document.getText().slice(offsetWithOutHead).indexOf(multiLineAnnotationEnd);
        areaEnd = Math.min(end, areaEnd === -1 ? end : areaEnd + offsetWithOutHead + 2);
        areas.push(new vscode.Range(document.positionAt(areaStart), document.positionAt(areaEnd)));
        scanMultiLineAnnotations(document, areaEnd, end, areas);
    }
    return areas;
}

function overlapWithMultiLineAnnotationAreas(annotationAreas: vscode.Range[], matchArea: vscode.Range): vscode.Range[] {
    if (annotationAreas.length === 0) {
        return [];
    }
    let annotationArea: vscode.Range;
    const overlaps = new Array<vscode.Range>();
    while (annotationAreas.length > 0) {
        annotationArea = annotationAreas[0];
        if (annotationArea.start.isAfter(matchArea.end)) {
            break;
        }
        const overlap: vscode.Range | undefined = annotationArea.intersection(matchArea);
        if (overlap) {
            overlaps.push(overlap);
        }
        annotationAreas.shift();
    }
    return overlaps;
}