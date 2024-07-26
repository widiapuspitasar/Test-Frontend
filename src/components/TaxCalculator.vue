<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg px-16 py-10 border border-gray-300 rounded bg-white shadow-md">
      <h1 class="text-xl mb-6 text-center font-bold uppercase">Tax Calculator</h1>
      <form class="font-semibold text-lg" @submit.prevent="calculateTaxResult">
        <div class="mb-4 flex items-center">
          <label for="income" class="w-1/3 text-left mr-4">Income :</label>
          <input
            type="text"
            v-model="formattedIncome"
            @input="updateIncome"
            id="income"
            class="flex-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4 flex items-center">
          <label for="age" class="w-1/3 text-left mr-4">Age :</label>
          <input
            type="number"
            v-model.number="age"
            id="age"
            class="flex-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4 flex items-center">
          <label for="dependents" class="w-1/3 text-left mr-4">Dependents :</label>
          <input
            type="number"
            v-model.number="dependents"
            id="dependents"
            class="flex-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <p v-if="result !== null" class="mt-4 text-center font-medium bg-slate-200 p-2 rounded">Tax: {{ result }}</p>
        <div class="flex justify-end mt-4">
          <button type="submit" class="font-semibold px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Calculate Tax</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
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

    const formattedIncome = ref(store.income ? formatCurrency(store.income) : '')

    const updateIncome = (event) => {
      const value = parseFloat(event.target.value.replace(/[^0-9.-]+/g,""))
      if (!isNaN(value)) {
        store.income = value
        formattedIncome.value = formatCurrency(value)
      } else {
        store.income = null
        formattedIncome.value = ''
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD', 
      }).format(value)
    }

    const calculateTaxResult = () => {
      store.calculateTax()
      formattedIncome.value = formatCurrency(store.income)
    }

    return {
      income,
      age,
      dependents,
      result,
      formattedIncome,
      updateIncome,
      calculateTaxResult
    }
  }
}
</script>

<style scoped>

</style>
