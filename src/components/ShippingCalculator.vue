<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg px-16 py-10 border border-gray-300 rounded bg-white shadow-md">
      <h1 class="text-xl mb-6 text-center font-bold uppercase">Shipping Calculator</h1>
      <form class="font-semibold text-lg" @submit.prevent="calculateShippingCostResult">
        <div class="mb-4 flex items-center">
          <label for="destination" class="w-1/3 text-left mr-4">Destination:</label>
          <select v-model="destination" id="destination" class="flex-1 p-2 border border-gray-300 rounded" required>
            <option value="none">none</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>
        <div class="mb-4 flex items-center">
          <label for="weight" class="w-1/3 text-left mr-4">Weight (kg):</label>
          <input type="number" v-model.number="weight" id="weight" class="flex-1 p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4 flex items-center">
          <label for="priority" class="w-1/3 text-left mr-4">Priority:</label>
          <select v-model="priority" id="priority" class="flex-1 p-2 border border-gray-300 rounded" required>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="priority">Priority</option>
            <option value="other">Other</option>
          </select>
        </div>
        <p v-if="result !== null" class="mt-4 text-center font-medium bg-slate-200 p-2 rounded">Shipping Cost: {{ result }}</p>
        <div class="flex justify-end mt-4">
          <button type="submit" class="font-semibold px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Calculate Shipping Cost</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useShippingStore } from '@/stores/shippingStore'
import { computed } from 'vue'

export default {
  setup() {
    const store = useShippingStore()

    const destination = computed({
        get: () => store.destination,
        set:(value) => store.destination = value
    })

    const weight = computed({
        get: () => store.weight,
        set:(value) => store.weight = value
    })

    const priority = computed({
        get: () => store.priority,
        set:(value) => store.priority = value
    })

    const result = computed(() => store.result)

    const calculateShippingCostResult = () => {
      store.calculateShippingCost()
    }

    return {
      destination,
      weight,
      priority,
      result,
      calculateShippingCostResult
    }
  }
}
</script>

<style scoped>
.shipping-calculator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.shipping-calculator form div {
  margin-bottom: 10px;
}

.shipping-calculator form label {
  margin-right: 10px;
}

.shipping-calculator form input,
.shipping-calculator form select {
  padding: 5px;
}

.shipping-calculator form button {
  padding: 5px 10px;
}
</style>
