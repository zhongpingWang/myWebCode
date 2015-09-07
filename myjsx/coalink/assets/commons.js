import 'react/addons'
import Alt from 'alt'
import 'jquery'
import {Styles} from './components/flat-ui'

// Needed for onTouchTap, remove then React 1.0 release.
// https://github.com/zilverline/react-tap-event-plugin
let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// TODO: 设置缺省的theme
let theme = Styles.ThemeManager();
let alt = new Alt();

module.exports = {
    muiTheme: theme,
    alt: alt
};
