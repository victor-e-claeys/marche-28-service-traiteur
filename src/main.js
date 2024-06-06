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
import DOMPurify from 'dompurify';
import 'dayjs/locale/fr';
import './style.css';
dayjs.extend(relativeTime);
dayjs.locale('fr');

const app = createApp(App)

app.config.globalProperties.dayjs = dayjs;
app.config.globalProperties.sanitizeHTML = DOMPurify.sanitize;
app.config.globalProperties.moneyFormatter = new Intl.NumberFormat(
  'fr-CA', 
  {
    style: 'currency',
    currency: 'CAD',
  }
);
app.config.globalProperties.selectionTypes = {
  pret_a_manger: "Prêt à manger",
  pret_a_cuisiner: "Prêt à cuisiner"
};

registerPlugins(app)

app.mount('#app')
