<script setup>
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header></el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>

</template>

<style scoped>


body {

}


.el-header{

}

.el-main {
  position: relative;
  width: 100%;
  left: 0;

  background: #535bf2;

}

</style>
