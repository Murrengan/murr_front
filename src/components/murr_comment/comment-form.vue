<template>
  <div class="comment-form">
    <form @submit.prevent="$refs.recaptcha.execute">
      <div class="comment-form__typing-area">
        <resizable-textarea>
          <textarea
            class="comment-form__text"
            :class="{ warning: isWarningMaxLength }"
            placeholder="Оставь комментарий..."
            :maxlength="maxLengthComment"
            v-model.trim="text"
            ref="textarea"
            @keyup.ctrl.enter="$refs.recaptcha.execute"
            @focus="onFocused($event)"
            @blur="onFocused($event)"
          ></textarea>
        </resizable-textarea>
        <div
          class="comment-form__typing-lenght"
          :class="{ warning: isWarningMaxLength }"
        >
          {{ charactersLeft }}/{{ maxLengthComment }}
        </div>
      </div>

      <div v-if="isFocused" class="comment-form__panel">
        <div class="comment-form__information">
          Отправить сообщение CTRL + ENTER
        </div>
        <el-button
          type="primary"
          native-type="submit"
          class="comment-form__button"
          :loading="isLoading"
          :disabled="readySend"
          size="small"
        >
          Отправить
        </el-button>
      </div>

      <recaptcha ref="recaptcha" @verify="onSubmitComment" />
    </form>
  </div>
</template>

<script>
import ResizableTextarea from "../common/ResizableTextarea.js";
import Recaptcha from "../common/Recaptcha";

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
    text: "",
    isLoading: false,
    isFocused: false,
    maxLengthComment: 1500,
  }),
  mounted() {
    if (this.focusAfterShow) {
      this.$refs.textarea.focus();
    }
    this.isFocused = !this.hideButton;
  },
  methods: {
    onSubmitComment(recaptchaToken) {
      if (this.text.length > this.maxLengthComment) {
        return;
      }

      this.isLoading = true;

      // Send event parent component
      this.$emit("onSubmitComment", {
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
    onFocused({ type }) {
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
    readySend() {
      return !this.text.length;
    },
    charactersLeft() {
      return this.maxLengthComment - this.text.length;
    },
    isWarningMaxLength() {
      return this.charactersLeft <= 100;
    },
  },
  components: {
    ResizableTextarea,
    Recaptcha,
  },
};
</script>
