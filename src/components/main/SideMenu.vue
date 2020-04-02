<template>
  <div class="murren_menu_left">

    <div class="side-menu-panel">

      <div v-if="this.$store.getters.accessToken_getters === null">
        <i class="el-icon-user-solid avatar-place mb"></i>
        <p class="text-width mb">Присоеденись для голосования за лучший контент, создания своих мурров, поиска
          единомышленников и других штук</p>
        <div class="login-signup-bottom-div">
          <el-button class="murr-button"
                     @click="openLoginFormFromSideMenu">
            Вход
          </el-button>
          <el-button class="murr-button__primary"
                     @click="openSignUpFromSideMenu">
            Регистрация
          </el-button>
        </div>
      </div>

      <div v-if="this.$store.getters.accessToken_getters"
           class="side-menu-for-logged-in-murren">
        <p class="mb">Это меню для авторизованного Муррена.</p>
        <h2 class="mb">{{ this.$store.getters.murrenName_getters }}</h2>
        <small>Как оно должно выглядеть?</small>
      </div>

      <div class="bottom-info">

        <span class="mb link pointer"
              @click="goToAboutPage">
          О проекте</span>

        <small class="mb">v0.0.13</small>

        <el-button
            v-if="this.$store.getters.accessToken_getters"
            class="murr-button__danger"
            @click="logout">
          Выйти
        </el-button>
      </div>
    </div>

    <a href="#"
       @click.prevent="switchRightSideMenu">
      <i class="el-icon-arrow-left hide-popup_icon"></i>
    </a>

  </div>
</template>

<script>

  export default {

    methods: {
      async logout() {

        const dataForPopUpMessage = {
          message: 'Ты разлогинился 😱',
          customClass: 'element-ui-message__success',
          type: 'success'
        };

        await this.$store.dispatch('changeShowRightSideMenu_actions');
        await this.$router.push('/');
        await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
        await this.$store.dispatch('logout');
      },

      switchRightSideMenu() {
        this.$store.dispatch('changeShowRightSideMenu_actions')
      },
      openSignUpFromSideMenu() {

        this.$store.dispatch('changeShowRightSideMenu_actions');
        this.$store.dispatch('changeShownSignUpForm_actions')
      },
      openLoginFormFromSideMenu() {

        this.$store.dispatch('changeShowRightSideMenu_actions');
        this.$store.dispatch('changeShowLoginForm_actions');
      },
      goToAboutPage() {
        this.$store.dispatch('changeShowRightSideMenu_actions')
        this.$router.push('/about')
      }
    }
  }
</script>

<style scoped>

  .bottom-info {
    position: absolute;
    bottom: 0;
    padding-bottom: 60px;
    display: flex;
    flex-direction: column;
  }

  .side-menu-for-logged-in-murren {
    max-width: 300px;
    height: 100%;
  }

  .text-width {
    max-width: 300px;
  }

  .avatar-place {
    font-size: 10rem;
  }

  .side-menu-panel {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .murren_menu_left {
    position: fixed;
    background-color: #1a2931;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    display: flex;
    border: #AD00FF 1px solid;
    border-radius: 5px;
    z-index: 2;
  }

  .hide-popup_icon {
    font-size: 4rem;
    color: #AD00FF;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    padding-right: 3rem;
    transition: 0.5s;
  }

  .hide-popup_icon:hover {
    font-size: 5rem;
    color: #B388FF;
  }

  .hide-popup_icon:active {
    color: #C3A1FF;
  }

</style>