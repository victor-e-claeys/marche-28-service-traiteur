<template>
  <div v-if="users">
    <v-autocomplete v-model="user" :disabled="isUpdating" :items="users" chips closable-chips item-title="fullName"
      item-value="ID" label="Select">
      <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" :text="item.fullName"></v-chip>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :title="item.fullName"></v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
export default {
  name: 'User',
}
</script>
