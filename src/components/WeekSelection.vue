<template>
  <div>
    <h1 v-if="currentMenu" class="text-center wp-font-primary text-2xl">
      {{ menuTitre }}
    </h1>
    <div :class="[
      'grid',
      'grid-rows-1',
      'grid-flow-col',
      'auto-cols-auto',
      'lg:gap-12',
      'my-6',
      'justify-center',
      'gap-4',
    ]">
      <a :class="[
        'square',
        'flex',
        'flex-col',
        'items-center',
        'justify-around',
        'p-4',
        'cursor-pointer',
        currentMenu?.id == menu.id ? 'active' : null,
        menu.selection_made && currentMenu?.id != menu.id ? 'selection_made' : null,
        menu.skip && currentMenu?.id != menu.id ? 'skip' : null,
        currentMenu?.id != menu.id ? 'cursor-pointer' : null,
        !menu.editable ? 'opacity-25' : null
      ]" v-for="menu in menus" :key="menu.id" @click="() => setCurrentMenuID(menu.id)">
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
  </div>
</template>

<script>
export default {
  name: "WeekSelection",
  props: {
    currentMenu: {
      type: Object,
      required: false
    },
    menus: {
      type: Array,
      required: true,
    },
    setCurrentMenuID: {
      type: Function,
      required: true,
    },
  },
  methods: {
    /**
     * Formatte 2 timestamp en date pour avoir le format "XX - XX"
     * @param timestamp1 Date de début
     * @param timestamp2 Date de fin
     *
     * @returns {string} Date formatée
     */
    formattedDateNumberToNumber(timestamp1, timestamp2) {
      let date1 = this.dayjs.unix(timestamp1).utc().format("DD");
      let date2 = this.dayjs.unix(timestamp2).utc().format("DD");
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
        .format("MMM");
      let month2 = this.dayjs
        .unix(timestamp2)
        .format("MMM");
      return month1 === month2 ? month1 : `${month1} - ${month2}`;
    },
  },
  computed: {
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
  },
  created() {
    // On charge le menu qui n'est pas sélectionné ou skip
    if (!this.currentMenu) {
      let menu = this.menus.find(menu => !menu.selection_made && !menu.skip && menu.editable);
      if (menu) {
        this.setCurrentMenuID(menu.id);
      }
    }
  }
}
</script>
