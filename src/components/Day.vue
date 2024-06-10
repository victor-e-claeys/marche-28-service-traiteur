<script setup>
import Product from "./Product.vue";
</script>

<template>
  <h3
    :class="[
      'day-name',
      'text-center',
      'uppercase',
      'wp-font-primary',
      'p-2',
      'm-0',
      'text-white',
      'bg-black',
      'lg:row-start-1',
      'max-lg:text-2xl',
      'xs:max-lg:col-span-2',
      'sticky',
      'top-0',
      'z-10'
      //'max-lg:origin-center',
      //'max-lg:-rotate-90',
      //'max-lg:w-8',
      //'max-sm:rotate-0',
      //'max-sm:w-full'
    ]"
  >
    {{ modelValue.date.day }}
  </h3>
  <div
    v-if="!modelValue.available"
    :class="[
      'flex',
      'flex-col',
      'selection-type',
      'justify-center',
      'min-h-40',
      'lg:row-start-2',
      'lg:row-span-2',
      'xs:max-lg:col-span-2',
      'max-lg:-my-4',
    ]"
  >
    <v-btn
      class="title-unavailable grow-0 wp-font-primary flex-none cursor-pointer"
      :readonly="true"
    >
      Non disponible
    </v-btn>
    <div class="box-unavailable flex-grow"></div>
  </div>
  <div
    v-if="modelValue.available"
    :class="[
      'repas',
      '@container',
      'flex',
      'flex-col',
      'lg:row-start-2',
      'wp-font-primary'
    ]"
  >
    <div
      v-if="
        modelValue.products.pret_a_manger && modelValue.products.pret_a_cuisiner
      "
      :class="[
        'selection-type',
        'flex',
        'flex-col',
        '@[16rem]:flex-row',
        'justify-center'
      ]"
    >
      <v-btn
      class="cursor-pointer"
        v-for="(label, key) in selectionTypes"
        :key="key"
        :readonly="modelValue.selectionType == key"
        :class="{
          '@[16rem]:flex-1': true,
          'selection-type-button': true,
          active: modelValue.selectionType == key,
        }"
        @click="() => setSelectionType(key)"
      >
        {{ label }}
      </v-btn>
    </div>
    <Product
      v-if="
        modelValue.selectionType != 'pret_a_cuisiner' &&
        modelValue.products.pret_a_manger
      "
      type="pret_a_manger"
      v-model="modelValue.products.pret_a_manger"
    />
    <Product
      v-if="
        modelValue.selectionType == 'pret_a_cuisiner' &&
        modelValue.products.pret_a_cuisiner
      "
      type="pret_a_cuisiner"
      v-model="modelValue.products.pret_a_cuisiner"
    />
  </div>
  <div
    v-if="modelValue.products.collation"
    :class="[
      '@container',
      'flex',
      'flex-col',
      'collation',
      'lg:row-start-3'
    ]"
  >
    <v-btn
      class="text-center wp-font-primary cursor-pointer"
      :readonly="true"
      size="small"
    >Collation</v-btn>
    <Product 
      v-model="modelValue.products.collation" 
      type="collation"
    />
  </div>
</template>

<script>
export default {
  name: "Day",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    setSelectionType(type) {
      // "pret_a_manger" ou "pret_a_cuisiner"
      this.$emit("update:modelValue", {
        ...this.modelValue,
        selectionType: type,
      });
    },
  },
  created() {
    if (!this.selectionType) this.setSelectionType("pret_a_manger");
  },
};
</script>

<style scoped></style>
