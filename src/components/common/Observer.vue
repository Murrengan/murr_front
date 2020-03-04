<template>
  <div class="observer"></div>
</template>

<script>
  export default {
    data: () => ({
      observer: null
    }),
    mounted() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          this.$emit('murrIntersect')
        }
      })

      this.observer.observe(this.$el)
    },
    destroyed() {
      this.observer.disconnect()
    }
  }
</script>

<style scoped>

</style>