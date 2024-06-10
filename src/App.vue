<script setup>
import Day from "./components/Day.vue";
import TimerMenu from "./components/TimerMenu.vue";
import User from "./components/User.vue";
import WeekSelection from "./components/WeekSelection.vue";
</script>

<template>
  <!--User /-->
  <div class="reset selection-menu">
    <WeekSelection
      v-if="menus"
      :menus="menus"
      :currentMenuID="currentMenuID"
      :currentMenu="currentMenu"
      :setCurrentMenuID="setCurrentMenuID"
    />
    <TimerMenu
      v-if="currentMenu"
      v-model="currentMenu"
      :currentMenu="currentMenu"
    />
    <div
      v-if="currentMenu"
      :class="[
        'days',
        'grid',
        'grid-cols-1',
        'xs:grid-cols-2',
        'lg:grid-cols-5',
        'gap-4',
      ]"
    >
      <Day
        v-for="(day, index) in currentMenu.days"
        :key="index"
        v-model="currentMenu.days[index]"
      />
    </div>
    <div v-if="currentMenu">
      <v-checkbox v-model="currentMenu.termsAndConditionsAccepted">
        <template v-slot:label>
          <div class="wp-font-text">
            J'accepte les
            <a :href="termsAndConditionsURL" target="_blank" class="underline"
              >conditions d'utilisation</a
            >
          </div>
        </template>
      </v-checkbox>
      <div class="flex max-sm:flex-col max-sm:items-center">
        <div class="actions flex flex-column items-start">
          <v-btn
            class="bouton-confirmation wp-font-text"
            @click="confirm"
            color="primary"
            size="large"
            :disabled="!currentMenu.termsAndConditionsAccepted || !!loading"
            :loading="loading == 'confirm'"
          >
            Confirmer ma sélection
          </v-btn>
          <a
            @click="
              !loading && currentMenu.termsAndConditionsAccepted ? skip : null
            "
            :class="[
              !currentMenu.termsAndConditionsAccepted || !!loading
                ? 'opacity-25'
                : null,
              'wp-font-text',
              'underline',
              'mt-3',
            ]"
          >
            Sauter cette semaine
          </a>
        </div>
        <div class="errors error-style wp-font-text">
          <v-banner
            icon="mdi-alert-circle-outline"
            text="Ceci est une erreur"
            class="error-styl text-red-700"
            :stacked="false"
          />
        </div>
        <div class="order-total flex-grow text-right wp-font-text font-bold">
          Total : {{ moneyFormatter.format(total) }}
        </div>
      </div>
      <v-snackbar-queue v-model="snackbars" />
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      loading: false,
      users: false,
      currentUserID: 0,
      portions: {},
      menus: null,
      currentMenuID: null,
      termsAndConditionsURL: "#",
      snackbars: [],
    };
  },
  methods: {
    apiURL(action) {
      return "https://lemarche28.ca/wp-json/" + action;
    },
    setCurrentMenuID(menuID) {
      this.currentMenuID = menuID;
    },
    addSnackBar(message){
      this.snackbars.push({
        text: message
      });
    },
    async updateMenu() {
      const params = new URLSearchParams({
        user: this.currentUserID,
      });

      try{
        const response = await fetch(this.apiURL(`marche28/v1/menu?${params.toString()}`));
        const { menus, portions, users, termsAndConditionsURL } = await response.json();
        this.termsAndConditionsURL = termsAndConditionsURL;
        this.menus = menus;
        this.portions = portions;
        this.users = users;
      }catch(error){
        console.error(error);
        return;
      }

    },
    async confirm(event) {
      const menuID = this.currentMenuID;
      this.loading = "confirm";

      await this.delay(3000);

      this.addSnackBar(`Confirmation de la commande pour le menu ${menuID}...`);

      this.loading = false;

      return;
      /*
      const results = await fetch(this.apiURL("marche28/v1/menu"), {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.currentUserID,
          menu: this.currentMenuID,
          selection: this.selection,
        }),
      });

      this.messages = results.messages || [];
      */
    },
    async skip(event) {
      this.loading = "skip";

      const results = await fetch(this.apiURL("marche28/v1/menu"), {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.currentUserID,
          menu: this.currentMenuID,
          skip: true,
        }),
      });

      this.loading = false;
    },
  },
  computed: {
    currentMenu() {
      return this.menus?.find((menu) => menu.id === this.currentMenuID);
    },
    selection() {
      return this.currentMenu.days.reduce((selection, day) => {
        if (!day.available) return selection;
        Object.entries(day.products).reduce((selection, [type, product]) => {
          if (!product) return selection;
          if (this.selectionTypes[type] && day.selectionType != type)
            return selection;
          if (product.qty > 0)
            selection.push({
              dayID: day.dayNumber,
              productID: product.id,
              qty: product.qty,
              price: product.price,
            });
          if (product.variations)
            Object.values(product.variations).reduce((selection, variation) => {
              if (variation.qty > 0) {
                selection.push({
                  dayID: day.dayNumber,
                  productID: product.id,
                  variationID: variation.id,
                  qty: variation.qty,
                  price: variation.price,
                });
              }
              return selection;
            }, selection);
          return selection;
        }, selection);
        return selection;
      }, []);
    },
    total() {
      return this.selection.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
  watch: {
    currentMenu: {
      handler(menu) {
        if (!menu.isModified) menu.isModified = true;
        console.log(menu, this.selection);
      },
      deep: true,
    },
    snackbars: {
      hander: console.log
    }
  },
  created() {
    this.updateMenu();
  },
};
</script>
