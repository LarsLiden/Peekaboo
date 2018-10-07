import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Fabric, loadTheme } from 'office-ui-fabric-react'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import registerServiceWorker from './registerServiceWorker';

/** Required for Office UI Fabric to load icon fonts  */
initializeIcons()
/** Override default colors */
loadTheme({
  palette: {
    /* 'themePrimary': 'red' */
  }
});

ReactDOM.render(
  <Fabric>
    <App />
  </Fabric>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
