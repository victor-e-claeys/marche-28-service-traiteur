<template>
  <div>
    <h1 v-if="currentMenu" class="text-center wp-font-primary">{{ menuTitre() }}</h1>
    <div class="center">
      <a class="square" v-for="menu in menus" :key="menu.id" @click="() => setCurrentMenuID(menu.id)">
        <h3>{{ formattedDateToMonth(menu.date_debut.timestamp, menu.date_fin.timestamp) }}</h3>
        <p>{{ formattedDateNumberToNumber(menu.date_debut.timestamp, menu.date_fin.timestamp) }}</p>
      </a>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: 'WeekSelection',
  props: {
    menus: {
      type: Array,
      required: true,
    },
    setCurrentMenuID: {
      type: Function,
      required: true
    },
    currentMenuID: {
      type: Number,
      required: false
    },
    currentMenu: {
      type: Object,
      required: false
    }
  },
  methods: {
    /**
     * Retourne un titre dans le format Menu pour le X au X mois
     *
     * @returns {string} Titre du menu
     */
    menuTitre() {
      let date1 = dayjs.unix(this.currentMenu.date_debut.timestamp).format('D MMMM');
      let date2 = dayjs.unix(this.currentMenu.date_fin.timestamp).format('D MMMM');
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
      let date1 = dayjs.unix(timestamp1).format('D');
      let date2 = dayjs.unix(timestamp2).format('D');
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
      let month1 = dayjs.unix(timestamp1).format('MMM').toUpperCase().substr(0, 3);
      let month2 = dayjs.unix(timestamp2).format('MMM').toUpperCase().substr(0, 3);
      return month1 === month2 ? month1 : `${month1} - ${month2}`;
    },
    /**
     * Ajoute la classe active si le menu est sélectionné et change le menu sélectionné
     *
     */
    selectMenu(menu) {
      console.log(menu);
    }
  },
  created() {
    this.setCurrentMenuID(this.menus[0].id);
  }
}
</script>

<style scoped>
.square {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px solid black;

}

.center {
  display: flex;
  justify-content: center;
  margin-top: 3em;
  gap: 4em;
}
</style>
