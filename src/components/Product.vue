<template>
  <div class="product">
    <img :src="modelValue.image.sizes.medium.url" :alt="modelValue.name" />
    <div class="product-details">
      <h3>{{ modelValue.name }}</h3>
      <div v-if="modelValue.variations" class="product-options">

      </div>
      <div v-if="!modelValue.variations" class="product-qty">
        
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
