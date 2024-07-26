import { defineStore } from 'pinia';
import client from '../apollo';
import { gql } from '@apollo/client/core';

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchLocations() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await client.query({
            query: gql`
              query {
                locations {
                  id
                  name
                  latitude
                  longitude
                }
              }
            `,
          });
          console.log('Fetched locations:', data.locations);
          
        this.locations = data.locations;
      } catch (err) {
        this.error = err;
        console.error('Error fetching locations:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
