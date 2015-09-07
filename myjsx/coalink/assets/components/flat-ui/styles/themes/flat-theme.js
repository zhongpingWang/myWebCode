import Colors from '../colors'
import Font from '../fonts'
import Spacing from '../spacing'
import ColorManipulator from '../../utils/color-manipulator'


/**
 *  扁平、简洁的样式，适合于正式的商务类型风格。
 */

let FlatTheme = {
    spacing: Spacing,
    contentFontFamily: 'Verdana, "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',

    getPalette() {
        return {
            primary1Color: Colors.cyan500,
            primary2Color: Colors.cyan700,
            primary3Color: Colors.cyan100,
            accent1Color: Colors.pinkA200,
            accent2Color: Colors.pinkA400,
            accent3Color: Colors.pinkA100,
            textColor: Colors.darkBlack,
            canvasColor: Colors.white,
            borderColor: Colors.grey300,
            disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        };
    },
    getComponentThemes(palette, spacing) {
        spacing = spacing || Spacing;
        let obj = {
            appBar: {
                color: palette.primary1Color,
                textColor: Colors.darkWhite,
                height: spacing.desktopKeylineIncrement,
            },
            button: {
                height: 36,
                minWidth: 88,
                iconButtonSize: spacing.iconSize * 2,
            },
            flatButton: {
                color: palette.canvasColor,
                textColor: palette.textColor,
                primaryTextColor: palette.accent1Color,
                secondaryTextColor: palette.primary1Color,
            },
            paper: {
                backgroundColor: Colors.white,
            },
            raisedButton: {
                color: Colors.white,
                textColor: palette.textColor,
                //primaryColor: palette.accent1Color,
                //primaryTextColor: Colors.white,
                //secondaryColor: palette.primary1Color,
                //secondaryTextColor: Colors.white,

                // 定制颜色
                defaultColor: Colors.grey50,
                primaryColor: Colors.blue1,
                successColor: Colors.green1,
                warningColor: Colors.orange1,
                dangerColor: Colors.red1,

                defaultTextColor: Font.Color1,
                primaryTextColor: Font.Color12,
                successTextColor: Font.Color12,
                warningTextColor: Font.Color12,
                dangerTextColor: Font.Color12

            },
            tabs: {
                backgroundColor: palette.primary1Color,
            },
            textField: {
                textColor: palette.textColor,
                hintColor: palette.disabledColor,
                floatingLabelColor: palette.textColor,
                disabledTextColor: palette.disabledColor,
                errorColor: Colors.red500,
                focusColor: palette.primary1Color,
                backgroundColor: 'transparent',
                borderColor: palette.borderColor,
            },
        };

        // Properties based on previous properties
        //obj.flatButton.disabledTextColor = ColorManipulator.fade(obj.flatButton.textColor, 0.3);
        //obj.floatingActionButton.disabledColor = ColorManipulator.darken(Colors.white, 0.1);
        //obj.floatingActionButton.disabledTextColor = ColorManipulator.fade(palette.textColor, 0.3);
        //obj.raisedButton.disabledColor = ColorManipulator.darken(obj.raisedButton.color, 0.1);
        //obj.raisedButton.disabledTextColor = ColorManipulator.fade(obj.raisedButton.textColor, 0.3);
        //obj.slider.handleSizeActive = obj.slider.handleSize * 2;
        //obj.toggle.trackRequiredColor = ColorManipulator.fade(obj.toggle.thumbRequiredColor, 0.5);

        return obj;
    },
};

export default FlatTheme
