export const regexpMatchTags: RegExp = /([a-zA-Z_]+[a-zA-Z0-9_]*|})\s*[^(/\*.*\*/)|=]*\s*`.+`/;

// [TagStringSeparators]
export const keyValueSeparator = 'key_value';
export const valueItemsSeparator = 'value_items';
export const valueBorder = 'value_border';
export const itemOptionSeparator = 'item_option';
export const tagBorder = 'tag_border';
export const separators: Record<string, string> = {
    [keyValueSeparator]: ':',
    [valueItemsSeparator]: ',',
    [itemOptionSeparator]: '=',
    [valueBorder]: '"',
    [tagBorder]: '`'
};
export const gormSeparators: Record<string, string> = {
    [valueItemsSeparator]: ';',
    [itemOptionSeparator]: ':'
}; // [/]

// [ConfigurationKeys]
export const configKey = "rainbow-struct-field-tags";
export const configKeyColor = "key-color";
export const configValueItemColor = "value-item-color";
export const configValueOptionColor = "value-option-color";
export const configValueGapColor = "value-gap-color";
export const configBackgroundColor = 'background-color';
export const configTextColor = 'text-color'; // [/]

export const singleLineAnnotationSign = '//';
