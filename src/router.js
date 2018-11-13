import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld1 from './components/HelloWorld1.vue'
import HelloWorld2 from './components/HelloWorld2.vue'
import HelloWorld3 from './components/HelloWorld3.vue'

Vue.use(Router)
export default new Router({
  mode: 'abstract',
  routes: [
    { path: '/h1', component: HelloWorld1 },
    { path: '/h2', component: HelloWorld2 },
    { path: '/h3', component: HelloWorld3 },
    { path: '/', redirect: '/h1' }
  ]
})
