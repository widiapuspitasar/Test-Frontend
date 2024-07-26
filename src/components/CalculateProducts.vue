<template>
  <div class="w-4/5 mx-auto">
    <h1 class="text-center py-5 mb-7 text-2xl font-bold uppercase">Calculate Products</h1>
    <div class="mb-5 border">
      <div class="p-3">
        <h2 class="text-lg font-semibold mb-4">Selected Products</h2>
        <table class="w-full border border-gray-300 rounded">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border-b">Product Name</th>
              <th class="p-2 border-b">Product Price</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center border-separate" v-for="product in selectedProducts" :key="product.id">
              <td class="p-2 border">{{ product.name }}</td>
              <td class="p-2 border-b">{{ formatCurrency(product.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col p-3">
        <div v-if="totalPrice !== null" class="flex justify-center bg-slate-200 w-full rounded-md">
          <h2 class="text-lg font-semibold mb-2">
            Total Price: {{ formatCurrency(totalPrice) }}
          </h2>
        </div>
        <div class="flex justify-end mt-2">
          <button class="w-fit font-medium px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2" @click="calculateTotal">
            Calculate Total Price
          </button>
        </div>
      </div>
    </div>
    
    <table class="w-full border-collapse mt-16">
      <thead>
        <tr>
          <th class="p-2 border-b bg-gray-100">Product Name</th>
          <th class="p-2 border-b bg-gray-100">Product Price</th>
          <th class="p-2 border-b bg-gray-100">Category Product</th>
          <th class="p-2 border-b bg-gray-100">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="p-2 border-b">{{ product.name }}</td>
          <td class="p-2 border-b">{{ formatCurrency(product.price) }}</td>
          <td class="p-2 border-b">{{ getCategoryName(product.category_id) }}</td>
          <td class="p-2 border-b flex justify-center">
            <button class="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-green-600" @click="addProduct(product)">Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useCategoryStore } from '../stores/categoryStore';
import { defineComponent, ref, onMounted } from 'vue';
import { useProductStore } from '../stores/productStore';

export default defineComponent({
  setup() {
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    const selectedProducts = ref([]);
    const totalPrice = ref(null);

    const fetchProducts = async () => {
      await productStore.fetchProducts();
    };

    const getCategoryName = (categoryId) => {
      return categoryStore.getCategoryNameById(categoryId);
    };

    onMounted(fetchProducts);

    const addProduct = (product) => {
      if (!selectedProducts.value.find(p => p.id === product.id)) {
        selectedProducts.value.push(product);
      }
    };

    const calculateTotal = () => {
      totalPrice.value = selectedProducts.value.reduce((sum, product) => sum + product.price, 0);
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    return {
      products: productStore.products,
      selectedProducts,
      totalPrice,
      addProduct,
      calculateTotal,
      getCategoryName,
      formatCurrency
    };
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
