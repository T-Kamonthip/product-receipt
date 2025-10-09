import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";

import Button from "primevue/button";
import Menubar from "primevue/menubar";
import FileUpload from "primevue/fileupload";
import ProgressSpinner from "primevue/progressspinner";
import Divider from "primevue/divider";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import InputMask from 'primevue/inputmask';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
// app.use(PrimeVue);

app.component("Button", Button);
app.component("Menubar", Menubar);
app.component("FileUpload", FileUpload);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Divider", Divider);
app.component("Toast", Toast);
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);
app.component("RadioButton", RadioButton);
app.component("Select", Select);
app.component("InputMask", InputMask);

app.use(ToastService);

app.mount("#app");
