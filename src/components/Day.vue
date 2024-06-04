<template>
  <div>
    <h3>{{ modelValue.date.day }}</h3>
    <div @click="() => setSelectionType('pret_a_manger')">
      Prêt à manger
    </div>
    <div @click="() => setSelectionType('pret_a_cuisiner')">
      Prêt à cuisiner
    </div>
    <div>
      {{modelValue.selectionType}}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
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
  }
}
</script>

<style scoped>
</style>
