import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
