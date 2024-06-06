<script setup>
import Day from './components/Day.vue';
import TimerMenu from './components/TimerMenu.vue';
import User from './components/User.vue';
import WeekSelection from './components/WeekSelection.vue';
</script>

<template>
    <!--User /-->
  <div>
    <WeekSelection v-if="menus" :menus="menus" :currentMenuID="currentMenuID" :currentMenu="currentMenu"
      :setCurrentMenuID="setCurrentMenuID" />
    <TimerMenu v-if="currentMenu" v-model="currentMenu" :currentMenu="currentMenu" />
    <div v-if="currentMenu" class="days grid gap-4 grid-cols-5 grid-rows-3">
      <Day 
        v-for="(day, index) in currentMenu.days" 
        :key="index" 
        v-model="currentMenu.days[index]" />
    </div>
    <div v-if="currentMenu">
      <v-checkbox v-model="currentMenu.conditionsAccepted">
        <template v-slot:label>
          <div>
            J'accepte les <a :href="conditionsURL" target="_blank">conditions d'utilisation</a>
          </div>
        </template>
      </v-checkbox>
      <div class="flex">
        <div class="actions flex flex-column items-start">
          <v-btn  
            @click="!loading ? confirm : null"
            color="primary" 
            :disabled="!currentMenu.conditionsAccepted || loading"
            :loading="loading == 'confirm'">
            Confirmer ma sélection
          </v-btn>
          <a 
            @click="!loading ? skip : null" 
            :class="{
              'opacity-25': !currentMenu.conditionsAccepted || loading
            }">
            Sauter cette semaine
          </a>
        </div>
        <div class="errors">
          <v-banner
            icon="mdi-alert-circle"
            text="Ceci est une erreur"
            :stacked="false" />
        </div>
        <div class="order-total flex-grow text-right">
          Total : {{ moneyFormatter.format(total) }}
        </div>
      </div>
      <v-snackbar
        v-for="({message}, i) in messages"
        v-model="messages[i].snackbar"
        multi-line
        :key="i"
      >
        {{ message }}
      </v-snackbar>
    </div>
  </div>  
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      loading: false,
      users: false,
      currentUserID: 0,
      portions: {},
      menus: null,
      currentMenuID: null,
      conditionsURL: '#',
      messages: []
    };
  },
  methods: {
    apiURL(action) {
      return 'https://lemarche28.ca/wp-json/' + action;
    },
    setCurrentMenuID(menuID) {
      this.currentMenuID = menuID;
    },
    updateMenu() {
      const params = new URLSearchParams({
        user: this.currentUserID,
      });
      return fetch(this.apiURL(`marche28/v1/menu?${params.toString()}`))
        .then(response => response.json())
        .then(({ menus, portions, users }) => {
          this.menus = menus;
          this.portions = portions;
          this.users = users;
        });
    },
    async confirm(event) {
      const menuID = this.currentMenuID;
      this.loading = 'confirm';

      this.messages = [
        {
          message: `Confirmation de la commande pour le menu ${menuID}...`,
          snackbar: true
        },
      ];

      this.loading = false;

      return;

      const results = await fetch(this.apiURL('marche28/v1/menu'), {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.currentUserID,
          menu: this.currentMenuID,
          selection: this.selection
        })
      })

      this.messages = results.messages || [];

    },
    async skip(event) {
      this.loading = 'skip'

      const results = await fetch(this.apiURL('marche28/v1/menu'), {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.currentUserID,
          menu: this.currentMenuID,
          skip: true
        })
      })

      this.loading = false

    },
  },
  computed: {
    currentMenu() {
      return this.menus?.find(menu => menu.id === this.currentMenuID);
    },
    selection(){
      return this.currentMenu.days.reduce(
        (selection, day) => {
          if(!day.available) return selection;
          Object.entries(day.products).reduce(
            (selection, [type, product]) => {
              if(!product) return selection;
              if(this.selectionTypes[type] && day.selectionType != type) return selection;
              if(product.qty > 0)
                selection.push({
                  dayID: day.dayNumber,
                  productID: product.id,
                  qty: product.qty,
                  price: product.price
                });
              if(product.variations)
                Object.values(product.variations).reduce(
                  (selection, variation) => {
                    if(variation.qty > 0){
                      selection.push({
                        dayID: day.dayNumber,
                        productID: product.id,
                        variationID: variation.id,
                        qty: variation.qty,
                        price: variation.price
                      });
                    }
                    return selection;
                  },
                  selection
                );
              return selection
            },
            selection
          );
          return selection;
        },
        []
      );
    },
    total(){
      return this.selection.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    }
  },
  watch: {
    currentMenu: {
      handler(menu) {
        if(!menu.isModified) menu.isModified = true;
        console.log(menu, this.selection);
      },
      deep: true
    }
  },
  created() {
    this.updateMenu();
  }
};
</script>
