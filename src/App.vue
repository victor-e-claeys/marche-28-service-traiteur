<script setup>
import Day from './components/Day.vue';
import TimerMenu from './components/TimerMenu.vue';
import User from './components/User.vue';
import WeekSelection from './components/WeekSelection.vue';
</script>

<template>
  <v-container>
    <!--User /-->
  <v-form @submit.prevent="submit">
    <WeekSelection v-if="menus" :menus="menus" :currentMenuID="currentMenuID" :currentMenu="currentMenu"
      :setCurrentMenuID="setCurrentMenuID" />
    <TimerMenu v-if="currentMenu" v-model="currentMenu" :currentMenu="currentMenu" />
    <div v-if="currentMenu" class="flex">
      <Day v-for="(day, index) in currentMenu.days" :key="index" v-model="currentMenu.days[index]"
        :setQuantity="setQuantity" />
    </div>
    <div v-if="currentMenu">
      <p>Total: {{ moneyFormatter.format(total) }}</p>
    </div>
    <v-btn type="submit" block class="mt-2">Submit</v-btn>
  </v-form>
  </v-container>
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
      currentMenuID: null
    };
  },
  methods: {
    setCurrentMenuID(menuID) {
      this.currentMenuID = menuID;
    },
    setQuantity({
      quantity = 0,
      menuId = this.currentMenuId,
      productId = 0,
      variationId = 0,
      dayId = 0
    }) {
    },
    formattedPrice(price) {
      const options = {
        style: 'currency',
        currency: 'CAD',
        currencyDisplay: 'symbol'
      };
      const formatter = new Intl.NumberFormat('fr-CA', options);
      return formatter.format(price);
    },
    log() {
      console.log(arguments);
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
          if(day.available)
            Object.entries(day.products).reduce(
              (selection, [type, product]) => {
                if(product && type == 'collation' || day.selectionType == type){
                  if(product.qty > 0)
                    selection.push({
                      menuID: this.currentMenu.id,
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
                            menuID: this.currentMenu.id,
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
                }
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
