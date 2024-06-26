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
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue'
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VNumberInput,
    VSnackbarQueue
  },
  defaults: {
    VBtn: {
      class: 'py-0',
      variant: 'flat',  // Set default variant
      rounded: '0',        // Set default rounded size, options: 'sm', 'md', 'lg', 'xl', true (true is equivalent to 'md')
      size: "small",
      tag: 'a'
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#B6C369',
          secondary: '#EEF7BA',
        },
      }
    },
  },
})
