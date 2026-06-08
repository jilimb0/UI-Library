import { generateCSSVariables } from '@ui-construction-library/tokens';
import '@ui-construction-library/styles/styles.css';
import { createApp } from 'vue';
import App from './App.vue';

const tokenStyle = document.createElement('style');
tokenStyle.textContent = generateCSSVariables();
document.head.appendChild(tokenStyle);

createApp(App).mount('#app');
