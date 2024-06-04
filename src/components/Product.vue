<template>
  <div class="product">
    <img class="aspect-square object-cover	" :src="modelValue.image?.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details">
      <h3 class="text-center">{{ modelValue.name }}</h3>
      <div v-if="modelValue.variations" class="product-options flex">
        <div class="product-qty" v-for="(variation, index) in modelValue.variations" :key="index">
          <v-number-input v-model="modelValue.variations[index].qty" :reverse="false" controlVariant="stacked"
            :label="Object.values(variation.attributes).join(' ')" :hideInput="false" :inset="false"></v-number-input>
          <h3>{{ modelValue.name }}</h3>
          <div class="variations" v-if="modelValue.variations">
            <div class="variation-quantities flex">
              <div class="product-qty" v-for="(variation, index) in modelValue.variations" :key="index">
                <v-number-input v-model="modelValue.variations[index].qty" :reverse="false" controlVariant="stacked"
                  :label="variationName(variation)" :hideInput="false" :inset="false"></v-number-input>
              </div>
            </div>
            <div class="variations-price-data" v-for="(variation, index) in modelValue.variations" :key="index">
              <span class="variation-name">{{ variationName(variation) }}</span>
              <span class="variation-price">{{ moneyFormatter.format(variation.price) }}</span>
              <span class="variation-per">par portion</span>
              <span v-if="variation.qty > 0" class="variation-total">{{ moneyFormatter.format(variation.price *
                variation.qty)}}</span>
            </div>
          </div>
          <div v-if="!modelValue.variations" class="product-qty">
            <v-number-input v-model="modelValue.qty" :reverse="false" controlVariant="stacked" :hideInput="false"
              :inset="false"></v-number-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: [
    'update:modelValue'
  ],
  methods: {
    variationName(variation) {
      return Object.values(variation.attributes).join(' ');
    }
  }
}
</script>

<style scoped></style>
