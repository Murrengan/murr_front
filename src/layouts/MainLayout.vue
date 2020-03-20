<template>
  <div class="main">

    <TopNavbar/>

    <div class="nav-container">

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

  </div>
</template>

<script>

    import BottomNavbar from '@/components/main/BottomNavbar'
    import TopNavbar from '@/components/main/TopNavbar'
    import SignUp from "@/views/murren/SignUp";
    import Login from "@/views/murren/Login";
    import ResetPassword from "@/views/murren/ResetPassword";

    export default {
        name: 'main-layout',
        data: () => ({}),
        components: {
            BottomNavbar,
            TopNavbar,
            SignUp,
            Login,
            ResetPassword
        }
    }
</script>

<style scoped>

  .main {
    height: 100vh;
    background-color: #1a2931;
  }

  .nav-container {
    width: 100%;
    padding-bottom: 50px;
    padding-top: 60px;
    text-align: center;
  }

</style>