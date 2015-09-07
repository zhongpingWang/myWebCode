import Extend from '../utils/extend'

/*
 * 主题样式选择器，对选中的主题可以进行通过调用set*等方式对主题进行定制。
 * 创建新的主题，可以在模板主题flat-theme上进行扩展，未指定的变量将使用模板主题中的变量。
 */

const Types = {
  FLAT: require('./themes/flat-theme'),
};

let ThemeManager = (type) => {

    // 未指定类型时使用Flat的样式。
    type = type || 'FLAT';
    let theme = Types[type];

    if (process.env.NODE_ENV !== 'production' && theme == undefined) {
        let message = 'There is no theme type named ' + type;
        console.error(message);
    }

    return {
        types: Types,
        template: Types.FLAT, // 模板主题

        spacing: theme.spacing,
        contentFontFamily: theme.contentFontFamily,
        palette: theme.getPalette(),
        component: theme.getComponentThemes(theme.getPalette()),

        switchTheme(type) {
            // TODO: 添加切换主题的方法，切换时需要确保theme起效。
        },

        getCurrentTheme() {
            return this;
        },

        // Component gets updated to reflect palette changes.
        setTheme(newTheme) {
            this.setSpacing(newTheme.spacing);
            this.setPalette(newTheme.getPalette());
            this.setComponentThemes(newTheme.getComponentThemes(newTheme.getPalette()));
        },

        setSpacing(newSpacing) {
            this.spacing = Extend(this.spacing, newSpacing);
            this.component = Extend(this.component, this.template.getComponentThemes(this.palette, this.spacing));
        },

        setPalette(newPalette) {
            this.palette = Extend(this.palette, newPalette);
            this.component = Extend(this.component, this.template.getComponentThemes(this.palette));
        },

        setComponentThemes(overrides) {
            this.component = Extend(this.component, overrides);
        },
    };
};

export default ThemeManager
