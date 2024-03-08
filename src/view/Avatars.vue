<template>
  <div class="avatar-warp">
    <Avatar2
      v-if="character_source !== null"
      name="mk.seo-2"
      :soure=character_source
      :soure2=character_source
    />
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'

import Avatar from "../components/Avatar.vue";
import * as Animations from '../utils/ActionsUtils.js';
import Avatar2 from "../components/Avatar2.vue";

const character_source = ref(null)
const character_source2 = ref(null)
const character_source3 = ref(null)

onMounted(async () => {
  await init();
})

async function init() {
  await Animations.Load();
  let character = await import('../assets/Aj.fbx')
  let character2 = await import('../assets/Listening To Music.fbx')
  let character3 = await import('../assets/Rallying.fbx')
  character_source.value = character.default
  character_source2.value = character2.default
  character_source3.value = character3.default
}

</script>

<style scoped>

.avatar-warp{
  overflow: hidden;
  margin: 0;
  user-select: none;
}

</style>
