import { defineStore } from 'pinia';
import client from '../apollo'; 
import { gql } from '@apollo/client/core';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      parent_id
      created_at
    }
  }
`;

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $parentId: Int, $createdAt: timestamp) {
    insert_categories_one(object: { name: $name, parent_id: $parentId, created_at: $createdAt }) {
      id
      name
      parent_id
      created_at
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $name: String!, $parentId: Int, $createdAt: timestamp) {
    update_categories_by_pk(pk_columns: { id: $id }, _set: { name: $name, parent_id: $parentId, created_at: $createdAt }) {
      id
      name
      parent_id
      created_at
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    delete_categories_by_pk(id: $id) {
      id
    }
  }
`;

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categories: JSON.parse(localStorage.getItem('categories')) || [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const { data } = await client.query({
          query: GET_CATEGORIES,
        });
        console.log('Fetched data:', data);
        this.categories = [...data.categories].sort((a, b) => a.id - b.id);
        localStorage.setItem('categories', JSON.stringify(this.categories));
      } catch (e) {
        console.error('Error fetching categories:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    getCategoryNameById(id){
      const category = this.categories.find(cat => cat.id === id);
      return category ? category.name : 'Unknown Category'
    },

    async addCategory(name, parentId) {
      const createdAt = new Date().toLocaleString();
      try {
        const { data } = await client.mutate({
          mutation: ADD_CATEGORY,
          variables: { name, parentId, createdAt },
        });
        this.categories.push(data.insert_categories_one);
        localStorage.setItem('categories', JSON.stringify(this.categories));
      } catch (e) {
        console.error('Error adding category:', e.message);
      }
    },
    

    async updateCategory(id, name, parentId, createdAt) {
      try {
        const { data } = await client.mutate({
          mutation: UPDATE_CATEGORY,
          variables: { id, name, parentId, createdAt },
        });
        const index = this.categories.findIndex(p => p.id === id);
        if (index !== -1) {
          this.categories[index] = data.update_categories_by_pk;
          localStorage.setItem('categories', JSON.stringify(this.categories));
        }
      } catch (e) {
        console.error('Error updating product:', e.message);
      }
    },

    async deleteCategory(id) {
      try {
        await client.mutate({
          mutation: DELETE_CATEGORY,
          variables: { id },
        });
        this.categories = this.categories.filter(p => p.id !== id);
        localStorage.setItem('categories', JSON.stringify(this.categories));
      } catch (e) {
        console.error('Error deleting product:', e.message);
      }
    }

  },
});

 