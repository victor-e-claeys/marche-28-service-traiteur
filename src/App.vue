<script setup>
import Day from "./components/Day.vue";
import Product from "./components/Product.vue";
import TimerMenu from "./components/TimerMenu.vue";
import User from "./components/User.vue";
import WeekSelection from "./components/WeekSelection.vue";
import { computed } from "vue";
</script>

<template>
  <!--User /-->
  <div class="reset selection-menu">
    <WeekSelection
      v-if="menus"
      :menus="menus"
      :currentMenu="currentMenu"
      :setCurrentMenuID="setCurrentMenuID"
    />
    <TimerMenu v-if="currentMenu" v-model="currentMenu" />
    <div
      v-if="currentMenu?.days"
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
        v-for="(_, key) in currentMenu.days"
        :key="key"
        v-model="currentMenu.days[key]"
      />
    </div>
    <div v-if="currentMenu?.options" class="mt-9">
      <div class="wp-font-primary text-lg uppercase mb-6">Options</div>
      <div
        v-if="currentMenu"
        :class="[
          'grid',
          'grid-cols-1',
          'xs:grid-cols-2',
          'lg:grid-cols-5',
          'gap-4',
        ]"
      >
        <Product
          v-for="(_, key) in currentMenu.options"
          :key="key"
          v-model="currentMenu.options[key]"
        />
      </div>
    </div>
    <div v-if="currentMenu">
      <v-checkbox
        v-if="currentMenu.editable"
        v-model="currentMenu.termsAndConditionsAccepted"
      >
        <template v-slot:label>
          <div class="wp-font-text">
            J'accepte les
            <a :href="termsAndConditionsURL" target="_blank" class="underline clickable-link"
              >conditions d'utilisation</a
            >
          </div>
        </template>
      </v-checkbox>
      <div class="flex max-sm:flex-col max-sm:items-center">
        <div
          v-if="currentMenu.editable"
          class="actions flex flex-column items-start"
        >
          <v-btn
            :class="['bouton-confirmation', 'wp-font-text', 'cursor-pointer','tracking-normal','normal-case']"
            @click="confirm"
            color="primary"
            size="large"
            :disabled="!canSubmit"
            :loading="loading == 'confirm'"
          >
            Confirmer ma sélection
          </v-btn>
          <a
            @click="skip"
            :class="[
              loading || !currentMenu.termsAndConditionsAccepted
                ? 'opacity-25'
                : null,
              'wp-font-text',
              'underline',
              'mt-3',
              'cursor-pointer',
              'link-jump-week',
            ]"
          >
            Sauter cette semaine
          </a>
        </div>
        <div class="errors error-style wp-font-text">
          <v-banner
            v-for="([key, message], i) in errorMessages"
            :key="key"
            icon="mdi-alert-circle-outline"
            :text="message"
            :class="[key, 'error-style', 'text-red-700', 'py-0', 'border-none']"
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
      subscription: null,
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
    addSnackBar(snackbar) {
      this.snackbars.push(snackbar);
    },
    addSuccessSnackBar(text, cls) {
      this.addSnackBar({
        class: cls,
        text,
      });
    },
    addErrorSnackBar(text) {
      this.addSnackBar({
        color: "red-accent-4",
        closeOnBack: false,
        closeOnContentClick: true,
        timeout: -1,
        text,
      });
    },
    async updateMenu() {
      const params = new URLSearchParams({
        user: this.user?.id || "",
        upcoming: true,
      });

      try {
        const response = await fetch(
          this.apiURL(`marche28/v1/menu?${params.toString()}`)
        );
        const { menus, portions, subscription, termsAndConditionsURL, user, users } =
          await response.json();
        this.menus = menus;
        this.portions = portions;
        this.termsAndConditionsURL = termsAndConditionsURL;
        this.subscription = subscription;
        this.users = users;
        this.user = user?.id > 0 ? this.user || user : null;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    async confirm() {
      this.loading = "confirm";

      try {
        const { messages, errors } = await fetch(
          this.apiURL("marche28/v1/menu"),
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
              skip: false,
              user: this.user?.id,
              menu: this.currentMenuID,
              selection: this.selection,
            }),
          }
        ).then((response) => response.json());

        errors?.map(this.addErrorSnackBar);
        messages &&
          Object.entries(messages).map(([cls, text]) =>
            this.addSuccessSnackBar(text, cls)
          );

        if (errors.length === 0) {
          this.currentMenu.selection_made = true;
          this.currentMenu.skip = false;
          this.currentMenu.isModified = false;
        }
      } catch {
        this.addErrorSnackBar("Erreur de communication avec le serveur.");
      }

      this.loading = false;
    },
    async skip() {
      if (this.loading || !this.currentMenu.termsAndConditionsAccepted)
        return console.log("Skip conditions failed.");

      this.loading = "skip";

      try {
        const { messages, errors } = await fetch(
          this.apiURL("marche28/v1/menu"),
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
              skip: true,
              user: this.user?.id,
              menu: this.currentMenuID,
              selection: this.selection,
            }),
          }
        ).then((response) => response.json());

        errors?.map(this.addErrorSnackBar);
        messages &&
          Object.entries(messages).map(([cls, text]) =>
            this.addSuccessSnackBar(text, cls)
          );

        if (errors.length === 0) this.currentMenu.skip = true;
      } catch {
        this.addErrorSnackBar("Erreur de communication avec le serveur.");
      }

      this.loading = false;
    },
  },
  computed: {
    canSubmit() {
      return !this.loading && this.errorMessages.length === 0;
    },
    currentMenu() {
      return this.menus?.find((menu) => menu.id === this.currentMenuID);
    },
    errors() {
      return {
        notLoggedIn: !this.user
          ? "Vous devez être connecté pour faire une sélection"
          : null,
        notSubscribed: this.user && !this.subscription
          ? "Vous devez être inscrit pour faire une sélection"
          : null,
        notEditable: this.currentMenu?.editable
          ? null
          : "La date limite de sélection pour ce menu est passée",
        insufficientSelection: !this.selectionHasMinimum
          ? `Votre sélection doit contenir un minimum de ${this.minimumMealQty} portions enfants/prêt-à-cuisiner par jour sur 4 jours.`
          : null,
        notAccepted: !this.currentMenu?.termsAndConditionsAccepted
          ? "Vous devez accepter les termes et conditions"
          : null,
      };
    },
    errorMessages() {
      return Object.entries(this.errors).filter(
        ([key, message]) => message !== null
      );
    },
    selectionHasMinimum() {
      return (
        this.selection.reduce((daysWithMinimum, { type, attributes, qty }) => {
          if (!this.selectionTypes[type] || qty < this.minimumMealQty)
            return daysWithMinimum;
          if (attributes?.pa_portions == "enfant") daysWithMinimum++;
          if (!attributes) daysWithMinimum++;
          return daysWithMinimum;
        }, 0) >= 4
      );
    },
    selection() {
      const options =
        this.currentMenu?.options &&
        Object.values(this.currentMenu.options).length > 0
          ? Object.values(this.currentMenu.options).reduce(
              (selection, { id, qty, price, variations }) => {
                const productID = id;
                if (variations) {
                  Object.values(variations).reduce(
                    (selection, { attributes, id, qty, price }) => {
                      const variationID = id;
                      selection.push({
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
                } else {
                  selection.push({
                    productID,
                    qty,
                    price,
                  });
                }
                return selection;
              },
              []
            )
          : [];
      return this.currentMenu?.days.reduce(
        (selection, { dayNumber, available, products, selectionType }) => {
          if (!available) return selection;
          Object.entries(products).reduce((selection, [type, product]) => {
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
            } else {
              selection.push({
                dayNumber,
                type,
                productID,
                qty,
                price,
              });
            }
            return selection;
          }, selection);
          return selection;
        },
        options
      );
    },
    total() {
      return this.selection.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
  provide() {
    return {
      currentMenu: computed(() => this.currentMenu),
    };
  },
  created() {
    this.updateMenu();
  },
};
</script>
