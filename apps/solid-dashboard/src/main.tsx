import { generateCSSVariables } from '@ui-construction-library/tokens';
import '@ui-construction-library/styles/styles.css';
import { render } from 'solid-js/web';
import { App } from './App';

const tokenStyle = document.createElement('style');
tokenStyle.textContent = generateCSSVariables();
document.head.appendChild(tokenStyle);

render(() => <App />, document.getElementById('app') as HTMLElement);
