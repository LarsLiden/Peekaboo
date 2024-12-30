/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Fabric, loadTheme } from 'office-ui-fabric-react'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import registerServiceWorker from './registerServiceWorker';

/** Required for Office UI Fabric to load icon fonts  */
initializeIcons()

loadTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#0b0b0b',
    neutralLighter: '#151515',
    neutralLight: '#252525',
    neutralQuaternaryAlt: '#2f2f2f',
    neutralQuaternary: '#373737',
    neutralTertiaryAlt: '#595959',
    neutralTertiary: '#faf8f8',
    neutralSecondary: '#fbf9f9',
    neutralPrimaryAlt: '#fcfafa',
    neutralPrimary: '#f7f5f5',
    neutralDark: '#fdfdfd',
    black: '#fefefe',
    white: '#000000',
  }
});



ReactDOM.render(
  <Fabric>
    <App />
  </Fabric>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
