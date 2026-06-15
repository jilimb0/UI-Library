import { createApp } from 'vue';
import VButton from './components/VButton.vue';

const app = createApp({
  components: { VButton },
  template: `
    <div style="padding: 2rem; font-family: sans-serif;">
      <h1>Vue + Behaviors Demo</h1>
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <VButton variant="default" @click="log('default')">Default</VButton>
        <VButton variant="destructive" @click="log('destructive')">Destructive</VButton>
        <VButton variant="outline" disabled>Disabled</VButton>
      </div>
    </div>
  `,
  methods: {
    log(label: string) {
      console.log('Vue button clicked:', label);
    },
  },
});

app.mount('#app');
