<script setup>
  import Product from './Product.vue';
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-center uppercase ">{{ modelValue.date.day }}</h3>
    <div v-if="!modelValue.available" class="flex flex-col flex-grow">
      <h3 class="text-center title-unavailable">Non disponible</h3>
      <div class="box-unavailable flex-grow"></div>
    </div>
    <div v-if="modelValue.available && modelValue.products.pret_a_manger && modelValue.products.pret_a_cuisiner" class="flex selection-type justify-center">
      <v-btn v-for="(label, key) in selectionTypes" :key="key" size="small" @click="() => setSelectionType(key)">
        {{ label }}
      </v-btn>
    </div>
    <div v-if="modelValue.available">
      <div v-if="modelValue.selectionType != 'pret_a_cuisiner' && modelValue.products.pret_a_manger">
        <Product v-model="modelValue.products.pret_a_manger" />
      </div>
      <div v-if="modelValue.selectionType == 'pret_a_cuisiner' && modelValue.products.pret_a_cuisiner">
        <Product v-model="modelValue.products.pret_a_cuisiner" />
      </div>
    </div>
    <div v-if="modelValue.products.collation" class="collation">
      <h3>Collation</h3>
      <Product v-model="modelValue.products.collation" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Day',
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
    setSelectionType(type){ // "pret_a_manger" ou "pret_a_cuisiner"
      this.$emit('update:modelValue', { ...this.modelValue, selectionType: type });
    }
  },
  created(){
    if(!this.selectionType) this.setSelectionType('pret_a_manger');
  }
}
</script>

<style scoped>
</style>
