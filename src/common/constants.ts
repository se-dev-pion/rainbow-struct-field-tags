export const langGolang = 'go';
export const langGoctl = 'goctl';
export const supportedLanguages = [langGolang, langGoctl];
export const regexpMatchTags = /([a-zA-Z_]+[a-zA-Z0-9_]*|})\s*[^(/\*.*\*/)|=]*\s*`.+`/;

// [TagStringSeparators]
export const keyValueSeparator = 'key_value';
export const valueItemsSeparator = 'value_items';
export const valueBorder = 'value_border';
export const itemOptionSeparator = 'item_option';
export const optionBranchSeparator = 'option_branch';
export const tagBorder = 'tag_border';
export const separators = {
    [keyValueSeparator]: ':',
    [valueItemsSeparator]: ',',
    [itemOptionSeparator]: '=',
    [valueBorder]: '"',
    [tagBorder]: '`'
} as const; // [/]

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
export const gormSeparators = {
    [valueItemsSeparator]: ';',
    [itemOptionSeparator]: ':',
    [optionBranchSeparator]: ','
} as const;
export const gormTagItemComment = 'comment' + gormSeparators[itemOptionSeparator];
export const gormIndexTagKeys = ['index', 'uniqueIndex']; // [/]
