import { Message } from "element-ui";

export default {
  actions: {
    async popUpMessage(context, { message, customClass, type, textAlign }) {
      let className = [
        "murr-notification",
        `murr-notification-${type || `success`}`,
        `murr-notification-${textAlign || `center`}`,
      ];

      if (customClass) {
        if (typeof customClass === "object") {
          className = [...className, ...customClass];
        } else {
          className.push(customClass);
        }
      }

      await Message({
        message: message,
        center: true,
        customClass: className.join(" "),
        type: type,
        showClose: true,
      });
    },
  },
};
