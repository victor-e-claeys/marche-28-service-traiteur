<script setup>
import User from './components/User.vue';
import WeekSelection from './components/WeekSelection.vue';
import TimerMenu from './components/TimerMenu.vue';
</script>
<template>
  <v-app>
    <v-main>
      <v-container>
        <User />
      </v-container>
      <v-form @submit.prevent="submit">
        <WeekSelection v-if="menus" :menus="menus" />
        <TimerMenu v-if="menus" :menus="menus" />
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      users: false,
      user: 0,
      portions: {},
      menus: null,
    };
  },
  methods: {
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
        user: this.user,
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
          user: this.user,
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
    // a computed getter
    selection() {
      // `this` points to the component instance
      return Object.values(this.menus).reduce((s, { term, products, includes }) => {
        s[term.term_id] = Object.assign(
          {},
          products
            ? Object.values(products).reduce((p, { id, qty, variations }) => {
              p[id] = {
                id,
                qty,
                variations: variations
                  ? Object.values(variations).reduce((v, { id, qty }) => {
                    v[id] = {
                      id,
                      qty
                    }
                    return v;
                  }, {})
                  : null
              }
              return p;
            }, {})
            : {},
          includes ?
            Object.values(includes).reduce((p, { products }) => {
              Object.values(products).reduce((p, { id, qty, variations }) => {
                p[id] = {
                  id,
                  qty,
                  variations: variations
                    ? Object.values(variations).reduce((v, { id, qty }) => {
                      v[id] = {
                        id,
                        qty
                      }
                      return v;
                    }, {})
                    : null
                }
                return p;
              }, p);
              return p;
            }, {})
            : {}
        );
        return s;
      }, {});
    }
  },
  created() {
    this.updateMenu();
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
