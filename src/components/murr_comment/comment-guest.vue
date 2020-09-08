<template>
  <div class="murr-comment__guest">
    <div class="murr-comment__guest-info">
      Комментировать могут только авторизованные.
    </div>

    <div class="murr-comment__guest-action">
      <span class="link" @click.prevent="goSignIn">Войти</span> |
      <span class="link" @click.prevent="goSignUp">Регистрация</span>
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
