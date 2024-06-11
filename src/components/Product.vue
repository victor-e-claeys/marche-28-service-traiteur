<template>
  <div class="product flex-grow flex flex-col justify-center">
    <img
      class="aspect-square object-cover"
      :src="modelValue.image?.sizes.medium.url"
      :alt="modelValue.name"
    />
    <div class="product-details flex-grow p-3 flex flex-col">
      <h3 class="text-left flex-grow wp-font-text text-lg self-start mb-4">
        {{ modelValue.name }}
      </h3>
      <div class="variations flex flex-col" v-if="modelValue.variations">
        <div class="variation-details flex justify-between">
          <div
            class="variation-qty"
            v-for="(variation, index) in adjustedVariations"
            :key="index"
          >
            <NumberInput
              v-model="modelValue.variations[variation.id].qty"
              :label="variationName(variation)"
              :min="variation.attributes?.pa_portions == 'enfant' ? 4 : null"
            />
          </div>
        </div>
        <div
          class="variations-price-data whitespace-nowrap flex gap-1 wp-font-text text-sm align-center self-center"
          v-for="(variation, index) in adjustedVariations"
          :key="index"
        >
          <span class="variation-name text-xs">
            {{ variationName(variation) }}
          </span>
          <span class="variation-price">
            {{ moneyFormatter.format(variation.price) }}
          </span>
          <span class="variation-per">
            {{ variation.qty > 0 ? `&times; ${variation.qty}` : "par portion" }}
          </span>
          <span
            v-if="variation.qty > 0"
            class="variation-total pipe font-semibold"
          >
            {{ moneyFormatter.format(variation.price * variation.qty) }}
          </span>
        </div>
      </div>
      <div v-if="!modelValue.variations" class="product-details flex flex-col">
        <div class="product-qty self-start">
          <NumberInput v-model="modelValue.qty" />
        </div>
        <div
          class="product-price-data whitespace-nowrap min-h-10 flex gap-1 wp-font-text text-sm align-middle items-center self-center"
        >
          <span class="product-price">
            {{ moneyFormatter.format(modelValue.price) }}
          </span>
          <span class="product-per">
            {{
              modelValue.qty > 0 ? `&times; ${modelValue.qty}` : "par portion"
            }}
          </span>
          <span
            v-if="modelValue.qty > 0"
            class="product-total pipe font-semibold"
          >
            {{ moneyFormatter.format(modelValue.price * modelValue.qty) }}
          </span>
        </div>
      </div>
      <v-dialog max-width="500" attach="#app" class="">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            class="mt-2 cursor-pointer wp-global-color-forest-green"
          >
            <template v-slot:prepend>
              <IconFiche />
            </template>
            Fiche informative
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <v-card-title
              class="flex justify-space-between align-top text-balance"
            >
              <h2 class="text-ellipsis overflow-hidden flex-shrink">
                {{ modelValue.name }}
              </h2>

              <v-btn
                icon="mdi-close cursor-pointer"
                variant="text"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-title>
            <v-card-text v-html="sanitizeHTML(modelValue.desc)" />
          </v-card>
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import NumberInput from "./NumberInput.vue";
import IconFiche from "./icons/IconFiche.vue";
</script>

<script>
export default {
  name: "Product",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    variationName(variation) {
      return Object.values(variation.attributes).join(" ");
    },
  },
  computed: {
    adjustedVariations() {
      return Object.values(this.modelValue.variations).sort((a, b) => {
        return a.price - b.price;
      });
    },
  },
};
</script>

<style scoped></style>
