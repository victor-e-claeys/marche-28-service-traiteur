<template>
  <v-number-input 
    class="qty-field h-24 text-sm"
    controlVariant="split"
    v-model="computedValue" 
    :disabled="disabled"
    :reverse="false" 
    :label="label" 
    :hideInput="false" 
    :inset="false"
    :min="0"
    variant="plain"
    rounded="0"
  />
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    min: {
      type: Number,
      required: false,
      default: null
    },
    zeroable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: [
    'update:modelValue'
  ],
  computed: {
    computedValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        let updatedValue = newValue;

        if (this.min !== null && newValue < this.min) {
          if (this.zeroable !== false && newValue < this.modelValue) {
            updatedValue = 0;
          } else {
            updatedValue = this.min;
          }
        }

        if (this.zeroable === false && newValue === 0) {
          updatedValue = this.min !== null ? this.min : 1;
        }

        this.$emit('update:modelValue', updatedValue);
      }
    }
  }
}
</script>
