<template>
  <div class="product flex flex-col justify-center ">
    <img class="aspect-square object-cover	" :src="modelValue.image?.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details">
      <h3 class="text-center">{{ modelValue.name }}</h3>
      <div v-if="modelValue.variations" class="product-options flex justify-center">
        <div class="product-qty" v-for="(variation, index) in modelValue.variations" :key="index">
          <v-number-input
              v-model="modelValue.variations[index].qty"
              :reverse="false"
              controlVariant="stacked"
              :label="Object.values(variation.attributes).join(' ')"
              :hideInput="false"
              :inset="false"
            ></v-number-input>
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
