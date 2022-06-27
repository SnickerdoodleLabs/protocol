import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import App from './containers/MainContainer';

render(<App />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
