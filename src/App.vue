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

.el-container {


}

.el-header{

}


.el-main {
  position: relative;
  width: 100%;
  left: 0;
}

</style>
