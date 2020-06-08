<template>
  <div class="strangers-list">
    <h5>Strangers of {{ userEmail }}</h5>
    <div v-if="strangers.length === 0">
      N/A
    </div>
    <ul>
      <li
        class="stranger-item"
        :key="stranger._id"
        v-for="stranger in strangers"
      >
        <span
          @click="$emit('select-stranger', stranger)"
        >{{ stranger.email }}</span>
        <button
          :disabled="isLoading"
          @click="handleAddFriend(stranger)"
        >
          Add
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { addFriend } from '../api'

export default {
  methods: {
    async handleAddFriend ({ _id: friendId, email: friendEmail }) {
      await addFriend({ _id: this.userId, email: this.userEmail, friendId, friendEmail })
    }
  },
  computed: {
    strangers () { return this.$store.getters.strangers },
    userId () { return this.$store.getters.userId },
    userEmail () { return this.$store.getters.userEmail },
    isLoading () { return this.$store.getters.isLoading }
  }
}
</script>

<style>
.stranger-item {
  cursor: pointer;
  display: flex;
}
.stranger-item:hover {
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 0 11px rgba(33,33,33,.6);
}
.stranger-item > span {
  flex-grow: 1;
}
.stranger-item > button {
  cursor: pointer;
}
.stranger-item > button:disabled {
  cursor: not-allowed;
  background-color: darkgray;
}
</style>
