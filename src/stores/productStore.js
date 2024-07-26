import { defineStore } from 'pinia';
import client from '../apollo';
import { gql } from '@apollo/client/core';

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      quantity
      category_id
      company_id
      company { 
        name 
      } 
      created_at
    }
  }
`;


const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!, 
    $price: numeric!, 
    $quantity: Int!, 
    $categoryId: Int, 
    $companyId: Int,
    $createdAt: timestamp
  ) {
    insert_products_one(object: {
      name: $name,
      price: $price,
      quantity: $quantity,
      category_id: $categoryId,
      company_id: $companyId,
      created_at: $createdAt
    }) {
      id
      name
      price
      quantity
      category_id
      company_id
      created_at
    }
  }
`;


const UPDATE_PRODUCT_BY_PK = gql`
  mutation UpdateProduct(
    $id: Int!, 
    $name: String!, 
    $price: numeric!, 
    $quantity: Int!, 
    $categoryId: Int, 
    $companyId: Int,
    $createdAt: timestamp
  ) {
    update_products_by_pk(
      pk_columns: { id: $id }, 
      _set: {
        name: $name,
        price: $price,
        quantity: $quantity,
        category_id: $categoryId,
        company_id: $companyId,
        created_at: $createdAt
      }
    ) {
      id
      name
      price
      quantity
      category_id
      company_id
      created_at
    }
  }
`;


const DELETE_PRODUCT_BY_PK = gql`
  mutation DeleteProductByPk($id: Int!) {
    delete_products_by_pk(id: $id) {
      id
      name
      price
      quantity
      category_id
      company_id
      company {
        name
      }
      created_at
    }
  }
`;


export const useProductStore = defineStore('product', {
  state: () => ({
    products: JSON.parse(localStorage.getItem('products')) || [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const { data } = await client.query({
          query: GET_PRODUCTS,
        });
        console.log('Fetched data:', data);
        this.products = [...data.products].sort((a, b) => a.id - b.id);
        localStorage.setItem('products', JSON.stringify(this.products));
      } catch (e) {
        console.error('Error fetching products:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async addProduct(name, price, quantity, categoryId, companyId) {
      const createdAt = new Date().toLocaleString();
      try {
          const { data } = await client.mutate({
            mutation: ADD_PRODUCT,
            variables: { name, price, quantity, categoryId, companyId, createdAt },
          });
          this.products.push(data.insert_products_one);
          localStorage.setItem('products', JSON.stringify(this.products));
        } catch (e) {
          console.error('Error adding product:', e.message);
        }
      },

      async updateProduct(id, name, price, quantity, categoryId, companyId) {
        const createdAt = new Date().toLocaleString();
        try {
          const { data } = await client.mutate({
            mutation: UPDATE_PRODUCT_BY_PK,
            variables: { id, name, price, quantity, categoryId, companyId, createdAt },
          });
          const index = this.products.findIndex(p => p.id === id);
          if (index !== -1) {
            this.products[index] = data.update_products_by_pk;
            localStorage.setItem('products', JSON.stringify(this.products));
          }
        } catch (e) {
          console.error('Error updating product:', e.message);
        }
      },
      

      async deleteProduct(id) {
        try {
          await client.mutate({
            mutation: DELETE_PRODUCT_BY_PK,
            variables: { id },
          });
          this.products = this.products.filter(p => p.id !== id);
          localStorage.setItem('products', JSON.stringify(this.products));
        } catch (e) {
          console.error('Error deleting product:', e.message);
        }
      }

  },
});
