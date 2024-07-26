import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../components/MapView.vue'
import TaxCalculator from '../components/TaxCalculator.vue'
import ShippingCalculator from '../components/ShippingCalculator.vue'
import CategoryList from '../components/CategoryList.vue';
import ProductList from '../components/ProductList.vue';
import CalculateProducts from '../components/CalculateProducts.vue';

const routes = [
  {
    path: '/',
    name: 'MapView',
    component: MapView
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
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: CategoryList
  },
  {
    path: '/product-calculator',
    name: 'CalculateProducts',
    component: CalculateProducts
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
