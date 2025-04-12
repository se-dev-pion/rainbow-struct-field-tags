import vscode from 'vscode';
import { gormSeparators, gormTagKey, itemOptionSeparator, keyValueSeparator, regexpMatchTags, separators, singleLineAnnotationSign, tagBorder, valueBorder, valueItemsSeparator } from '../common/constants';
import { createState, overlapWithMultiLineAnnotationAreas, scanMultiLineAnnotations } from '../common/utils';
import { State } from '../common/types';

export function divideDecoratedBlocks(document: vscode.TextDocument) {
    // [Preparations]
    const tagRanges = new Array<vscode.Range>();
    const keyRanges = new Array<vscode.Range>();
    const itemRanges = new Array<vscode.Range>();
    const optionRanges = new Array<vscode.Range>();
    const gapRanges = new Array<vscode.Range>();
    const lines = document.getText().split('\n');
    const multiLineAnnotationAreas = scanMultiLineAnnotations(document, 0, document.getText().length - 1, new Array<vscode.Range>()); // [/]
    for (let i = 0; i < lines.length; i++) {
        // [SkipNoMatchingLines]
        const line = lines[i];
        if (!regexpMatchTags.test(line)) {
            continue;
        } // [/]
        // [SkipMultiLineAnnotations]
        let matchStr = (regexpMatchTags.exec(line) as RegExpExecArray)[0];
        const start = line.indexOf(matchStr);
        const end = start + matchStr.length - 1;
        const matchArea = new vscode.Range(
            new vscode.Position(i, start),
            new vscode.Position(i, end)
        );
        const overlapAreas = overlapWithMultiLineAnnotationAreas(multiLineAnnotationAreas, matchArea);
        for (const area of overlapAreas) {
            matchStr = matchStr.replace(document.getText(area), '');
        }
        if (!regexpMatchTags.test(matchStr)) {
            continue;
        } // [/]
        // [SkipSingleLineAnnotations]
        const tagLeftBorder = line.indexOf(separators[tagBorder]);
        if (line.slice(0, tagLeftBorder).includes(singleLineAnnotationSign)) {
            continue;
        } // [/]
        // [RecordTagStringRange]
        const tagStart = tagLeftBorder + 1;
        const tagEnd = line.lastIndexOf(separators[tagBorder]);
        recordRange(tagRanges, i, tagLeftBorder, tagEnd + 1); // [/]
        // [KeyRangeRecorder]
        const keyStart = createState(tagStart, -1);
        const recordKeyRange = buildRangeRecorder(keyRanges, i, keyStart); // [/]
        // [ItemRangeRecorder]
        const itemStart = createState(-1, -1);
        const recordItemRange = buildRangeRecorder(itemRanges, i, itemStart); // [/]
        // [OptionRangeRecorder]
        const optionStart = createState(-1, -1);
        const recordOptionRange = buildRangeRecorder(optionRanges, i, optionStart); // [/]
        // [ValueRangeRecorder]
        const recordValueRange = (end: number) => {
            if (optionStart.init()) {
                recordOptionRange(end);
            } else if (itemStart.init()) {
                recordItemRange(end);
            }
        }; // [/]
        let [inValue, inGormTag] = [false, false];
        for (let j = tagStart; j < tagEnd; j++) {
            const char = line[j];
            // [RecordKeyRange]
            if (!inValue && char === separators[keyValueSeparator] && keyStart.init()) {
                recordKeyRange(j);
            } // [/]
            if (char === separators[valueBorder]) {
                // [RecordValueRangeAndSetKeyStart]
                if (inValue) {
                    recordValueRange(j);
                    keyStart.set(j + 1);
                    inGormTag = false;
                } // [/]
                // [SetItemStart]
                else {
                    itemStart.set(j + 1);
                    const keyRange = keyRanges[keyRanges.length - 1];
                    inGormTag = line.slice(keyRange.start.character, keyRange.end.character).trim() === gormTagKey;
                } // [/]
                inValue = !inValue;
            }
            // [RecordItemRange]
            if ((inGormTag && char === gormSeparators[itemOptionSeparator]) || (!inGormTag && char === separators[itemOptionSeparator]) && itemStart.init()) {
                recordItemRange(j);
                optionStart.set(j + 1);
            } // [/]
            if ((inGormTag && char === gormSeparators[valueItemsSeparator]) || (!inGormTag && char === separators[valueItemsSeparator])) {
                // [SkipEmptyValue]
                if (!inValue) {
                    continue;
                } // [/]
                recordRange(gapRanges, i, j, j + 1);
                recordValueRange(j);
                itemStart.set(j + 1);
            }
        }
    }
    return {
        tagRanges,
        keyRanges,
        itemRanges,
        optionRanges,
        gapRanges
    };
}

function recordRange(ranges: vscode.Range[], line: number, start: number, end: number) {
    ranges.push(new vscode.Range(
        new vscode.Position(line, start),
        new vscode.Position(line, end)
    ));
}

function buildRangeRecorder(ranges: vscode.Range[], line: number, start: State<number>) {
    return (end: number) => {
        recordRange(ranges, line, start.get(), end);
        start.reset();
    };
}