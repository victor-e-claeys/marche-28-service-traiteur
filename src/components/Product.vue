<template>
  <div class="product flex flex-col justify-center ">
    <img class="aspect-square object-cover	" :src="modelValue.image?.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details p-5">
      <h3 class="text-center h-14">{{ modelValue.name }}</h3>
      <div class="variations flex flex-col items-center" v-if="modelValue.variations">
        <div class="variation-details flex">
          <div class="variation-qty flex" v-for="(variation, index) in modelValue.variations" :key="index">
            <v-number-input 
              controlVariant="stacked"
              v-model="modelValue.variations[index].qty" 
              :reverse="false" 
              :label="variationName(variation)" 
              :hideInput="false" 
              :inset="false" 
            />
          </div>
        </div>
        <div class="variations-price-data flex gap-1" v-for="(variation, index) in modelValue.variations" :key="index">
          <span class="variation-name">
            {{ variationName(variation) }}
          </span>
          <span class="variation-price">
            {{ moneyFormatter.format(variation.price) }}
          </span>
          <span class="variation-per">
            par portion
          </span>
          <span v-if="variation.qty > 0" class="variation-total ">
            {{ moneyFormatter.format(variation.price * variation.qty)}}
          </span>
        </div>
      </div>
      <div v-if="!modelValue.variations" class="product-details">
        <div class="product-qty">
          <v-number-input 
            controlVariant="stacked"
            v-model="modelValue.qty" 
            :reverse="false" 
            :hideInput="false" 
            :inset="false" 
          />
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
