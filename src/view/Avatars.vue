<template>
  <div class="avatar-warp">
    <Avatar
      name="mk.seo-1"
      soure="../soruce/Walking.fbx"
    />
    <Avatar
      name="mk.seo-2"
      soure="../soruce/Walking_walk.fbx"
    />
  </div>
</template>

<script setup>
import Avatar from "../components/Avatar.vue";
</script>

<style scoped>

.avatar-warp{
  position: relative;
  display: flex;
}

</style>
