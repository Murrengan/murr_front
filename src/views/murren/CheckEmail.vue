<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchCheckEmail">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <a href="#" @click.prevent="switchCheckEmail">
      <img
          src="@/assets/img/logo_in_circle.png"
          alt="circle_logo"
          class="murrengan-logo mb">
    </a>

    <h1 class="mb">Замечательно!</h1>
    <p class="mb">Подтверди почту и добро пожаловать!</p>
    <small class="mb">Если письмо задерживается, проверь папку рассылки или спама</small>

    <div>
      <el-button
          class="murr-button"
          @click="shownLoginForm">
        Войти
      </el-button>
    </div>

    <transition
        name="slide-fade-y"
        mode="out-in">
      <Login
          v-if="this.$store.getters.showLoginForm_getters"/>
    </transition>

  </div>

</template>

<script>
    import Login from "@/views/murren/Login";

    export default {

        methods: {

            shownLoginForm() {

                this.$store.dispatch('changeCheckEmail_actions');
                this.$store.dispatch('changeShowLoginForm_actions')
            },

            switchCheckEmail() {
                this.$store.dispatch('changeCheckEmail_actions')
            }

        },
        components: {Login}
    }

</script>

<style scoped>

</style>