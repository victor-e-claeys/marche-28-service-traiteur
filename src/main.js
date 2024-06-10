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
//import './reset.css';
import './style.css';
dayjs.extend(relativeTime);
dayjs.locale('fr');

const app = createApp(App)

app.config.globalProperties = Object.assign(
  {
    dayjs,
    delay: ms => new Promise(res => setTimeout(res, ms)),
    moneyFormatter: new Intl.NumberFormat(
      'fr-CA', 
      {
        style: 'currency',
        currency: 'CAD',
      }
    ),
    sanitizeHTML: DOMPurify.sanitize,
    selectionTypes: {
      pret_a_manger: "Prêt à manger",
      pret_a_cuisiner: "Prêt à cuisiner"
    },
    uniqid(prefix = "", random = false) {
      const sec = Date.now() * 1000 + Math.random() * 1000;
      const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
      return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
    }
  }, 
  app.config.globalProperties
);

registerPlugins(app)

app.mount('#app')
