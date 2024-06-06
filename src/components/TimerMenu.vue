/**
@author: Olivier Cote (VictorConceptum)
*/
<template>
  <div v-if="isDeadLineSoon()" class="flex flex-col items-center mb-5">
    <h4 class="mt-5 mb-10 wp-font-primary text-lg text-center wp-global-color-orange">Plus que quelques heures avant de passer votre
      commande</h4>
    <div class="grid">
      <div class="grid grid-cols-5 gap-2">
        <div class="flex flex-col items-center">
          <h4 class="wp-font-primary text-lg ">{{ tempsRestants[0] }}</h4>
          <p class="wp-font-text text-sm">Heures</p>
        </div>
        <span class="text-center"> : </span>
        <div class="flex flex-col items-center">
          <h4 class="wp-font-primary text-lg">{{ tempsRestants[1] }}</h4>
          <p class="wp-font-text text-sm">Minutes</p>
        </div>
        <span class="text-center"> : </span>
        <div class="flex flex-col items-center">
          <h4 class="wp-font-primary text-lg">{{ tempsRestants[2] }}</h4>
          <p class="wp-font-text text-sm">Secondes</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';
export default {
  name: 'TimerMenu',
  data() {
    return {
      timer: null,
      timeLeft: null,
    }
  },
  props: {
    currentMenu: {
      type: Object,
      required: true,
    }
  },
  methods: {
    /**
     * Calcule le temps restant entre la date de fin du menu sélectionné avec la date d'aujourd'hui.
     */
    updateTimer() {
      this.timeLeft = this.currentMenu.date_fin.timestamp - dayjs().unix();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
      }
    },
    /**
     * Cette méthode vérifie si la deadline est bientôt, c'est-à-dire dans moins de 24h
     * On calcule le currentMenu.date_fin.timestamp - dayjs().unix() pour voir si c'est inférieur à 86400 (soit 24h)
     * Si c'est le cas, on affiche un message pour prévenir l'utilisateur avec le temps restant
     *
     * @returns {boolean} Si la deadline est bientôt pour afficher le template
     */
    isDeadLineSoon() {
      return window.location.hash == '#deadline' || this.currentMenu.date_fin.timestamp - dayjs().unix() < 86400;
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
  computed: {
    /**
     * Cette méthode calcule le temps restant avant la fin du menu en heures, minutes et secondes
     *
     * @returns {string} Temps restant avant la fin pour commander le menu
     */
    tempsRestants() {
      let heures = Math.floor(this.timeLeft / 3600);
      let minutes = Math.floor((this.timeLeft % 3600) / 60);
      let secondes = this.timeLeft % 60;
      // On retourne un array avec les heures, minutes et secondes formatées avec un 0 devant si < 10
      // array[0] sera les heures et vice versa
      return [`${heures < 10 ? '0' + heures : heures}`, `${minutes < 10 ? '0' + minutes : minutes}`, `${secondes < 10 ? '0' + secondes : secondes}`];
    }
  }
};

</script>
