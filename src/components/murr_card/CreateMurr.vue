<template>
  <div class="main-create-murr-container">
    <div class="header-buttons mb">
      <a href="#" @click.prevent="hideCreateMurr">
        <i class="el-icon-close hide-icon__main-slide-fade-container"></i>
      </a>

      <div>
        <i
          class="el-icon-check hide-icon__main-slide-fade-container pointer"
          @click="() => $refs.recaptcha.execute()"
        ></i>
        <recaptcha ref="recaptcha" @verify="save" />
      </div>
    </div>

    <div class="main-create-murr">
      <div class="create-murr-area">
        <resizable-textarea>
          <textarea
            class="murr-header fw900 input-murr-header-area"
            :class="{ 'murr-header__error': murrHeaderEmpty }"
            placeholder="Несколько слов"
            v-model="murrHeader"
            maxlength="224"
          ></textarea>
        </resizable-textarea>
        <div v-if="murrHeaderEmpty" class="m-form__help error-text">
          У каждого мурра есть несколько слов
        </div>

        <input
          ref="input"
          type="file"
          name="image"
          accept="image/*"
          @change="setImage"
        />

        <div class="actions">
          <el-tooltip
            class="item"
            effect="dark"
            content="Очистить мурр"
            placement="top"
          >
            <i
              class="el-icon-delete hide-icon__main-slide-fade-container pointer mr"
              @click.prevent="clearMurrData"
            ></i>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="Добавить мурру обложку"
            placement="top"
          >
            <i
              class="el-icon-picture-outline hide-icon__main-slide-fade-container pointer mb mr"
              @click="showFileChooser"
            ></i>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="Предпросмотр мурра"
            placement="top"
            v-if="imgSrc"
          >
            <i
              class="el-icon-view hide-icon__main-slide-fade-container pointer mb mr"
              @click="showMurrPreview = !showMurrPreview"
            ></i>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="Очистить обложку мурра"
            placement="top"
            v-if="imgSrc"
          >
            <i
              class="el-icon-circle-close hide-icon__main-slide-fade-container pointer mb mr"
              @click="imgSrc = ''"
            ></i>
          </el-tooltip>

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

            <div class="bottom absolute" v-show="showMurrCoverCropper">
              <p class="mb">Превью мурра:</p>
              <div class="murr-card">
                <div v-if="imgSrc" class="preview"></div>
                <p class="murr-card__description">{{ murrHeader }}</p>
              </div>
            </div>
          </div>
          <div class="editorjs-main mb">
            <div id="editorjs"></div>
          </div>
          <div class="bottom mb" v-show="showMurrPreview">
            <p class="mb">Превью мурра:</p>
            <div class="murr-card__preview">
              <div class="murr-card">
                <div v-if="imgSrc" class="preview"></div>
                <p class="murr-card__description">{{ murrHeader }}</p>
              </div>
            </div>
          </div>
        </div>
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
import {
  axios_defaults_baseURL,
  newMurrInReleaseStatus,
} from "../../devAndProdVariables";
import ResizableTextarea from "../common/ResizableTextarea.js";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import Recaptcha from "../common/Recaptcha";

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
            placeholder: "Сделай большой и красивый мурр...",
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
      startCreateMurr: true,
      saveTimeOut: true,
      showMurrCoverCropper: false,
      showAlmostDone: false,
      murrHeader: "",
      murrHeaderEmpty: false,
      imgSrc: "",
      cropImg: "",
      visiblePopover: false,
      loading: false,
      showMurrPreview: true,
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
      if (!this.murrHeader) {
        this.murrHeaderEmpty = true;
        return;
      }
      if (this.murrHeader.trim().length === 0) {
        this.murrHeaderEmpty = true;
        return;
      }
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
          data: {
            status: newMurrInReleaseStatus,
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
    Recaptcha,
  },
};
</script>

<style scoped lang="scss">
@import "../../../src/assets/scss/variables";
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
  background-color: rgba(0, 0, 0, 1);
}

.murr-card__preview {
  box-shadow: -1px -1px 20px 1px #ab25f9, 1px 1px 20px 1px #ab25f9;
  border-radius: 3px;
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
  left: 0;
  bottom: 1rem;
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

.textarea-wrapper {
  width: 100%;
}

</style>
