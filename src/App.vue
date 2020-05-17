<template>
  <div id="app">

    <component :is="layout">

      <router-view/>

    </component>

    <div
        class="is-staff-getter"
        v-if="this.isStaff_getters">

      <el-button
          class="murr-button__dark"
          @click="generateSignUpToken">
        Выдать токен
      </el-button>

    </div>
  </div>
</template>

<script>
  import EmptyLayout from '@/layouts/EmptyLayout.vue'
  import MainLayout from '@/layouts/MainLayout.vue'
  import {mapActions, mapGetters} from "vuex"
  import axios from 'axios'

  export default {
    computed: {
      ...mapGetters([
        'isStaff_getters'
      ]),
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
        notification: 'popUpMessage',
      }),
      async generateSignUpToken() {
        const token = await axios.get('api/murren/token_generate', {
          headers: {Authorization: `Bearer ${this.$store.getters.accessToken_getters}`},
        })
        // function setClipboard(value) {
        const tempInput = document.createElement("input")
        tempInput.style = "position: absolute; left: -1000px; top: -1000px"
        tempInput.value = token.data
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand("copy")
        document.body.removeChild(tempInput)
        // }
        this.notification({
          message: `Токен успешно выдан - ${token.data}`,
          type: 'success',
        })
      }
    },
    async beforeMount() {
      await this.setClearState()
    }
  }
</script>

<style>
  .is-staff-getter {
    position: absolute;
    bottom: 10%;
    right: 5%;
    padding: 5px;
    background-color: orangered;
    border-radius: 5px;
    transition: 0.5s;
  }

  .is-staff-getter:hover {
    transform: scale(1.1);
  }
</style>
