<template>
  <v-app>
    <v-main>
      <div v-if="users">
        <v-autocomplete
          v-model="user"
          :disabled="isUpdating"
          :items="users"
          chips
          closable-chips
          item-title="fullName"
          item-value="ID"
          label="Select"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :text="item.fullName"
            ></v-chip>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.fullName"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </div>
      <v-form @submit.prevent="submit">
        <div v-for="(week, weekId) in menus" :key="weekId">
          <h3>{{week.term.name}}</h3>
          <p>
            Date limite de commande: {{dayjs().to(dayjs.unix(week.date_limite_commande))}}
          </p>
          <div class="d-flex grille-repas">
            <v-card class="repas" v-for="(product, productId) in week.products" :key="productId">
              <v-img
                class="align-end text-white"
                height="200"
                :src="product.image.sizes.medium.url"
                cover
              >
                <v-card-title>
                  {{product.name}}
                </v-card-title>
              </v-img>
              <v-card-subtitle>
                Portions
              </v-card-subtitle>
              <v-card-text>
                <div v-for="(variation, index) in product.variations" :key="index">
                  <label>{{variation.attributes.pa_portions}} {{formattedPrice(variation.price)}}</label>
                  <v-text-field :disabled="week.editable?'':'disabled'" v-model="variation.qty" label="Qté" type="number" variant="outlined"></v-text-field>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <div class="includes" v-for="(category, catId) in week.includes" :key="catId">
            <h4>{{category.term.name}}</h4>
            <div class="d-flex grille-includes">
              <v-card class="choix" v-for="(product, productId) in category.products" :key="productId">
                <v-img
                  class="align-end text-white"
                  height="200"
                  :src="product.image.sizes.medium.url"
                  cover
                >
                  <v-card-title>
                    {{product.name}}
                  </v-card-title>
                </v-img>
                <v-card-subtitle>
                  Portions
                </v-card-subtitle>
                <v-card-text>
                  <div v-if="product.variations">
                    <div v-for="(variation, index) in product.variations" :key="index">
                      <label>{{variation.attributes.pa_portions}}</label>
                      <v-text-field v-model="variation.qty" label="Qté" type="number" variant="outlined"></v-text-field>
                    </div>
                  </div>
                  <div v-if="!product.variations">
                    <v-text-field v-model="product.qty" label="Qté" type="number" variant="outlined"></v-text-field>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-main>
  </v-app>
</template>

<script setup>
</script>

<script>
export default {
  name: 'App',
  data() {
    return {
      users: false,
      user: 0,
      portions: {},
      menus: {},
    };
  },
  methods: {
    formattedPrice(price){
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
    updateMenu(){
      const params = new URLSearchParams({
        user: this.user,
      });
      return fetch(this.apiURL(`marche28/v1/menu?${params.toString()}`))
        .then(response => response.json())
        .then(({menus, portions, users}) => {
          this.menus = menus;
          this.portions = portions;
          this.users = users;
        });
    },
    async submit (event) {
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
    apiURL(action){
      return 'https://lemarche28.ca/wp-json/' + action;
    },
  },
  computed: {
    // a computed getter
    selection() {
      // `this` points to the component instance
      return Object.values(this.menus).reduce((s, {term, products, includes}) => {
        s[term.term_id] = Object.assign(
          {},
          products
          ? Object.values(products).reduce((p, {id, qty, variations}) => {
              p[id] = {
                id,
                qty,
                variations: variations 
                  ? Object.values(variations).reduce((v, {id, qty}) => {
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
          Object.values(includes).reduce((p, {products}) => {
            Object.values(products).reduce((p, {id, qty, variations}) => {
              p[id] = {
                id,
                qty,
                variations: variations 
                  ? Object.values(variations).reduce((v, {id, qty}) => {
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
  .grille-repas{
    gap: 20px;
  }
  .repas{
    width: 20%;
  }
  .repas .v-img::before{
    content: "";
    background: #000;
    position: absolute;
    top:50%;
    height: 50%;
    width: 100%;
    z-index: -1;
  }
  .repas .v-card-title{
    text-shadow: 2px 2px 0 #0009;
    text-overflow: unset;
    white-space: normal;
  }
</style>