<template>
  <div class="shipping-calculator">
    <h1>Shipping Calculator</h1>
    <form @submit.prevent="calculateShippingCostResult">
      <div>
        <label for="destination">Destination:</label>
        <select v-model="destination" id="destination" required>
          <option value="none">none</option>
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
        </select>
      </div>
      <div>
        <label for="weight">Weight (kg):</label>
        <input type="number" v-model.number="weight" id="weight" required />
      </div>
      <div>
        <label for="priority">Priority:</label>
        <select v-model="priority" id="priority" required>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="priority">Priority</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit">Calculate Shipping Cost</button>
    </form>
    <p v-if="result !== null">Shipping Cost: {{ result }}</p>
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
