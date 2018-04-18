import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import MakeRecipe from '@/components/MakeRecipe'
import EditRecipe from '@/components/EditRecipe'
import ViewRecipe from '@/components/ViewRecipe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    }, {
        path: '/create',
        name: 'MakeRecipe',
        component: MakeRecipe
    }, {
        path: '/edit/:id',
        name: 'EditRecipe',
        component: EditRecipe
    }, {
        path: '/view/:id',
        name: 'ViewRecipe',
        component: ViewRecipe
    }
  ]
})