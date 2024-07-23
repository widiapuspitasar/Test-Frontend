<template>
  <div class="tax-calculator">
    <h1>Tax Calculator</h1>
    <form @submit.prevent="calculateTaxResult">
      <div>
        <label for="income">Income:</label>
        <input type="number" v-model.number="income" id="income" required />
      </div>
      <div>
        <label for="age">Age:</label>
        <input type="number" v-model.number="age" id="age" required />
      </div>
      <div>
        <label for="dependents">Dependents:</label>
        <input type="number" v-model.number="dependents" id="dependents" required />
      </div>
      <button type="submit">Calculate Tax</button>
    </form>
    <p v-if="result !== null">Tax: {{ result }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTaxStore } from '@/stores/taxStore'

export default {
  setup() {
    const store = useTaxStore()
    const income = computed({
      get: () => store.income,
      set: (value) => store.income = value
    })
    const age = computed({
      get: () => store.age,
      set: (value) => store.age = value
    })
    const dependents = computed({
      get: () => store.dependents,
      set: (value) => store.dependents = value
    })
    const result = computed(() => store.result)

    const calculateTaxResult = () => {
      store.calculateTax(income.value, age.value, dependents.value)
    }

    return {
      income,
      age,
      dependents,
      result,
      calculateTaxResult
    }
  }
}
</script>

<style scoped>
.tax-calculator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.tax-calculator form div {
  margin-bottom: 10px;
}

.tax-calculator form label {
  margin-right: 10px;
}

.tax-calculator form input {
  padding: 5px;
}

.tax-calculator form button {
  padding: 5px 10px;
}
</style>
