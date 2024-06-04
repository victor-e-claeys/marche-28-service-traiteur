<template v-if="">
  <h1>Plus que quelques heures avant de passer votre commande</h1>
<p>{{  }}</p>
</template>
<script>
// Demandez comment mettre le style de h1 partout sur l'app
import dayjs from 'dayjs';
export default{
  name: 'TimerMenu',
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      timer: null,
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };
  },
  methods: {
    /**
     * Met à jour le timer
     */
    updateTimer() {
      let now = dayjs();
      let end = dayjs.unix(this.menus[0].date_fin.timestamp);
      let diff = end.diff(now, 'second');
      this.time.hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      this.time.minutes = Math.floor((diff % (60 * 60)) / 60);
      this.time.seconds = Math.floor(diff % 60);
    },
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
