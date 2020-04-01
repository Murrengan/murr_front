<template>
  <div class="footer">

    <router-link
        exact
        active-class="bottom_icon-active"
        class="bottom_icon"
        to="/">
      <i class="el-icon-view"></i>
    </router-link>

    <span
        class="bottom_icon pointer"
        @click="openCreateMurr">
      <i class="el-icon-edit-outline"></i>
    </span>

    <router-link
        active-class="bottom_icon-active"
        class="bottom_icon"
        to="/murren">
      <i class="el-icon-picture-outline-round"></i>
    </router-link>

  </div>
</template>

<script>
  export default {
    methods: {
      async openCreateMurr() {
        if (this.$store.getters.accessToken_getters) {
          await this.$store.dispatch('changeShowCreateMurr_actions')
        } else {
          const dataForPopUpMessage = {
            message: 'Для создания мурра ребуется авторизация 😳',
            customClass: 'element-ui-message__error',
            type: 'warning'
          };
          await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
          await this.$store.dispatch('changeShowLoginForm_actions');
        }
      }
    }
  }
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