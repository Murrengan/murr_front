<template>
  <div class="home-main-container">
    <span>
      <ul class="mb">
        <li>ws/murr_chat/lobby/</li>
        <li>{"data": {}, "gan":"get_murren_chats_list"}</li>
        <li>{"data": {}, "gan":"get_murren_list"}</li>
        <li>
          {"data": {"murr_chat_name": "___________"}, "gan": "create_murr_chat"}
        </li>
        <li>
          {"data": {"murren_id": "___________"}, "gan": "add_murr_chat_member"}
        </li>
        <li>{"data": {"message": "___________"}, "gan": "send_message"}</li>
        <li>{"data": {}, "gan": "list_messages"}</li>
      </ul>
      <input v-model="url" class="m-form__control auth-input" type="text" />
      <el-button class="ml murr-button__primary mb" @click="connect">
        Connect
      </el-button>
      <resizable-textarea>
        <textarea
          class="murr-header fs"
          placeholder="Заголовок"
          v-model="text"
          maxlength="224"
        ></textarea>
      </resizable-textarea>
      <el-button class="ml murr-button__primary mb" @click="sendMessage">
        Send
      </el-button>

      <div>{{ this.socketMessage }}</div>
    </span>
  </div>
</template>

<script>
import ResizableTextarea from "../common/ResizableTextarea.js";

export default {
  data() {
    return {
      url: "",
      text: "",
      socket: null,

      socketMessage: "",
    };
  },
  methods: {
    connect() {
      let token = this.$store.getters.accessToken_getters;
      let endpoint = "ws://127.0.0.1:8000/";

      this.socket = new WebSocket(endpoint + this.url + "?token=" + token);
      this.socket.onopen = function () {
        // eslint-disable-next-line no-console
        console.log("socket.onopen");
      };

      this.socket.onclose = function (event) {
        if (event.wasClean) {
          // eslint-disable-next-line no-console
          console.log("Соединение закрыто чисто");
        } else {
          // eslint-disable-next-line no-console
          console.log("Обрыв соединения");
        }
        // eslint-disable-next-line no-console
        console.log("Код: " + event.code + " причина: " + event.reason);
      };

      this.socket.onmessage = function (event) {
        // eslint-disable-next-line no-console
        console.log("Получены данные " + event.data);
        this.socketMessage = event.data;
      };

      this.socket.onerror = function (error) {
        // eslint-disable-next-line no-console
        console.log("Ошибка " + error.message);
      };
    },

    sendMessage() {
      this.socket.send(
        this.text
        // JSON.stringify(
        //   this.text
        // //   data: {},
        // //   gan: 'get_murren_chats_list'
        // )
      );
    },
  },
  components: {
    ResizableTextarea,
  },
};
</script>

