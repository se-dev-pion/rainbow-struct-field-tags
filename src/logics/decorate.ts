import vscode from 'vscode';
import {
    backQuote,
    colon,
    comma,
    doubleQuote,
    equals,
    gormIndexTagKeys,
    gormTagItemCommentKey,
    regexpMatchTags,
    semiColon,
    singleLineAnnotationSign,
    singleLineStringSign
} from '../common/constants';
import {
    createState,
    overlapWithMultiLineAnnotationAreas,
    scanMultiLineAnnotations
} from '../common/utils';
import { State } from '../common/types';

export function divideDecoratedBlocks(document: vscode.TextDocument, gormTagKey: string) {
    // [Preparations]
    const tagRanges = new Array<vscode.Range>();
    const keyRanges = new Array<vscode.Range>();
    const itemRanges = new Array<vscode.Range>();
    const optionRanges = new Array<vscode.Range>();
    const branchRanges = new Array<vscode.Range>();
    const gapRanges = new Array<vscode.Range>();
    const lines = document.getText().split('\n');
    const multiLineAnnotationAreas = scanMultiLineAnnotations(
        document,
        0,
        document.getText().length - 1,
        new Array<vscode.Range>()
    ); // [/]
    for (let i = 0; i < lines.length; i++) {
        // [SkipNoMatchingLines]
        const line = lines[i];
        if (!regexpMatchTags.test(line)) {
            continue;
        } // [/]
        // [SkipMultiLineAnnotations]
        let matchStr = regexpMatchTags.exec(line)![0];
        const start = line.indexOf(matchStr);
        const end = start + matchStr.length - 1;
        const matchArea = new vscode.Range(
            new vscode.Position(i, start),
            new vscode.Position(i, end)
        );
        const overlapAreas = overlapWithMultiLineAnnotationAreas(
            multiLineAnnotationAreas,
            matchArea
        );
        for (const area of overlapAreas) {
            matchStr = matchStr.replace(document.getText(area), '');
        }
        if (!regexpMatchTags.test(matchStr)) {
            continue;
        } // [/]
        // [SkipSingleLineAnnotationsAndSingleLineStrings]
        const tagLeftBorder = line.indexOf(backQuote);
        const prefix = line.slice(0, tagLeftBorder);
        if (prefix.includes(singleLineAnnotationSign) || prefix.includes(singleLineStringSign)) {
            continue;
        } // [/]
        // [RecordTagStringRange]
        const tagStart = tagLeftBorder + 1;
        const tagEnd = line.lastIndexOf(backQuote);
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
        // [BranchRangeRecorder]
        const branchStart = createState(-1, -1);
        const recordBranchRange = buildRangeRecorder(branchRanges, i, branchStart); // [/]
        // [ValueRangeRecorder]
        const recordValueRange = (end: number) => {
            if (branchStart.init()) {
                recordBranchRange(end);
            } else if (optionStart.init()) {
                recordOptionRange(end);
            } else if (itemStart.init()) {
                recordItemRange(end);
            }
        }; // [/]
        // [GapRangeRecorder]
        const recordGapRange = (end: number) => {
            recordRange(gapRanges, i, end, end + 1);
        }; // [/]
        let [inValue, inGormTag, inGormComment, inGormIndex] = new Array<boolean>(4).fill(false);
        for (let j = tagStart; j < tagEnd; j++) {
            const char = line[j];
            // [RecordKeyRange]
            if (!inValue && char === colon && keyStart.init()) {
                recordKeyRange(j);
            } // [/]
            if (char === doubleQuote) {
                // [RecordValueRangeAndSetKeyStart]
                if (inValue) {
                    recordValueRange(j);
                    keyStart.set(j + 1);
                    // [ClearGormContext]
                    inGormTag = false;
                    inGormComment = false;
                    inGormIndex = false; // [/]
                } // [/]
                // [SetItemStart]
                else {
                    itemStart.set(j + 1);
                    // [InitGormContext]
                    const keyRange = keyRanges[keyRanges.length - 1];
                    inGormTag =
                        line.slice(keyRange.start.character, keyRange.end.character).trim() ===
                        gormTagKey; // [/]
                } // [/]
                inValue = !inValue;
            }
            // [SkipHandleCommentTagOfGorm]
            if (inGormComment) {
                continue;
            } // [/]
            if (inGormTag) {
                // [SkipEscapedChar] https://gorm.io/docs/models.html#Fields-Tags
                if (char === '\\') {
                    j++;
                    continue;
                } // [/]
                switch (char) {
                    case colon:
                        // https://gorm.io/docs/indexes.html#Index-Tag
                        if (inGormIndex) {
                            recordOptionRange(j);
                            branchStart.set(j + 1);
                        }
                        // https://gorm.io/docs/models.html#Fields-Tags
                        else {
                            recordItemRange(j);
                            optionStart.set(j + 1);
                            // [InitGormSubContext]
                            const itemRange = itemRanges[itemRanges.length - 1];
                            const item = line
                                .slice(itemRange.start.character, itemRange.end.character)
                                .trim();
                            inGormComment = item === gormTagItemCommentKey;
                            inGormIndex = gormIndexTagKeys.includes(item); // [/]
                        }
                        break;
                    // https://gorm.io/docs/models.html#Fields-Tags
                    case semiColon:
                        // [SkipEmptyValue]
                        if (!inValue) {
                            continue;
                        } // [/]
                        recordGapRange(j);
                        recordValueRange(j);
                        itemStart.set(j + 1);
                        inGormIndex = false;
                        break;
                    // https://gorm.io/docs/indexes.html#Index-Tag
                    case comma:
                        // [RecordGapBetweenSubTagsOfIndexTag]
                        if (inGormIndex) {
                            recordGapRange(j);
                        } // [/]
                        // [RecordSubTagOfIndexTag]
                        if (branchStart.init()) {
                            recordBranchRange(j);
                            optionStart.set(j + 1);
                        } // [/]
                }
            } else {
                switch (char) {
                    case equals:
                        if (itemStart.init()) {
                            recordItemRange(j);
                            optionStart.set(j + 1);
                        }
                        break;
                    case comma:
                        // [SkipEmptyValue]
                        if (!inValue) {
                            continue;
                        } // [/]
                        recordRange(gapRanges, i, j, j + 1);
                        recordValueRange(j);
                        itemStart.set(j + 1);
                        break;
                }
            }
        }
    }
    return {
        tagRanges,
        keyRanges,
        itemRanges,
        optionRanges,
        branchRanges,
        gapRanges
    };
}

function recordRange(ranges: vscode.Range[], line: number, start: number, end: number) {
    ranges.push(new vscode.Range(new vscode.Position(line, start), new vscode.Position(line, end)));
}

function buildRangeRecorder(ranges: vscode.Range[], line: number, start: State<number>) {
    return (end: number) => {
        recordRange(ranges, line, start.get(), end);
        start.reset();
    };
}
