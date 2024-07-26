<template>
  <div class="w-4/5 mx-auto flex flex-col">
    <h1 class="text-center py-5 text-2xl font-bold mb-7">CATEGORY LIST</h1>
    <div class="flex flex-col border p-3 rounded-md">
      <h2 class="py-5 text-lg font-semibold">Add New Category</h2>
      <div class="grid grid-cols-2 gap-4 w-full text-lg">
        <label class="flex flex-col mb-4 font-semibold">
          Name:
          <input v-model="newCategory.name" class="p-2 border border-gray-300 rounded" />
        </label>
        <label class="flex flex-col mb-4 font-semibold">
          Parent ID:
          <input v-model.number="newCategory.parentId" type="number" class="p-2 border border-gray-300 rounded" />
        </label>
      </div>
      <div class="flex justify-end mt-2">
        <button class="font-semibold w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="addCategory">Add Category</button>
      </div>
    </div>

    <div class="mt-5">
      <table v-if="categories.length > 0" class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border-b ">ID</th>
            <th class="p-2 border-b ">Name</th>
            <th class="p-2 border-b ">Parent ID</th>
            <th class="p-2 border-b ">Created At</th>
            <th class="p-2 border-b ">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td class="p-2 border-b">{{ category.id }}</td>
            <td class="p-2 border-b">{{ category.name }}</td>
            <td class="p-2 border-b">{{ category.parent_id }}</td>
            <td class="p-2 border-b">{{ new Date(category.created_at).toLocaleString() }}</td>
            <td class="p-2 border-b flex justify-center">
              <button class="w-16 bg-slate-400 text-white px-2 py-1 rounded " @click="editCategory(category)">Edit</button>
              <button class="w-16 bg-red-400 text-white px-2 py-1 rounded ml-2" @click="deleteCategory(category.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center mt-4">No categories found.</p>

      <!-- Delete Confirmation Modal -->
      <div v-if="isConfirmingDelete" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-md text-center">
          <h2 class="text-xl font-bold mb-4">Are you sure?</h2>
          <p class="mb-4">Do you really want to delete this category? This process cannot be undone.</p>
          <button class="border rounded-md w-24 p-1 m-1 bg-red-400" @click="confirmDelete">Yes</button>
          <button class="border rounded-md w-24 p-1 m-1 bg-slate-400" @click="cancelDelete">No</button>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isEditing" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg ">
          <h2 class="text-lg font-semibold mb-3">Edit Category</h2>
          <label class="block mb-3">
            Name:
            <input v-model="editCategoryData.name" class="w-full p-2 border border-gray-300 rounded mt-1" />
          </label>
          <label class="block mb-4">
            Parent ID:
            <input v-model.number="editCategoryData.parent_id" type="number" class="w-full p-2 border border-gray-300 rounded mt-1" />
          </label>
          <div class="flex justify-end">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2" @click="saveEdit">Save</button>
            <button class="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-600" @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';

export default {
  setup() {
    const categoryStore = useCategoryStore();
    const categories = categoryStore.categories;
    const newCategory = ref({
      name: '',
      parentId: null,
      createdAt: new Date().toISOString().slice(0, 16),
    });
    const editCategoryData = ref(null);
    const isEditing = ref(false);
    const isConfirmingDelete = ref(false);
    const categoryToDelete = ref(null);

    const fetchCategories = async () => {
      await categoryStore.fetchCategories();
    };

    onMounted(fetchCategories);

    const addCategory = async () => {
      const { name, parentId, createdAt } = newCategory.value;
      try {
        await categoryStore.addCategory(name, parentId, createdAt);
        newCategory.value = {
          name: '',
          parentId: null,
          createdAt: new Date().toISOString().slice(0, 16),
        };
      } catch (error) {
        console.error('Error adding category:', error);
      }
    };

    const editCategory = (category) => {
      editCategoryData.value = { ...category };
      isEditing.value = true;
    };

    const saveEdit = async () => {
      if (editCategoryData.value) {
        const { id, name, parent_id, created_at } = editCategoryData.value;
        try {
          await categoryStore.updateCategory(id, name, parent_id, created_at);
          isEditing.value = false;
        } catch (error) {
          console.error('Error updating category:', error);
        }
      }
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const deleteCategory = (id) => {
      categoryToDelete.value = id;
      isConfirmingDelete.value = true;
    };

    const confirmDelete = async () => {
      if (categoryToDelete.value) {
        try {
          await categoryStore.deleteCategory(categoryToDelete.value);
          isConfirmingDelete.value = false;
          categoryToDelete.value = null;
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      }
    };

    const cancelDelete = () => {
      isConfirmingDelete.value = false;
      categoryToDelete.value = null;
    };

    return {
      categories,
      newCategory,
      editCategoryData,
      isEditing,
      isConfirmingDelete,
      fetchCategories,
      addCategory,
      editCategory,
      saveEdit,
      cancelEdit,
      deleteCategory,
      confirmDelete,
      cancelDelete,
    };
  },
};
</script>

<style scoped>

</style>
