<template>
  <div class="product flex flex-col justify-center ">
    <img class="aspect-square object-cover	" :src="modelValue.image?.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details">
      <h3 class="text-center">{{ modelValue.name }}</h3>
      <div class="variations" v-if="modelValue.variations">
        <div class="variation-details flex">
          <div class="variation-qty" v-for="(variation, index) in modelValue.variations" :key="index">
            <NumberInput v-model="modelValue.variations[index].qty" :label="variationName(variation)" :min="variation.attributes?.pa_portions == 'enfant' ? 4 : null" />
          </div>
        </div>
        <div class="variations-price-data" v-for="(variation, index) in modelValue.variations" :key="index">
          <span class="variation-name">
            {{ variationName(variation) }}
          </span>
          <span class="variation-price">
            {{ moneyFormatter.format(variation.price) }}
          </span>
          <span class="variation-per">
            par portion
          </span>
          <span v-if="variation.qty > 0" class="variation-total">
            {{ moneyFormatter.format(variation.price * variation.qty)}}
          </span>
        </div>
      </div>
      <div v-if="!modelValue.variations" class="product-details">
        <div class="product-qty">
          <NumberInput v-model="modelValue.qty" />
        </div>
        <div class="product-price-data">
          <span class="product-price">
            {{ moneyFormatter.format(modelValue.price) }}
          </span>
          <span class="product-per">
            par portion
          </span>
          <span v-if="modelValue.qty > 0" class="product-total">
            {{ moneyFormatter.format(modelValue.price * modelValue.qty)}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NumberInput from './NumberInput.vue';
</script>

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
