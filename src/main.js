import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import router from "@/router";
import store from "@/store";
import axios from 'axios';
import {axios_defaults_baseURL} from './devAndProdVariables'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css'
import '@/assets/css/fade-and-slide-fade.css'
import '@/assets/css/fonts.css'

Vue.use(ElementUI);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

axios.defaults.baseURL = axios_defaults_baseURL;

axios.interceptors.response.use((response) => {

    return response

}, function (error) {

    if (error.response.status === 401) {

        if (error.response.data.hasOwnProperty('messages')) {

            if (error.response.data.messages[0].message === "Token is invalid or expired") {

                const dataForPopUpMessage = {

                    message: 'Истек токен доступа. Перезайди в Мурренган',
                    customClass: 'element-ui-message__error',
                    type: 'warning'
                };

                store.dispatch('popUpMessage', dataForPopUpMessage);
                store.dispatch('logout');
                router.push('/');

            }
        }

        return Promise.reject(error);
    }

    return Promise.reject(error);

});


new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
