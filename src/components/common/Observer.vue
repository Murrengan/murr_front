<template>
  <div class="observer"></div>
</template>

<script>
export default {
  data: () => ({
    observer: null,
  }),
  mounted() {
    let options = { rootMargin: "600px" };
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.$emit("murrIntersect");
      }
    }, options);

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>

<style scoped></style>
