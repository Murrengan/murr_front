<template>
  <div class="footer">

    <router-link
        exact
        active-class="bottom_icon-active"
        class="bottom_icon"
        to="/">
      <i class="el-icon-picture-outline-round"></i>
    </router-link>

    <router-link
        active-class="bottom_icon-active"
        class="bottom_icon"
        to="/murren">
      <i class="el-icon-edit-outline"></i>
    </router-link>

  </div>
</template>

<script>

</script>

<style scoped>

  .bottom_icon {
    opacity: 0.8;
    color: orangered;
    font-size: 38px;
  }

  .bottom_icon-active {
    opacity: 1;
    filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 1));
  }

  .footer {
    background-color: #AD00FF;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

</style>