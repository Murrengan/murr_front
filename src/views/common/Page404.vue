<template>
  <div class="main-slide-fade-container justify-content-center">
    <div >
      <h2 class="mb">Тут ничего нет</h2>
      <p class="mb">
        То, что ты ищешь, в настоящее время не существует по этому адресу.
      </p>
      <p class="mb">
        Если только ты не ищешь страницу с ошибкой, в таком случае: поздравляю!
      </p>
      <p>Ты нашел её 😘</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404",
  mounted() {
    setTimeout(this.goHome, 3500);
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>
