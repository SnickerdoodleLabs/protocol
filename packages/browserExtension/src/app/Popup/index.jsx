import React from 'react';
import { render } from 'react-dom';

import '@app/Popup/index.css';
import App from '@app/Popup/containers/MainContainer';

render(<App />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
