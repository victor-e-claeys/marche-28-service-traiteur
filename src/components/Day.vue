<script setup>
  import Product from './Product.vue';
</script>

<template>
  <div class="flex-1 gap-1">
    <h3 class="text-center uppercase ">{{ modelValue.date.day }}</h3>
    <div v-if="modelValue.available && modelValue.products.pret_a_manger && modelValue.products.pret_a_cuisiner" class="flex selection-type">
      <v-btn v-for="(label, key) in repas" :key="key" rounded="0" size="small" variant="flat" @click="() => setSelectionType(key)">
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
  computed:{
    repas() {
      return {
        pret_a_manger: "Prêt à manger",
        pret_a_cuisiner: "Prêt à cuisiner"
      };
    }
  }
}
</script>

<style scoped>
</style>
