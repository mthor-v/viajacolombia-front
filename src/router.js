import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import LogIn from './components/LogIn.vue'
import SignUp from './components/SignUp.vue'
import Home from './components/Home.vue'
import Account from './components/Account.vue'
import putUser from './components/putUser.vue'
import Routes from './components/Routes.vue'
import Company from './components/Company.vue'

const routes = [{
  path: '/',
  name: 'root',
  component: App
},
{
  path: '/user/logIn',
  name: "logIn",
  component: LogIn
},
{
  path: '/user/signUp',
  name: "signUp",
  component: SignUp
},
{
  path: '/user/home',
  name: "home",
  component: Home
},
{
  path: '/user/account',
  name: "account",
  component: Account
},
{
  path: '/user/update',
  name: "putUser",
  component: putUser
},
{
  path: '/home/routes',
  name: "routes",
  component: Routes
},
{
  path: '/company/home',
  name: "company",
  component: Company
}
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
