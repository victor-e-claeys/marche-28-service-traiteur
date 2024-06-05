/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VNumberInput,
  },
  defaults: {
    VBtn: {
      variant: 'flat',  // Set default variant
      rounded: '0',        // Set default rounded size, options: 'sm', 'md', 'lg', 'xl', true (true is equivalent to 'md')
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#748752',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
