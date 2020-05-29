<template>
  <div id="app">

    <header class="murr-heading murr-heading-wrapper"
            :style="{ backgroundColor: this.colorOnHover }">
      <img src="@/assets/img/murr_logo_and_name.png"
           alt=""
           class="murr-logo"
           @mouseover="changeColorOnHover">
    </header>

    <div class="sticky-wrapper flex-container murr-heading-wrapper"
         :style="{ backgroundColor: this.colorOnHover }">
      <router-link
          exact
          active-class="active"
          class="flex-item header-link"
          to="/">
        Мурры
      </router-link>
      <router-link
          active-class="active"
          class="flex-item header-link"
          to="/murren">
        <span class="flex-item" v-if="this.murrenName_getters">{{ this.murrenName_getters }}</span>
        <span class="flex-item" v-else>Войти</span>
      </router-link>
      <span class="flex-item header-link"
            @click.prevent="showRightSideMenu">Меню</span>
      <span class="flex-item header-link"
            @click.prevent="openCreateMurr">Создать</span>
    </div>

    <router-view/>

    <transition
        name="slide-fade-x"
        mode="out-in">
      <SideMenu v-if="this.$store.getters.showRightSideMenu_getters"/>
    </transition>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <SignUp
          v-if="this.$store.getters.showRegisterForm_getters"/>
      <Login
          v-if="this.$store.getters.showLoginForm_getters"/>
      <ResetPassword
          v-if="this.$store.getters.showResetPasswordForm_getters"/>
      <CreateMurr
          v-if="this.$store.getters.showCreateMurr_getters"/>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SignUp from "@/views/murren/SignUp"
  import Login from "@/views/murren/Login"
  import ResetPassword from "@/views/murren/ResetPassword"
  import CreateMurr from "@/views/murr_card/CreateMurr"
  import SideMenu from "@/components/main/SideMenu"

  export default {
    computed: {
      ...mapGetters([
        'murrenName_getters',
      ])
    },
    components: {
      SignUp,
      Login,
      ResetPassword,
      CreateMurr,
      SideMenu
    },
    data: () => ({
      show_showRightSideMenu: false,
      colorOnHover: false
    }),
    methods: {
      changeColorOnHover() {
        this.colorOnHover = `rgb(${Math.floor(Math.random() * (220 - 50) + 50)}, ${Math.floor(Math.random() * (220 - 50) + 50)}, ${Math.floor(Math.random() * (220 - 50) + 50)})`
      },
      showRightSideMenu() {
        this.$store.dispatch('changeShowRightSideMenu_actions')
      },
      async openCreateMurr() {
        if (this.$store.getters.accessToken_getters) {
          await this.$store.dispatch('changeShowCreateMurr_actions')
        } else {
          const dataForPopUpMessage = {
            message: 'Для создания мурра ребуется авторизация 😳',
            customClass: 'element-ui-message__error',
            type: 'warning'
          }
          await this.$store.dispatch('popUpMessage', dataForPopUpMessage)
          await this.$store.dispatch('changeShowLoginForm_actions')
        }
      }
    },
  }
</script>

<style>

  .murr-heading-wrapper {
    background-color: #AD00FF;
  }

  .sticky-wrapper {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .active {
    background-color: #1a2931 !important;
  }

  .murr-heading {
    width: 100%;
    height: 73px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .murr-logo {
    width: 224px;
    transition: all 0.8s ease 0s;
    cursor: pointer;
  }

  .flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
  }

  .flex-item {
    align-self: auto;
    text-align: center;
    font-size: 18px;
    font-family: "JetBrainsMono-Bold", serif;
  }

  .header-link:hover {
    transition: 0.3s;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .header-link {
    color: white;
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    padding: 10px 0;
  }
</style>
