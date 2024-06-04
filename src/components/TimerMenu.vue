<template v-if="isDeadLineSoon()">
  <h1>Plus que quelques heures avant de passer votre commande</h1>
  <p>{{ }}</p>
</template>
<script>
// Demandez comment mettre le style de h1 partout sur l'app
import dayjs from 'dayjs';
export default {
  name: 'TimerMenu',
  props: {
    menus: {
      type: Array,
      required: true,
    },
    currentMenu: {
      type: Object,
      required: true,
    },
  },

  methods: {
    /**
     * Met à jour le timer
     */
    updateTimer() {
    },
    isDeadLineSoon() {
      if (this.currentMenu.date_fin.timestamp - dayjs().unix() < 86400) {
        console.log("Pas encore de deadline")
        return true;
      } else {
        console.log("Deadline en cours")
        return false;

      }

    }
  },
  created() {
    this.updateTimer();
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};

</script>
