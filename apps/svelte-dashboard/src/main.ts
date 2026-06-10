import { generateCSSVariables } from '@ui-construction-library/tokens';
import '@ui-construction-library/styles/styles.css';
import App from './App.svelte';

const tokenStyle = document.createElement('style');
tokenStyle.textContent = generateCSSVariables();
document.head.appendChild(tokenStyle);

new App({ target: document.getElementById('app') as HTMLElement });
