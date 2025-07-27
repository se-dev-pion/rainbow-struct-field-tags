export const langGolang = 'go';
export const langGoctl = 'goctl';
export const supportedLanguages = [langGolang, langGoctl];
export const regexpMatchTags = /([a-zA-Z_]+[a-zA-Z0-9_]*|})\s*[^(/\*.*\*/)|=]*\s*`.+`/;

// [TagStringSeparators]
export const comma = ',';
export const colon = ':';
export const semiColon = ';';
export const equals = '=';
export const doubleQuote = '"';
export const backQuote = '`'; // [/]

// [ConfigurationKeys]
export const configKey = 'rainbow-struct-field-tags';
export const configKeyColor = 'key-color';
export const configValueItemColor = 'value-item-color';
export const configValueOptionColor = 'value-option-color';
export const configOptionBranchColor = 'option-branch-color';
export const configValueGapColor = 'value-gap-color';
export const configBackgroundColor = 'background-color';
export const configTextColor = 'text-color';
export const configGormTagKey = 'gorm-tag-key'; // [/]

// [GrammerMarkers]
export const singleLineAnnotationSign = '//';
export const multiLineAnnotationStart = '/*';
export const multiLineAnnotationEnd = '*/';
export const singleLineStringSign = '"'; // [/]

// [GormRelatedConstants]
export const gormTagItemCommentKey = 'comment';
export const gormIndexTagKeys = ['index', 'uniqueIndex']; // [/]
