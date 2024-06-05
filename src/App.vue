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
    <div v-if="currentMenu" class="flex-1 flex justify-center flex-wrap	">
      <Day v-for="(day, index) in currentMenu.days" :key="index" v-model="currentMenu.days[index]" class="min-w-80 p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/5"/>
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
            @click="submit"
            color="primary" 
            :disabled="!currentMenu.conditionsAccepted">
            Confirmer ma sélection
          </v-btn>
          <a 
            @click="skip" 
            :class="{
              'opacity-25': !currentMenu.conditionsAccepted
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
    </div>
  </div>  
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      users: false,
      currentUserID: 0,
      portions: {},
      menus: null,
      currentMenuID: null,
      conditionsURL: '#'
    };
  },
  methods: {
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
    async submit(event) {
      this.loading = true

      const results = await fetch(this.apiURL('marche28/v1/menu'), {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          user: this.currentUserID,
          selection: this.selection
        })
      })

      this.loading = false

    },
    apiURL(action) {
      return 'https://lemarche28.ca/wp-json/' + action;
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
