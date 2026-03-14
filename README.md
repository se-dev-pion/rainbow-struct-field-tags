# Rainbow Struct Field Tags

English | [中文](README.zh.md)

![GitHub package.json version](https://img.shields.io/github/package-json/v/se-dev-pion/rainbow-struct-field-tags?color=11bb1f) ![GitHub License](https://img.shields.io/github/license/se-dev-pion/rainbow-struct-field-tags?color=282661) [![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/se-dev-pion.rainbow-struct-field-tags?label=ms-market+downloads&color=0078d4)](https://marketplace.visualstudio.com/items?itemName=se-dev-pion.rainbow-struct-field-tags) [![Open VSX Downloads](https://img.shields.io/open-vsx/dt/se-dev-pion/rainbow-struct-field-tags?label=open-vsx+downloads&color=c160ef)](https://open-vsx.org/extension/se-dev-pion/rainbow-struct-field-tags) [![Ask DeepWiki](https://img.shields.io/badge/doc-deepwiki-blue?logo=wikidata
)](https://deepwiki.com/se-dev-pion/rainbow-struct-field-tags)

## Introduction

Highlighting struct field tags in Go that make it easier to read.

1. Automatically adapt to different color themes, and support customized highlighting colors.
2. Support `go-zero` and `gorm`.

## Example

1. Default highlighting in `Abyss` Theme

    |||
    |-|-|
    |![go_abyss.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_abyss.png)|![goctl_abyss.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_abyss.png)|

2. Default highlighting in `Catppuccin Latte` Theme

    |||
    |-|-|
    |![go_catppuccin_latte.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_catppuccin_latte.png)|![goctl_catppuccin_latte.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_catppuccin_latte.png)|

3. Customized highlighting

    |||
    |-|-|
    |![go_custom.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_custom.png)|![goctl_custom.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_custom.png)|

4. How to customize highlighting colors

        As showing below, open the Settings and search "rainbow-struct-field-tags", then you can change settings.
    ![settings.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/settings.png)

## Extension Settings

- `rainbow-struct-field-tags.key-color`: Highlight color of keys in struct field tags.
- `rainbow-struct-field-tags.value-item-color`: Highlight color of items in struct field tag values.
- `rainbow-struct-field-tags.value-option-color`: Highlight color of options in struct field tag values.
- `rainbow-struct-field-tags.option-branch-color`: Highlight color of branches in struct field tag values.
- `rainbow-struct-field-tags.value-gap-color`: Highlight color of gaps between items struct field tag values.
- `rainbow-struct-field-tags.background-color`: Background color of struct field tag strings.
- `rainbow-struct-field-tags.text-color`: Basic text color of struct field tag strings.
- `rainbow-struct-field-tags.gorm-tag-key`: Key to be recognized as gorm tags.
- `rainbow-struct-field-tags.debounce-timeout`: The debounce timeout milliseconds of redecorate on input, greater for less device requirements and less for less delay.
