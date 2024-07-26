import { defineStore } from 'pinia'

export const useShippingStore = defineStore('shippingStore', {
  state: () => ({
    destination: "",
    weight: null,
    priority: "",
    result: null
  }),
  actions: {
    calculateShippingCost() {
      const { destination, weight, priority } = this;
      
      if (destination !== 'domestic' && destination !== 'international') return this.result = "Invalid destination";
      if (typeof weight !== 'number' || weight <= 0) return this.result = "Invalid weight";
      if (priority !== 'standard' && priority !== 'express' && priority !== 'priority') return this.result = "Invalid priority";
      
      let baseCost;
      let additionalCost = 0;

      if (destination === 'domestic') {
        if (priority === 'standard') {
          baseCost = 5;
        } else if (priority === 'express') {
          baseCost = 10;
        } else if (priority === 'priority') {
          baseCost = 20;
        }

        if (weight > 10) {
          additionalCost = 10;
        }
      } else if (destination === 'international') {
        if (priority === 'standard') {
          baseCost = 15;
        } else if (priority === 'express') {
          baseCost = 25;
        } else if (priority === 'priority') {
          baseCost = 50;
        }

        if (weight > 5) {
          additionalCost = 50;
        }
      }
      const currencyFormatter = new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
      });

      this.result = currencyFormatter.format((weight * baseCost) + additionalCost);
    }
  }
});
