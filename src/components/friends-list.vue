<template>
  <div class="friends-list">
      <h5>Friends of {{ userEmail }}</h5>
      <div v-if="friends.length === 0">
        N/A
      </div>
      <ul>
        <li
          class="friend-item"
          :key="friend._id"
          v-for="friend in friends"
        >
          <span class="status">
            {{ friend.isOnline ? '✔' : '❌' }}
          </span>
          <span class="email"
            @click="$emit('select-friend', friend)"
          >
            {{ friend.email }}
          </span>
          <button
            :disabled="isLoading"
            @click="handleRemoveFriend(friend)"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
</template>

<script>
import { removeFriend } from '../api'

export default {
  methods: {
    async handleRemoveFriend ({ _id: friendId }) {
      await removeFriend({ _id: this.userId, friendId })
    }
  },
  computed: {
    userId () { return this.$store.getters.userId },
    friends () { return this.$store.getters.friends },
    userEmail () { return this.$store.getters.userEmail },
    isLoading () { return this.$store.getters.isLoading }
  }
}
</script>

<style>
.friend-item {
  cursor: pointer;
  display: flex;
}
.friend-item:hover {
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 0 11px rgba(33,33,33,.6);
}
.friend-item > .email {
  flex-grow: 1;
}
.friend-item  > button {
  cursor: pointer;
}
.friend-item > button:disabled {
  cursor: not-allowed;
  background-color: darkgray;
}
</style>
