<template>
  <div class="avatar-warp">
    <Avatar
      v-if="character_source !== null"
      name="mk.seo-1"
      :soure=character_source
    />
    <Avatar
      v-if="character_source !== null"
      name="mk.seo-2"
      :soure=character_source
    />
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'

import Avatar from "../components/Avatar.vue";


const character_source = ref(null)

onMounted(async () => {
  await init();
})

async function init() {
  let character = await import('../assets/Walking.fbx')
  character_source.value = character.default
}

</script>

<style scoped>

.avatar-warp{
  position: relative;
  display: flex;
}

</style>
