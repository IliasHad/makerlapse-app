import React from 'react';
import ReactDOM from 'react-dom';
import Snipper from './Snipper';

const render = (Component) => {
  ReactDOM.render(
      <Component />,
    document.getElementById('root'),
  );
};

render(Snipper);

if (module.hot) {
  module.hot.accept('./Snipper', () => {
    // eslint-disable-next-line
    const nextApp = require('./Snipper').default;
    render(nextApp);
  });
}