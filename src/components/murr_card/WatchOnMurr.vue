<template>
  <div class="home-main-container">
    <div class="murr-panel">
      <div class="more-btn" @click="showMurrPanelButtons">
        <i class="el-icon-more-outline pointer p"></i>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="this.murrPanelButtons">
          <el-button class="murr-button__primary p mr05" @click="copyMurrLink">
            <i class="el-icon-share"></i>
          </el-button>
          <el-button
            v-if="this.murrOwnerId === this.murrenId_getters"
            class="murr-button__danger p mr05"
            @click="deleteMurr"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </transition>
    </div>
    <div class="mb">
      <h1 class="murr-header fs2">{{ this.murrTitle }}</h1>
    </div>

    <div class="create-murr-area">
      <div class="editorjs-main">
        <div
          v-for="(i, index) in this.murr_content.blocks"
          :key="index"
          class="mb-half"
        >
          <h2 v-if="i.type === 'header'">{{ i.data.text }}</h2>

          <p v-if="i.type === 'paragraph'" v-html="i.data.text" class="mb"></p>

          <img
            v-if="i.type === 'image'"
            :src="i.data.file.url"
            class="image-tool__image-picture"
            alt=""
          />

          <p v-if="i.data.caption" class="cdx-input mb">{{ i.data.caption }}</p>

          <div
            v-if="i.type === 'delimiter'"
            class="ce-delimiter cdx-block"
          ></div>

          <ul
            v-if="i.type === 'class'"
            class="cdx-block cdx-list cdx-list--ordered"
          >
            <li
              v-for="(element, index) in i.data.items"
              :key="index"
              class="cdx-list__item"
            >
              {{ element }}
            </li>
          </ul>

          <pre class="murr-code-snippet mb" v-if="i.type === 'code'">{{
            i.data.code
          }}</pre>
        </div>
      </div>
    </div>

    <comments v-if="murrOwnerId" />
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { axios_defaults_baseFrontURL } from "@/devAndProdVariables";
import Comments from "../murr_comment/Comments.vue";

export default {
  computed: {
    ...mapGetters(["murrenId_getters"]),
  },
  async beforeCreate() {
    // fix for navbar hide murr_content
    await window.scrollTo(0, -42);
    const murr_id = this.$route.params.id;
    const murrCardData = await axios.get(`/api/murr_card/${murr_id}/`);

    this.murrTitle = murrCardData.data.title;
    this.murr_content = JSON.parse(murrCardData.data.content);
    this.murrOwnerId = murrCardData.data.owner;
  },
  data: () => ({
    dataForMurr: "",
    murrTitle: "",
    murr_content: "",
    murrPanelButtons: false,
    murrOwnerId: null,
  }),
  methods: {
    ...mapActions({
      notification: "popUpMessage",
    }),
    ...mapMutations(["clearMurrCards"]),
    showMurrPanelButtons() {
      this.murrPanelButtons = !this.murrPanelButtons;
    },
    copyMurrLink() {
      const tempInput = document.createElement("input");
      tempInput.value = axios_defaults_baseFrontURL + this.$route.fullPath;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      this.notification({
        message: `Линка на мурр скопирована 😊`,
        type: "success",
      });
    },

    deleteMurr() {
      this.$confirm("Точно удалить мурр?", "Внимание!", {
        confirmButtonText: "Да",
        cancelButtonText: "Отмена",
        cancelButtonClass: "murr-button__primary",
        confirmButtonClass: "murr-button__danger",
        customClass: "modal-main",
        type: "warning",
      })
        .then(async () => {
          const data = {
            murr_id: this.$route.query.murr_id,
            owner_id: this.murrOwnerId,
          };
          const response = await axios.delete(
            `/api/murr_card/${this.$route.params.id}`,
            {
              headers: {
                Authorization:
                  "Bearer " + this.$store.getters.accessToken_getters,
              },
              data: data,
            }
          );
          await this.clearMurrCards();
          await this.$router.push("/");
          if (response.status === 204) {
            this.notification({
              message: "Мурр удален",
              type: "success",
            });
          } else {
            this.notification({
              message: "Что-то пошло не по плану 😮",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.notification({
            message: "Действие отменено",
            type: "warning",
          });
        });
    },
  },
  components: {
    Comments,
  },
};
</script>

<style scoped>
.more-btn:hover {
  background-color: #8b8ac5;
  border-radius: 2px;
}

.murr-panel {
  max-width: 620px;
  width: 100%;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 2px;
}

.murr-header {
  max-width: 620px;
  width: 100%;
  margin: 0 auto;
  font-family: JetBrainsMono-Italic, sans-serif;
  word-break: break-word;
}

.create-murr-area {
  width: 100%;
  max-height: 90%;
  max-width: 650px;
  margin: 0 auto;
  word-wrap: break-word;
}

.murr-code-snippet {
  background-color: #c3a1ff;
  padding: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #41314e;
  white-space: pre-wrap;
  border-radius: 5px;
}
</style>
