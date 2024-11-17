export const regexpMatchTags: RegExp = /([a-zA-Z_]+[a-zA-Z0-9_]*|})\s*[^(/\*.*\*/)|=]*\s*`.+`/;

// [TagStringSeparators]
export const keyValueSeparator = 'key_value';
export const valueItemsSeparator = 'value_items';
export const valueBorder = 'value_border';
export const itemOptionSeparator = 'item_option';
export const tagBorder = 'tag_border';
export const separators = {
    [keyValueSeparator]: ':',
    [valueItemsSeparator]: ',',
    [itemOptionSeparator]: '=',
    [valueBorder]: '"',
    [tagBorder]: '`'
}; // [/]
