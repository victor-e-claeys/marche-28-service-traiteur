<script setup>
  import Product from './Product.vue';
</script>

<template>
  <div class="@container flex flex-col">
    <h3 class="text-center uppercase wp-font-primary h-8">{{ modelValue.date.day }}</h3>
    <div v-if="!modelValue.available" class="flex flex-col selection-type justify-center flex-grow">
      <h3 class="text-center title-unavailable wp-font-primary h-8">Non disponible</h3>
      <div class="box-unavailable flex-grow"></div>
    </div>
    <div v-if="modelValue.available && modelValue.products.pret_a_manger && modelValue.products.pret_a_cuisiner" class="flex flex-col @[15rem]:flex-row selection-type justify-center">
      <v-btn 
        v-for="(label, key) in selectionTypes"
        size="small"
        :key="key"
        :class="{
          'flex-1': true,
          'selection-type-button': true,
          active: modelValue.selectionType == key
        }"
        @click="() => setSelectionType(key)">
        {{ label }}
      </v-btn>
    </div>
    <div v-if="modelValue.available" class="h-[36rem] max-lg:h-[35rem] max-md:h-[37rem] max-sm:h-[40rem]">

      <div v-if="modelValue.selectionType != 'pret_a_cuisiner' && modelValue.products.pret_a_manger">
        <Product v-model="modelValue.products.pret_a_manger" />
      </div>
      <div v-if="modelValue.selectionType == 'pret_a_cuisiner' && modelValue.products.pret_a_cuisiner">
        <Product v-model="modelValue.products.pret_a_cuisiner" />
      </div>
    </div>
    <div v-if="modelValue.products.collation" class="collation">
      <h3 class="text-center uppercase wp-font-primary h-8">Collation</h3>
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
