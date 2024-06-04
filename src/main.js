/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import './style.css';
dayjs.extend(relativeTime);
dayjs.locale('fr');

const app = createApp(App)

app.config.globalProperties.dayjs = dayjs;
app.config.globalProperties.moneyFormatter = new Intl.NumberFormat(
  'fr-CA', 
  {
    style: 'currency',
    currency: 'CAD',
  }
);

registerPlugins(app)

app.mount('#app')
