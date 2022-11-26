import Vue from 'vue'
import App from './App.vue'
import ajax from './assets/js/axios.config';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.prototype.$ajax = ajax

Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount('#app')
