<template>
  <div class="product">
    <img :src="modelValue.image?.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details">
      <h3>{{ modelValue.name }}</h3>
      <div v-if="modelValue.variations" class="product-options">
        <div class="product-qty" v-for="(variation, index) in modelValue.variations" :key="index">
          <v-number-input
              v-model="modelValue.variations[index]"
              :reverse="false"
              controlVariant="stacked"
              label=""
              :hideInput="false"
              :inset="false"
            ></v-number-input>
        </div>
      </div>
      <div v-if="!modelValue.variations" class="product-qty">
        <v-number-input
          v-model="modelValue.qty"
          :reverse="false"
          controlVariant="stacked"
          label=""
          :hideInput="false"
          :inset="false"
        ></v-number-input>
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
  }
}
</script>

<style scoped>
</style>
