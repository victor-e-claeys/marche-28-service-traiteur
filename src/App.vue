<script setup>
import Day from "./components/Day.vue";
import TimerMenu from "./components/TimerMenu.vue";
import User from "./components/User.vue";
import WeekSelection from "./components/WeekSelection.vue";
</script>

<template>
  <!--User /-->
  <div class="reset selection-menu">
    <WeekSelection v-if="menus" :menus="menus" :currentMenuID="currentMenuID" :currentMenu="currentMenu"
      :setCurrentMenuID="setCurrentMenuID" />
    <TimerMenu v-if="currentMenu" v-model="currentMenu" :currentMenu="currentMenu" />
    <div v-if="currentMenu" :class="[
      'days',
      'grid',
      'grid-cols-1',
      'xs:grid-cols-2',
      'lg:grid-cols-5',
      'gap-4',
    ]">
      <Day v-for="(day, index) in currentMenu.days" :key="index" v-model="currentMenu.days[index]" />
    </div>
    <div v-if="currentMenu">
      <v-checkbox v-model="currentMenu.termsAndConditionsAccepted">
        <template v-slot:label>
          <div class="wp-font-text">
            J'accepte les
            <a :href="termsAndConditionsURL" target="_blank" class="underline">conditions d'utilisation</a>
          </div>
        </template>
      </v-checkbox>
      <div class="flex max-sm:flex-col max-sm:items-center">
        <div class="actions flex flex-column items-start">
          <v-btn :class="[
            'bouton-confirmation',
            'wp-font-text',
            'cursor-pointer',
          ]" @click="confirm" color="primary" size="large"
            :disabled="!canSubmit" :loading="loading == 'confirm'">
            Confirmer ma sélection
          </v-btn>
          <a @click="
            !loading && currentMenu.termsAndConditionsAccepted ? skip : null
            " :class="[
                !canSubmit
                ? 'opacity-25'
                : null,
              'wp-font-text',
              'underline',
              'mt-3',
            ]">
            Sauter cette semaine
          </a>
        </div>
        <div class="errors error-style wp-font-text">
          <v-banner
            v-for="(message, i) in errorMessages"
            :key="i"
            icon="mdi-alert-circle-outline"
            :text="message"
            class="error-style text-red-700"
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
      user: null,
      portions: {},
      menus: null,
      currentMenuID: null,
      termsAndConditionsURL: "#",
      snackbars: [],
      minimumMealQty: 4,
    };
  },
  methods: {
    apiURL(action) {
      return "https://lemarche28.ca/wp-json/" + action;
    },
    setCurrentMenuID(menuID) {
      this.currentMenuID = menuID;
    },
    addSnackBar({text}) {
      this.snackbars.push({
        color,
        text,
      });
    },
    async updateMenu() {
      const params = new URLSearchParams({
        user: this.user?.id || '',
      });

      try {
        const response = await fetch(
          this.apiURL(`marche28/v1/menu?${params.toString()}`)
        );
        const { menus, portions, termsAndConditionsURL, user, users } =
          await response.json();
        this.menus = menus;
        this.portions = portions;
        this.termsAndConditionsURL = termsAndConditionsURL;
        this.users = users;
        this.user = user?.id > 0 ? (this.user || user) : null;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    async confirm(event) {
      const menuID = this.currentMenuID;
      this.loading = "confirm";

      const {messages, errors} = await fetch(this.apiURL("marche28/v1/menu"), {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.user?.id,
          menu: this.currentMenuID,
          selection: this.selection,
        }),
      });

      errors?.map(text => {
        this.snackbars.push({
          color: 'red-accent-4',
          closeOnBack: false,
          closeOnContentClick: true,
          timeout: -1,
          text
        });
      });

      messages?.map(text => {
        this.snackbars.push({
          color: 'green-darken-4',
          text
        });
      });

      this.loading = false;

      this.messages = results.messages || [];
      
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
          user: this.user.id,
          menu: this.currentMenuID,
          skip: true,
        }),
      });

      this.loading = false;
    },
  },
  computed: {
    canSubmit(){
      return this.currentMenu?.termsAndConditionsAccepted && !this.loading && this.errorMessages.length === 0
    },
    currentMenu() {
      return this.menus?.find((menu) => menu.id === this.currentMenuID);
    },
    errorMessages() {
      return [
        !this.user
          ? "Vous devez être connecté pour faire une sélection"
          : null,
        !this.selectionHasMinimum
          ? `Votre sélection doit contenir un minimum de ${this.minimumMealQty} portions enfants/prêt-à-cuisiner par jour sur 4 jours.`
          : null,
        !this.currentMenu?.editable
          ? "La date limite de sélection pour ce menu est passée"
          : null,
      ].filter((v) => v);
    },
    selectionHasMinimum() {
      return this.selection.reduce((hasMinimum, { type, attributes, qty }) => {
        if (!this.selectionTypes[type]) return hasMinimum;
        if (attributes) {
          if (attributes.pa_portions == "enfant")
            return qty >= this.minimumMealQty && hasMinimum;
        } else {
          return qty >= this.minimumMealQty && hasMinimum;
        }
        return hasMinimum;
      }, true);
    },
    selection() {
      return this.currentMenu?.days.reduce(
        (selection, { dayNumber, available, products, selectionType }) => {
          if (!available) return selection;
          Object.entries(products).reduce(
            (selection, [type, product]) => {
              if (!product) return selection;
              const { id, qty, price, variations } = product;
              if (this.selectionTypes[type] && selectionType != type)
                return selection;
              const productID = id;
              if (variations) {
                Object.values(variations).reduce(
                  (selection, { attributes, id, qty, price }) => {
                    const variationID = id;
                    selection.push({
                      dayNumber,
                      type,
                      productID,
                      qty,
                      price,
                      variationID,
                      attributes,
                    });
                    return selection;
                  },
                  selection
                );
              }else{
                selection.push({
                  dayNumber,
                  type,
                  productID,
                  qty,
                  price,
                });
              }
              return selection;
            },
            selection
          );
          return selection;
        },
        []
      );
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
        if(this.user?.roles.includes('admin')) console.log(menu, this.selection);
      },
      deep: true,
    },
  },
  created() {
    this.updateMenu();
  },
};
</script>