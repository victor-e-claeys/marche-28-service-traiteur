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
import updateLocale from 'dayjs/plugin/updateLocale';
import DOMPurify from 'dompurify';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/fr';
//import './reset.css';
import './style.css';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale('fr');
dayjs.extend(utc);
dayjs.updateLocale('fr', {
  monthsShort: [
    "JAN", // janvier
    "FEV", // février
    "MAR", // mars
    "AVR", // avril
    "MAI", // mai
    "JUN", // juin
    "JUL", // juillet
    "AOU", // août
    "SEP", // septembre
    "OCT", // octobre
    "NOV", // novembre
    "DEC"  // décembre
  ]
})

const app = createApp(App)

app.config.globalProperties = Object.assign(
  {
    dayjs,
    delay: ms => new Promise(res => setTimeout(res, ms)),
    menuEditable: function(){
      let editable;
      return {
        get: () => editable,
        set: (value) => editable = value
      };
    }(),
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

app.mount('#app');
