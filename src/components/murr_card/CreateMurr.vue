<template>
  <div class="main-create-murr-container">
    <div class="header-buttons">
      <a href="#" @click.prevent="hideCreateMurr">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>

      <el-popover placement="bottom" trigger="manual" v-model="visiblePopover">
        <i
          class="el-icon-s-operation operation-icon pointer"
          slot="reference"
          @click="visiblePopover = !visiblePopover"
        ></i>
        <el-button class="murr-button__danger" @click.prevent="clearMurrData">
          Очистить мурр?
        </el-button>
      </el-popover>

      <div>
        <a href="#" @click="changeShowAlmostDone">
          <i
            class="el-icon-arrow-right hide-icon__main-slide-fade-container"
          ></i>
        </a>
      </div>
    </div>

    <div class="main-create-murr">
      <div class="create-murr-area">
        <resizable-textarea>
          <textarea
            class="murr-header fs"
            :class="{ 'murr-header__error': murrHeaderEmpty }"
            placeholder="Заголовок"
            v-model="murrHeader"
            maxlength="224"
          ></textarea>
        </resizable-textarea>
        <div v-if="murrHeaderEmpty" class="m-form__help error-text">
          У каждого мурра есть заголовок
        </div>

        <div class="editorjs-main mb">
          <div id="editorjs"></div>
        </div>

        <transition name="slide-fade-minus-x" mode="out-in">
          <div v-if="showAlmostDone" class="almost-done-popup">
            <div class="header-buttons">
              <a href="#" @click="changeShowAlmostDone">
                <i
                  class="el-icon-arrow-left hide-icon__main-slide-fade-container"
                ></i>
              </a>
              <div>
                <el-button
                  class="murr-button"
                  @click="() => $refs.invisibleRecaptcha.execute()"
                  :loading="loading"
                >
                  Мурр готов!
                </el-button>

                <vue-recaptcha
                  ref="invisibleRecaptcha"
                  size="invisible"
                  @verify="save"
                  :sitekey="siteKey"
                />
              </div>
            </div>

            <input
              ref="input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />

            <h2 class="mb">Подготовка к выпуску:</h2>

            <div class="actions">
              <el-button
                class="murr-button__primary mb"
                @click="showFileChooser"
              >
                Загрузить обложку
              </el-button>

              <div class="modal-mask" v-show="showMurrCoverCropper">
                <vue-cropper
                  ref="cropper"
                  :view-mode="1"
                  :src="imgSrc"
                  preview=".preview"
                  class="cropper_div mb"
                />

                <el-button
                  class="murr-button__danger"
                  @click="cancelMurrCoverCropper"
                >
                  Отмена
                </el-button>

                <el-button
                  class="murr-button__success"
                  @click="saveMurrCoverCropper"
                >
                  Готово
                </el-button>
              </div>

              <p class="mb">или</p>

              <el-button
                class="murr-button__dark mb"
                @click="showEditMurrHeaderModal = true"
              >
                Поправить заголовок
              </el-button>

              <div v-if="showEditMurrHeaderModal" class="modal-mask">
                <div class="textarea-wrapper mb">
                  <resizable-textarea>
                    <label>
                      <textarea
                        class="murr-header fs"
                        placeholder="Заголовок"
                        v-model="murrHeader"
                        maxlength="224"
                      ></textarea>
                    </label>
                  </resizable-textarea>
                </div>

                <el-button
                  class="murr-button__success"
                  @click="showEditMurrHeaderModal = false"
                >
                  Готово
                </el-button>
              </div>
            </div>

            <div class="bottom">
              <p class="mb">Превью мурра:</p>
              <div class="murr-card">
                <div v-if="imgSrc" class="preview"></div>
                <p class="murr-card__description">{{ murrHeader }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import axios from "axios";
import { axios_defaults_baseURL } from "../../devAndProdVariables";
import ResizableTextarea from "../common/ResizableTextarea.js";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import VueRecaptcha from "vue-recaptcha";
import { siteKey } from "@/devAndProdVariables";

const Delimiter = require("@editorjs/delimiter");
const List = require("@editorjs/list");
const CodeTool = require("@editorjs/code");

export default {
  async mounted() {
    let murrContent = "";
    const r = this.$store.getters.showMurrContent_getters;

    if (r.murrHeader !== "" && r.murrContent !== "") {
      const raw_data = await this.$store.getters.showMurrContent_getters;
      murrContent = await JSON.parse(raw_data.murrContent);
      this.murrHeader = raw_data.murrHeader;
    }

    window.editor = new EditorJS({
      tools: {
        header: Header,
        delimiter: Delimiter,
        class: List,
        code: {
          class: CodeTool,
          config: {
            placeholder: "Введи код",
          },
        },
        image: {
          class: ImageTool,
          config: {
            additionalRequestHeaders: {
              Authorization:
                "Bearer " + this.$store.getters.accessToken_getters,
            },
            captionPlaceholder: "Коммент к фото (не обязательно)",
            field: "murr_editor_image",
            endpoints: {
              byFile:
                axios_defaults_baseURL + "/api/murr_card/save_editor_image/",
            },
          },
        },
        paragraph: {
          config: {
            placeholder: "Кликни сюда и создай свой мурр...",
          },
        },
      },
      data: murrContent,
    });

    // auto save murrData in local storage
    while (this.startCreateMurr === true) {
      await new Promise((r) => setTimeout(r, 5000));
      if (this.saveTimeOut === true) {
        let _raw_data = await window.editor.save();
        let newMurrContent = await JSON.stringify(_raw_data);
        const data = {
          murrContent: newMurrContent,
          murrHeader: this.murrHeader,
        };
        await this.saveMurrContent(data);
      }
    }
  },
  data() {
    return {
      siteKey,
      startCreateMurr: true,
      saveTimeOut: true,
      showEditMurrHeaderModal: false,
      showMurrCoverCropper: false,
      showAlmostDone: false,
      murrHeader: "",
      murrHeaderEmpty: false,
      imgSrc: "",
      cropImg: "",
      visiblePopover: false,
      loading: false,
    };
  },
  destroyed() {
    this.startCreateMurr = false;
  },
  methods: {
    ...mapActions({
      saveMurrContent: "changeSaveMurrContent_action",
      createMurrCard: "createMurrCard_action",
      notification: "popUpMessage",
    }),
    ...mapMutations(["clearMurrCards"]),
    changeShowAlmostDone() {
      if (!this.murrHeader) {
        this.murrHeaderEmpty = true;
        return;
      }
      this.showAlmostDone = !this.showAlmostDone;
    },
    cancelMurrCoverCropper() {
      this.imgSrc = "";
      this.showMurrCoverCropper = false;
    },
    hideCreateMurr() {
      this.$store.dispatch("changeShowCreateMurr_actions");
    },
    async saveMurrCoverCropper() {
      this.showMurrCoverCropper = false;
      this.cropImg = await this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    async save(recaptchaToken) {
      this.$refs.invisibleRecaptcha.reset();
      this.loading = true;
      let murr_content = await window.editor.save();
      const murrCardData = {
        recaptchaToken,
        cover: this.cropImg,
        title: this.murrHeader,
        content: await JSON.stringify(murr_content),
      };
      if (this.cropImg === "") {
        delete murrCardData.cover;
      }
      try {
        const response = await axios.post("/api/murr_card/", murrCardData, {
          headers: {
            Authorization: "Bearer " + this.$store.getters.accessToken_getters,
          },
        });
        if (response.status === 201) {
          await this.$store.dispatch("changeShowCreateMurr_actions");
          await this.$router.push({
            path: `/murr_card/${response.data.id}`,
          });
          this.startCreateMurr = false;
          this.saveTimeOut = false;
          await this.saveMurrContent({ murrContent: "", murrHeader: "" });
          this.clearMurrCards();
          this.loading = false;
        }
      } catch (e) {
        if (e.response.data.recaptcha_response_problem) {
          this.notification({
            message: "Ошибка c рекапчей",
            type: "error",
          });
          return;
        }
        this.notification({
          message: "Ошибка на сервере",
          type: "error",
        });
        this.loading = false;
      }
    },

    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          this.showMurrCoverCropper = true;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    async clearMurrData() {
      this.murrHeader = "";
      this.visiblePopover = false;
      await window.editor.clear();
    },
  },
  watch: {
    murrHeader() {
      this.murrHeaderEmpty = false;
    },
  },

  components: {
    ResizableTextarea,
    VueCropper,
    VueRecaptcha,
  },
};
</script>

<style scoped>
.murr-header__error {
  background-color: #680013 !important;
  border: 3px solid orangered !important;
  border-radius: 5px;
  transition: border 0.1s ease-in-out, background-color 0.1s ease-in-out;
}

.modal-mask {
  padding-top: 10px;
  border: 1px solid red;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 124324;
  background-color: rgba(0, 0, 0, 0.5);
}

.cropper_div {
  max-width: 500px;
  max-height: 300px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}

input[type="file"] {
  display: none;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.preview {
  height: calc(320px);
  overflow: hidden;
  border-radius: 5px;
  margin: 0 auto;
}

.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 2rem;
}

.almost-done-popup {
  position: fixed;
  background-color: #1a2931;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: #ad00ff 1px solid;
  border-radius: 5px;
  z-index: 2;
  padding: 0 10px;
}

.main-create-murr-container {
  position: fixed;
  background-color: #1a2931;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: #ad00ff 1px solid;
  border-radius: 5px;
  z-index: 1;
  padding: 0 10px;
}

.header-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-create-murr {
  overflow-y: auto;
  overflow-x: hidden;
}

.create-murr-area {
  width: 100%;
  max-height: 90%;
  max-width: 650px;
  margin: 0 auto;
}

.textarea-wrapper {
  width: 100%;
}

.murr-header {
  width: 100%;
  max-width: 620px;
  border: none;
  background-color: #1a2931;
  text-align: center;
  height: 40px;
  resize: none;
  padding: 5px;
  overflow: hidden;
  font-family: JetBrainsMono-Italic, sans-serif;
  border-radius: 5px;
  word-break: break-word;
}

.operation-icon {
  font-size: 2.5rem;
  color: #ad00ff;
  transition: 0.5s;
}

.operation-icon:hover {
  color: #b388ff;
  transform: scale(1.25);
}

.operation-icon:active {
  color: #c3a1ff;
}
</style>
