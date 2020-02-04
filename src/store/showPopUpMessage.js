import {Message} from "element-ui";


export default {

    actions: {

        async popUpMessage(context, {message, customClass, type}) {

            await Message({
                message: message,
                center: true,
                customClass: customClass,
                type: type,
                showClose: true
            });
        },
    },
}