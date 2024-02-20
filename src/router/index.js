import { createRouter, createWebHashHistory } from "vue-router";
import Avatars from "../view/Avatars.vue";


export const defaultRouter = [
  { path: '/', component: Avatars },
  { path: '/avaters', component: Avatars }
]


const router = createRouter({
  // 4. Provide the history implementation to use. We
  // are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: defaultRouter, // short for `routes: routes`
})

export default router;
