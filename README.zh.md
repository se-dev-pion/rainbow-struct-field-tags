# Rainbow Struct Field Tags

[English](README.md) | 中文

![GitHub package.json version](https://img.shields.io/github/package-json/v/se-dev-pion/rainbow-struct-field-tags?color=11bb1f) ![GitHub License](https://img.shields.io/github/license/se-dev-pion/rainbow-struct-field-tags?color=282661) [![Open VSX Downloads](https://img.shields.io/open-vsx/dt/se-dev-pion/rainbow-struct-field-tags?label=open-vsx+downloads&color=c160ef)](https://open-vsx.org/extension/se-dev-pion/rainbow-struct-field-tags) [![Ask DeepWiki](https://img.shields.io/badge/doc-deepwiki-blue?logo=wikidata
)](https://deepwiki.com/se-dev-pion/rainbow-struct-field-tags)

## 简介

高亮显示Go中的结构字段标签，使其更易于阅读。

1. 自动适配不同颜色主题，也支持用户自定义配色。
2. 支持`go-zero`和`gorm`。

## 示例

1. 在`Abyss`主题下的默认高亮

    |||
    |-|-|
    |![go_abyss.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_abyss.png)|![goctl_abyss.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_abyss.png)|

2. 在`Catppuccin Latte`主题下的默认高亮

    |||
    |-|-|
    |![go_catppuccin_latte.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_catppuccin_latte.png)|![goctl_catppuccin_latte.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_catppuccin_latte.png)|

3. 自定义高亮

    |||
    |-|-|
    |![go_custom.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/go_custom.png)|![goctl_custom.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/goctl_custom.png)|

4. 如何自定义高亮颜色

        如下图所示，打开设置并搜索"rainbow-struct-field-tags"，然后你就可以修改配置了。
    ![settings.png](https://raw.githubusercontent.com/se-dev-pion/rainbow-struct-field-tags/refs/heads/main/images/settings.png)

## 扩展设置

- `rainbow-struct-field-tags.key-color`: 结构体字段标签中键的高亮颜色。
- `rainbow-struct-field-tags.value-item-color`: 结构体字段标签值中项的高亮颜色。
- `rainbow-struct-field-tags.value-option-color`: 结构体字段标签值中选项的高亮颜色。
- `rainbow-struct-field-tags.option-branch-color`: 结构体字段标签值中分支的高亮颜色。
- `rainbow-struct-field-tags.value-gap-color`: 结构体字段标签值中项之间间隔的高亮颜色。
- `rainbow-struct-field-tags.background-color`: 结构体字段标签字符串的背景颜色。
- `rainbow-struct-field-tags.text-color`: 结构体字段标签字符串的基本文本颜色。
- `rainbow-struct-field-tags.gorm-tag-key`: 被识别为 gorm 标签的键。
- `rainbow-struct-field-tags.debounce-timeout`: 输入时重新装饰的防抖超时毫秒数，越大对设备要求越低，越小延迟越低。
