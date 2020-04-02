<template>
  <div class="top-navbar">
    <nav>
      <ul class="flex-container">

        <li class="child-left user-icon">
          <a href="#" @click.prevent="showRightSideMenu">
            <i class="el-icon-user-solid"></i>
          </a>
        </li>

        <li class="child-right">
          <small>тут планируется строка поиска</small>
        </li>

      </ul>
    </nav>

    <transition
        name="slide-fade-x"
        mode="out-in">

      <SideMenu v-if="this.$store.getters.showRightSideMenu_getters"/>

    </transition>

  </div>
</template>

<script>
    import SideMenu from "@/components/main/SideMenu";

    export default {

        components: {SideMenu},

        data: () => ({
            show_showRightSideMenu: false,
        }),
        methods: {
            showRightSideMenu() {
                this.$store.dispatch('changeShowRightSideMenu_actions');
            }
        }
    }
</script>

<style scoped>

  nav {
    height: 50px;
    position: fixed;
    width: 100%;
    background-color: #1a2931;
    border-bottom: 1px solid #AD00FF;
  }

  .flex-container {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .child-left {
    flex: 20;
    text-align: center;
  }

  .child-right {
    flex: 80
  }

  .user-icon {
    font-size: 30px;
    opacity: 0.8;
  }

</style>