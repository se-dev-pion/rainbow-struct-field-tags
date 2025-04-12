import vscode from 'vscode';
import { ErrNoActiveEditor } from './errors';
import { multiLineAnnotationEnd, multiLineAnnotationStart, supportedLanguages } from './constants';

export function getCurrentEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw ErrNoActiveEditor;
    }
    return editor;
}

export function debounced<T extends Function>(func: T, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    const f = (...args: any[]): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
    return f as Function as T;
}

export function createState<T>(originValue: T, defaultValue: T) {
    let value = originValue;
    return {
        get: () => value,
        set: (newValue: T) => {
            value = newValue;
        },
        reset: () => {
            value = defaultValue;
        },
        init: () => value !== defaultValue
    } as const;
}

export function overlapWithMultiLineAnnotationAreas(annotationAreas: vscode.Range[], matchArea: vscode.Range) {
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
        const overlap = annotationArea.intersection(matchArea);
        if (overlap) {
            overlaps.push(overlap);
        }
        annotationAreas.shift();
    }
    return overlaps;
}

export function scanMultiLineAnnotations(document: vscode.TextDocument, offset: number, end: number, areas: vscode.Range[]) {
    let areaStart = document.getText().slice(offset).indexOf(multiLineAnnotationStart);
    if (areaStart !== -1) {
        areaStart += offset;
        const offsetWithOutHead = areaStart + 2;
        let areaEnd = document.getText().slice(offsetWithOutHead).indexOf(multiLineAnnotationEnd);
        areaEnd = Math.min(end, areaEnd === -1 ? end : areaEnd + offsetWithOutHead + 2);
        areas.push(new vscode.Range(document.positionAt(areaStart), document.positionAt(areaEnd)));
        scanMultiLineAnnotations(document, areaEnd, end, areas);
    }
    return areas;
}

export function isSupportedLanguage(lang: string) {
    return supportedLanguages.includes(lang);
}
