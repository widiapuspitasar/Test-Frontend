import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import client from './apollo';
import 'leaflet/dist/leaflet.css';
import './assets/styles/tailwind.css'

const app = createApp(App);

app.config.globalProperties.$apollo = client;

app.use(router);
app.use(createPinia());
app.mount('#app');
