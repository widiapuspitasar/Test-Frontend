<template>
  <div class=" w-4/5 mx-auto flex flex-col">
    <h1 class="font-bold py-5 text-center text-2xl mb-7">PRODUCT LIST</h1>
    <div class="flex flex-col border p-3 rounded-md">
      <h2 class="font-semibold text-lg  py-5">Add New Product</h2>
      <div class=" grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
        <label class=" flex flex-col w-full font-semibold">
          Name:
          <input v-model="newProduct.name" class="p-2 border border-gray-300 rounded" />
        </label>
        <label class=" flex flex-col w-full font-semibold">
          Price:
          <input v-model.number="newProduct.price" type="number" class="p-2 border border-gray-300 rounded" />
        </label>
        <label class=" flex flex-col w-full font-semibold"> 
          Quantity:
          <input v-model.number="newProduct.quantity" type="number" class="p-2 border border-gray-300 rounded" />
        </label>
        <label class=" flex flex-col w-full font-semibold">
          Category ID:
          <input v-model.number="newProduct.categoryId" type="number" class="p-2 border border-gray-300 rounded" />
        </label>
        <label class=" flex flex-col w-full font-semibold">
          Company ID:
          <input v-model.number="newProduct.companyId" type="number" class="p-2 border border-gray-300 rounded" />
        </label>
      </div>
      <div class="flex justify-end mt-2">
        <button class="font-semibold w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="addProduct">Add Product</button>
      </div>
    </div>

    <div class="table-container mt-8">
      <table v-if="products.length > 0" class="w-full  mt-8 ">
        <thead>
          <tr class="bg-slate-100">
            <th class="p-2 text-left border-b ">ID</th>
            <th class="p-2 text-left border-b ">Name</th>
            <th class="p-2 text-left border-b ">Price</th>
            <th class="p-2 text-left border-b ">Quantity</th>
            <th class="p-2 text-left border-b ">Category ID</th>
            <th class="p-2 text-left border-b ">Company ID</th>
            <th class="p-2 text-left border-b ">Company Name</th>
            <th class="p-2 text-left border-b">Created At</th>
            <th class="p-2 text-left border-b ">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td class="p-2 border-b border-gray-200">{{ product.id }}</td>
            <td class="p-2 border-b border-gray-200">{{ product.name }}</td>
            <td class="p-2 border-b border-gray-200">{{ formatCurrency(product.price) }}</td>
            <td class="p-2 border-b border-gray-200">{{ product.quantity }}</td>
            <td class="p-2 border-b border-gray-200">{{ product.category_id }}</td>
            <td class="p-2 border-b border-gray-200">{{ product.company_id }}</td>
            <td class="p-2 border-b border-gray-200">{{ product.company ? product.company.name : 'No Company' }}</td>
            <td class="p-2 border-b border-gray-200">{{ new Date(product.created_at).toLocaleString() }}</td>
            <td class="p-2 border-b border-gray-200 text-white">
              <button class=" w-16 border rounded-md p-1 m-1 bg-slate-400" @click="editProduct(product)">Edit</button>
              <button class="w-16 border rounded-md p-1 bg-red-400" @click="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center">No products found.</p>

      <!-- Delete Confirmation Modal -->
      <div v-if="isConfirmingDelete" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-md text-center">
          <h2 class="text-xl font-bold mb-4">Are you sure?</h2>
          <p class="mb-4">Do you really want to delete this product? This process cannot be undone.</p>
          <button class="text-white border rounded-md w-24 p-1 m-1 bg-red-400" @click="confirmDelete">Yes</button>
          <button class="text-white border rounded-md w-24 p-1 m-1 bg-slate-400" @click="cancelDelete">No</button>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isEditing" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg">
          <h2 class="text-xl font-bold mb-4">Edit Product</h2>
          <label class="block mb-3">
            Name:
            <input v-model="editProductData.name" class="w-full p-2 border border-gray-300 rounded" />
          </label>
          <label class="block mb-3">
            Price:
            <input v-model.number="editProductData.price" type="number" class="p-2 border border-gray-300 rounded w-full" />
          </label>
          <label class="block mb-3"> 
            Quantity:
            <input v-model.number="editProductData.quantity" type="number" class="p-2 border border-gray-300 rounded w-full" />
          </label>
          <label class="block mb-3">
            Category ID:
            <input v-model.number="editProductData.category_id" type="number" class="p-2 border border-gray-300 rounded w-full" />
          </label>
          <label class="block mb-3">
            Company ID:
            <input v-model.number="editProductData.company_id" type="number" class="p-2 border border-gray-300 rounded w-full" />
          </label>
          <div class="flex justify-end text-white ">
            <button class=" mr-2 px-4 py-2  border bg-blue-500 hover:bg-blue-600 font-semibold rounded-md w-24 mt-4" @click="saveEdit">Save</button>
            <button class=" px-4 py-2  border bg-gray-300 hover:bg-gray-600  font-semibold rounded-md w-24 mt-4" @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '../stores/productStore';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const productStore = useProductStore();
    const newProduct = ref({
      name: '',
      price: 0,
      quantity: 0,
      categoryId: null,
      companyId: null
    });
    const editProductData = ref(null);
    const isEditing = ref(false);
    const isConfirmingDelete = ref(false);
    const productToDelete = ref(null);

    const fetchProducts = async () => {
      await productStore.fetchProducts();
    };

    onMounted(fetchProducts);

    const addProduct = async () => {
      const { name, price, quantity, categoryId, companyId } = newProduct.value;
      try {
        await productStore.addProduct(name, price, quantity, categoryId, companyId);
        newProduct.value = {
          name: '',
          price: 0,
          quantity: 0,
          categoryId: null,
          companyId: null
        };
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

    const editProduct = (product) => {
      editProductData.value = { ...product };
      isEditing.value = true;
    };

    const saveEdit = async () => {
      if (editProductData.value) {
        const { id, name, price, quantity, category_id, company_id } = editProductData.value;
        try {
          await productStore.updateProduct(id, name, price, quantity, category_id, company_id);
          isEditing.value = false;
        } catch (error) {
          console.error('Error updating product:', error);
        }
      }
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const deleteProduct = async (id) => {
      productToDelete.value = id;
      isConfirmingDelete.value = true;
    };

    const confirmDelete = async () => {
      if (productToDelete.value) {
        try {
          await productStore.deleteProduct(productToDelete.value);
          isConfirmingDelete.value = false;
          productToDelete.value = null;
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    };

    const cancelDelete = () => {
      isConfirmingDelete.value = false;
      productToDelete.value = null;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    return {
      products: productStore.products,
      newProduct,
      editProductData,
      isEditing,
      isConfirmingDelete,
      fetchProducts,
      addProduct,
      editProduct,
      saveEdit,
      cancelEdit,
      deleteProduct,
      confirmDelete,
      cancelDelete,
      formatCurrency
    };
  }
};
</script>


<style scoped>

</style>