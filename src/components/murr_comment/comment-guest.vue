<template>
  <div class="murr-comment__guest">
    <div class="murr-comment__guest-info">
      Комментировать могут только авторизованные.
    </div>

    <div class="murr-comment__guest-action">
      <small class="link" @click.prevent="goSignIn">Войти</small> /
      <small class="link" @click.prevent="goSignUp">Регистрация</small>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CommentGuest",
  methods: {
    ...mapActions({
      goSignUp: "changeShownSignUpForm_actions",
      goSignIn: "changeShowLoginForm_actions",
    }),
  },
};
</script>
