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
  import {mapActions} from "vuex"

  export default {
    computed: {
      layout() {
        return this.$route.meta.layout
      },
    },
    components: {
      EmptyLayout, MainLayout
    },
    methods: {
      ...mapActions({
        setClearState: 'callSetClearState_actions',
      }),
    },
    async beforeMount() {
      await this.setClearState()
    }
  }
</script>

<style>

</style>
