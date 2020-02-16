<template>
  <div id="app">

    <component :is="layout">

      <router-view/>

    </component>

  </div>
</template>

<script>
    import EmptyLayout from '@/layouts/EmptyLayout.vue'
    import MainLayout from '@/layouts/MainLayout.vue'

    export default {

        computed: {

            layout() {
                return this.$route.meta.layout
            },
        },

        components: {
            EmptyLayout, MainLayout
        }
    }
</script>

<style>

</style>
