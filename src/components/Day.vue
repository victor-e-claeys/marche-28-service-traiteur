<script setup>
import Product from './Product.vue';
</script>

<template>
  <div class="max-lg:flex flex-row flex-wrap gap-4 justify-center">
    <h3 class="day-name row-start-1 text-center 
               self-center uppercase wp-font-primary h-8 
               max-lg:origin-center 
               max-lg:-rotate-90
               max-lg:text-3xl
               max-lg:w-8">{{ modelValue.date.day }}</h3>
    <div class="grid max-lg:grid-cols-2 gap-x-5">
      <div v-if="!modelValue.available"
        class="row-start-2 row-end-4 flex flex-col 
               selection-type justify-center flex-grow">
        <v-btn class="title-unavailable wp-font-primary flex-none" :readonly="true" size="small" block>
          Non disponible
        </v-btn>
        <div class="box-unavailable flex-grow"></div>
      </div>
      <div v-if="modelValue.available" class="repas @container flex flex-col">
        <div v-if="modelValue.products.pret_a_manger && modelValue.products.pret_a_cuisiner"
          class="selection-type flex flex-col @[15rem]:flex-row justify-center">
          <v-btn v-for="(label, key) in selectionTypes" size="small" :key="key"
            :readonly="modelValue.selectionType == key" :class="{
              '@[15rem]:flex-1': true,
              'selection-type-button': true,
              active: modelValue.selectionType == key
            }" @click="() => setSelectionType(key)">
            {{ label }}
          </v-btn>
        </div>
        <Product v-if="modelValue.selectionType != 'pret_a_cuisiner' && modelValue.products.pret_a_manger"
          v-model="modelValue.products.pret_a_manger" />
        <Product v-if="modelValue.selectionType == 'pret_a_cuisiner' && modelValue.products.pret_a_cuisiner"
          v-model="modelValue.products.pret_a_cuisiner" />
      </div>
      <div v-if="modelValue.products.collation"
        :class="['collation', 'lg:row-start-3', `col-start-${modelValue.dayNumber + 1}`]">
        <h3 class="text-center uppercase wp-font-primary h-8">Collation</h3>
        <Product v-model="modelValue.products.collation" />
      </div>
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
    setSelectionType(type) { // "pret_a_manger" ou "pret_a_cuisiner"
      this.$emit('update:modelValue', { ...this.modelValue, selectionType: type });

    }
  },
  created() {
    if (!this.selectionType) this.setSelectionType('pret_a_manger');
  }
}
</script>

<style scoped></style>
