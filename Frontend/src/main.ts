import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import localeEn from './locales/en.json';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import allItems from '../tests/data/items-complete.json';
import bannedItemIds from '../tests/data/bannedItemIds.json';
import { ItemStore } from './models/item/itemStore';

import App from './App.vue';
import router from './router';
import Ripple from 'primevue/ripple';

library.add(fas, far, fab);

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: localeEn,
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      ripple: true,
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
});

app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

app.component('FontAwesomeIcon', FontAwesomeIcon);

ItemStore.items = ItemStore.fromJSON(allItems, bannedItemIds);

app.mount('#app');