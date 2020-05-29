<template>
  <div class="main">

    <TopNavbar/>
    <div class="div-for-move-down__view-container"></div>

    <div class="view-container">
      <router-view/>
    </div>

    <BottomNavbar/>

  </div>
</template>

<script>

  export default {
    name: 'main-layout',
    data: () => ({}),
  }
</script>

<style scoped>

  .div-for-move-down__view-container {
    height: 50px;
  }

  .main {
    height: 100vh;
    background-color: #1a2931;
    overflow-y: hidden;
  }

  .view-container {
    width: 100%;
    height: calc(100% - 50px);
    padding-bottom: 50px;
    padding-top: 10px;
    text-align: center;
    overflow-y: auto;
  }

</style>
