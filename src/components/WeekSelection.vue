<template>
  <h1 v-if="currentMenu" class="text-center wp-font-primary text-2xl">
    {{ menuTitre() }}
  </h1>
  <div
    :class="[
      'grid',
      'grid-rows-1',
      'grid-flow-col',
      'auto-cols-auto',
      'lg:gap-12',
      'my-6',
      'justify-center',
      'gap-4',
    ]"
  >
    <a
      :class="[
        'square',
        'flex',
        'flex-col',
        'items-center',
        'justify-around',
        'p-4',
        currentMenuID == menu.id ? 'active' : null,
        menu.selection_made ? 'selection_made' : null,
        menu.skip ? 'skip' : null,
        currentMenuID != menu.id ? 'cursor-pointer' : null,
      ]"
      v-for="menu in menus"
      :key="menu.id"
      @click="() => setCurrentMenuID(menu.id)"
    >
      <span class="wp-font-text">{{
        formattedDateToMonth(menu.date_debut.timestamp, menu.date_fin.timestamp)
      }}</span>
      <span class="wp-font-text">{{
        formattedDateNumberToNumber(
          menu.date_debut.timestamp,
          menu.date_fin.timestamp
        )
      }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "WeekSelection",
  props: {
    menus: {
      type: Array,
      required: true,
    },
    setCurrentMenuID: {
      type: Function,
      required: true,
    },
    currentMenuID: {
      type: Number,
      required: false,
    },
    currentMenu: {
      type: Object,
      required: false,
    },
  },
  methods: {
    /**
     * Retourne un titre dans le format Menu pour le X au X mois
     *
     * @returns {string} Titre du menu
     */
    menuTitre() {
      let date1 = this.dayjs
        .unix(this.currentMenu.date_debut.timestamp)
        .format("D MMMM");
      let date2 = this.dayjs
        .unix(this.currentMenu.date_fin.timestamp)
        .format("D MMMM");
      return `Menu pour le ${date1} au ${date2}`;
    },
    /**
     * Formatte 2 timestamp en date pour avoir le format "XX - XX"
     * @param timestamp1 Date de début
     * @param timestamp2 Date de fin
     *
     * @returns {string} Date formatée
     */
    formattedDateNumberToNumber(timestamp1, timestamp2) {
      let date1 = this.dayjs.unix(timestamp1).format("DD");
      let date2 = this.dayjs.unix(timestamp2).format("DD");
      return `${date1} - ${date2}`;
    },
    /**
     * Formatte 2 timestamp en date du mois avec 3 lettres majuscules, si les mois sont les mêmes,
     * on affiche un seul mois, sinon on affiche les 2 mois dans le format "MMM - MMM"
     * @param timestamp1 Date de début
     * @param timestamp2 Date de fin
     *
     * @returns {string} Date formatée en mois
     */
    formattedDateToMonth(timestamp1, timestamp2) {
      let month1 = this.dayjs
        .unix(timestamp1)
        .format("MMM")
        .toUpperCase()
        .substr(0, 3);
      let month2 = this.dayjs
        .unix(timestamp2)
        .format("MMM")
        .toUpperCase()
        .substr(0, 3);
      return month1 === month2 ? month1 : `${month1} - ${month2}`;
    },
  },
  created() {
    this.setCurrentMenuID(this.menus[0].id);
  },
};
</script>

<style scoped></style>
