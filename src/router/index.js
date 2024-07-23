import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import TaxCalculator from '../components/TaxCalculator.vue'
import ShippingCalculator from '../components/ShippingCalculator.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/tax-calculator',
    name: 'TaxCalculator',
    component: TaxCalculator
  },
  {
    path: '/shipping-calculator',
    name: 'ShippingCalculator',
    component: ShippingCalculator
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
