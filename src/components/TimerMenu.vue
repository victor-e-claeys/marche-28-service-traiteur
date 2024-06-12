/** @author: Olivier Cote (VictorConceptum) */
<template>
  <div>
    <h4
      v-if="!tempsRestant"
      class="mt-5 mb-10 wp-font-primary text-lg text-center wp-global-color-orange"
    >
      La date limite de commande est passée
    </h4>
    <h4
      v-if="tempsRestant && !isDeadLineSoon"
      class="mt-5 mb-10 wp-font-primary text-lg text-center"
    >
      Date limite de commande: {{ modelValue.date_limite_commande.datetime }}
    </h4>
    <div v-if="tempsRestant && isDeadLineSoon" class="flex flex-col items-center mb-5">
      <h4
        class="mt-5 mb-10 wp-font-primary text-lg text-center wp-global-color-orange"
      >
        Plus que quelques heures avant de passer votre commande
      </h4>
      <div v-if="tempsRestant" class="grid">
        <div :class="['grid', 'grid-flow-col', 'gap-2']">
          <div
            v-if="tempsRestant.months() > 0"
            class="flex flex-col items-center"
          >
            <h4 class="wp-font-primary text-lg">
              {{ tempsRestant.format("MM") }}
            </h4>
            <p class="wp-font-text text-sm">Mois</p>
          </div>
          <span v-if="tempsRestant.months() > 0" class="text-center"> : </span>
          <div
            v-if="tempsRestant.days() > 0"
            class="flex flex-col items-center"
          >
            <h4 class="wp-font-primary text-lg">
              {{ tempsRestant.format("DD") }}
            </h4>
            <p class="wp-font-text text-sm">Jours</p>
          </div>
          <span v-if="tempsRestant.days() > 0" class="text-center"> : </span>
          <div class="flex flex-col items-center">
            <h4 class="wp-font-primary text-lg">
              {{ tempsRestant.format("HH") }}
            </h4>
            <p class="wp-font-text text-sm">Heures</p>
          </div>
          <span class="text-center"> : </span>
          <div class="flex flex-col items-center">
            <h4 class="wp-font-primary text-lg">
              {{ tempsRestant.format("mm") }}
            </h4>
            <p class="wp-font-text text-sm">Minutes</p>
          </div>
          <span class="text-center"> : </span>
          <div class="flex flex-col items-center">
            <h4 class="wp-font-primary text-lg">
              {{ tempsRestant.format("ss") }}
            </h4>
            <p class="wp-font-text text-sm">Secondes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  name: "TimerMenu",
  data() {
    return {
      timer: null,
      timeLeft: null,
    };
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  methods: {
    /**
     * Calcule le temps restant entre la date de fin du menu sélectionné avec la date d'aujourd'hui.
     */
    updateTimer() {
      const timestamp = dayjs().unix();
      this.timeLeft =
        this.modelValue?.date_limite_commande.timestamp - timestamp;
      this.modelValue && (this.modelValue.editable = this.timeLeft > 0);
    },
  },
  computed: {
    /**
     * Cette méthode vérifie si la deadline est bientôt, c'est-à-dire dans moins de 24h
     * On calcule le currentMenu.date_fin.timestamp - dayjs().unix() pour voir si c'est inférieur à 86400 (soit 24h)
     * Si c'est le cas, on affiche un message pour prévenir l'utilisateur avec le temps restant
     *
     * @returns {boolean} Si la deadline est bientôt pour afficher le template
     */
    isDeadLineSoon() {
      return (
        this.tempsRestant &&
        (window.location.hash == "#deadline" || this.tempsRestant.days() < 1)
      );
    },
    /**
     * Cette méthode calcule le temps restant avant la fin du menu en heures, minutes et secondes
     *
     * @returns {dayjs} Temps restant avant la fin pour commander le menu
     */
    tempsRestant() {
      return this.timeLeft > 0
        ? this.dayjs.duration(this.timeLeft, "seconds")
        : null;
    },
  },
  watch: {
    modelValue: {
      handler() {
        this.timer && clearInterval(this.timer);
        this.updateTimer();
        this.timer = setInterval(() => {
          this.updateTimer();
        }, 1000);
      },
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
