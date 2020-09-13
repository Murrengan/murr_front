<template>
  <div>
    <transition :name="transition">
      <div v-if="payload" class="modal">
        <div class="modal__header">
          <el-button
            class="modal__close"
            @click="onClose"
            icon="el-icon-close"
            type="text"
          />
        </div>

        <div class="modal__content">
          <component
            :is="payload.component.render"
            :context="payload.component.context"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Modal",
  computed: {
    ...mapGetters({
      isOpen: "modal/isOpen",
      payload: "modal/payload",
      transition: "modal/transition",
    }),
  },
  methods: {
    onClose() {
      this.$store.commit("modal/close");
    },
  },
  watch: {
    isOpen(value) {
      if (value) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.removeAttribute("style");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 99;
  background-color: #1a2931;
  border: #ad00ff 1px solid;

  padding: 1.5rem 3rem;
  word-break: break-word;

  overflow-y: auto;
  overflow-x: hidden;

  &__header {
    position: fixed;
    top: 0;
    right: 10px;
    z-index: 100;
  }

  &__close {
    font-size: 2.5rem;
    transition: color 250ms;
    color: #ad00ff;

    &:hover {
      color: lighten(#ad00ff, 10%);
    }
  }
}
</style>
