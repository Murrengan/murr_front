<template>
  <div class="main">

    <TopNavbar/>
    <div class="div-for-move-down__view-container"></div>

    <div class="view-container">

      <transition
          name="fade"
          mode="out-in"
      >
        <router-view/>
      </transition>
    </div>

    <BottomNavbar/>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <SignUp
          v-if="this.$store.getters.showRegisterForm_getters"/>
    </transition>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <Login
          v-if="this.$store.getters.showLoginForm_getters"/>
    </transition>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <ResetPassword
          v-if="this.$store.getters.showResetPasswordForm_getters"/>
    </transition>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <CreateMurr
          v-if="this.$store.getters.showCreateMurr_getters"/>
    </transition>

  </div>
</template>

<script>

  import BottomNavbar from '@/components/main/BottomNavbar'
  import TopNavbar from '@/components/main/TopNavbar'
  import SignUp from "@/views/murren/SignUp";
  import Login from "@/views/murren/Login";
  import ResetPassword from "@/views/murren/ResetPassword";
  import CreateMurr from "../views/murr_card/CreateMurr";

  export default {
    name: 'main-layout',
    data: () => ({}),
    components: {
      BottomNavbar,
      TopNavbar,
      SignUp,
      Login,
      ResetPassword,
      CreateMurr,
    }
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