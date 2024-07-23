import { defineStore } from 'pinia';

export const useTaxStore = defineStore('taxStore', {
  state: () => ({
    income: null,
    age: null,
    dependents: null,
    result: null,
  }),
  actions: {
    calculateTax() {
      const { income, age, dependents } = this;

      if (typeof income !== 'number' || income < 0) return this.result = "Invalid income";
      if (typeof age !== 'number' || age < 0) return this.result = "Invalid age";
      if (typeof dependents !== 'number' || dependents < 0) return this.result = "Invalid dependents";
      if (age < 18) return this.result = "Not eligible for tax";

      function taxCalculation(income) {
        if (income <= 10000) {
          return income * 0.1;
        } else if (income <= 50000) {
          return income * 0.2;
        } else if (income > 50000) {
          return income * 0.3;
        }
      }

      function calculateFinalTax(income, tax) {
        tax = taxCalculation(income);
        
        if (age >= 65) {
          tax *= 0.8;
        }
        tax -= dependents * 500;

        tax = Math.max(tax, 0);

        return tax;
      }

      this.result = calculateFinalTax(income);
    }
  }
});
