import React from 'react'
import * as ReactDOM from 'react-dom/client';
import { HomePage } from './pages/Home';

const App = () => (
  <HomePage />
);

function render() {
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App/>);
}

render();
