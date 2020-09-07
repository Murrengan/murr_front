<template>
  <div class="comment-form">
    <form @submit.prevent="() => $refs.invisibleRecaptcha.execute()">
      <resizable-textarea>
        <textarea
          class="comment-form__text"
          placeholder="Оставь комментарий..."
          maxlength="224"
          v-model.trim="text"
          ref="textarea"
          @keyup.ctrl.enter="() => $refs.invisibleRecaptcha.execute()"
          @focus="handlerFocused($event)"
          @blur="handlerFocused($event)"
        ></textarea>
      </resizable-textarea>

      <div v-if="isFocused" class="comment-form__panel">
        <div class="comment-form__information">
          Отправить сообщение CTRL + ENTER
        </div>
        <el-button
          type="primary"
          native-type="submit"
          class="comment-form__button"
          :loading="isLoading"
          :disabled="readyIsSend"
          size="small"
        >
          Отправить
        </el-button>
      </div>

      <vue-recaptcha
        ref="invisibleRecaptcha"
        size="invisible"
        @verify="handlerSubmint"
        :sitekey="siteKey"
      />
    </form>
  </div>
</template>

<script>
import ResizableTextarea from "../common/ResizableTextarea.js";
import VueRecaptcha from "vue-recaptcha";
import { siteKey } from "../../devAndProdVariables.js";

export default {
  name: "CommentForm",
  props: {
    focusAfterShow: {
      type: Boolean,
      default: false,
    },
    hideButton: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    siteKey,
    text: "",
    isLoading: false,
    isFocused: false,
  }),
  mounted() {
    if (this.focusAfterShow) {
      this.$refs.textarea.focus();
    }
    this.isFocused = !this.hideButton;
  },
  methods: {
    handlerSubmint(recaptchaToken) {
      this.$refs.invisibleRecaptcha.reset();
      this.isLoading = true;

      this.$emit("submitComment", {
        text: this.text,
        recaptchaToken,
        resetForm: () => {
          this.text = "";
          this.isLoading = false;
          this.$refs["textarea"].focus();
          this.$refs["textarea"].style.height = "auto";
        },
      });
    },
    handlerFocused({ type }) {
      if (!this.hideButton) {
        return;
      }
      if (type === "focus") {
        this.isFocused = true;
      } else if (type === "blur" && !this.text.length) {
        this.isFocused = false;
      }
    },
  },
  computed: {
    readyIsSend() {
      return !this.text.length;
    },
  },
  components: {
    ResizableTextarea,
    VueRecaptcha,
  },
};
</script>
