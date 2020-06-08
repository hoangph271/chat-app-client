<template>
  <div>
    <div class="Chat">
      <FriendsList @select-friend="handleFriendSelected" />
      <StrangersList />
    </div>
    <form class="chat-form"
      @submit.prevent="handleSendMessage"
    >
      <input type="text"
        v-model="message"
        :disabled="!inboxFriend"
        :placeholder="inboxFriend ? `Send to ${inboxFriend.email}` : 'Select a friend'"
      >
      <button
        type="submit"
        :disabled="!inboxFriend"
        style="width: 4rem;"
      >
        Send
      </button>
    </form>
      <ul class="chat-messages-list">
        <li
          :class="[
            message.from === userId ? 'user-message' : ''
          ].join(' ')"
          :key="message._id"
          v-for="message in inboxMessages"
        >
          {{ message.content }}
        </li>
      </ul>
  </div>
</template>

<script>
import { FriendsList, StrangersList } from '../components'

export default {
  data () {
    return {
      message: ''
    }
  },
  computed: {
    userId () { return this.$store.getters.userId },
    inboxMessages () { return this.$store.getters.inboxMessages },
    inboxFriend () { return this.$store.getters.inboxFriend }
  },
  methods: {
    handleFriendSelected (friend) {
      this.$store.dispatch('changeInboxFriend', friend)
    },
    handleSendMessage () {
      if (!this.message) return

      this.$socket.emit('@send-message', {
        _id: this.inboxFriend._id,
        message: this.message,
        email: this.$store.getters.userEmail
      })

      this.message = ''
    }
  },
  mounted () {
    if (!this.$store.getters.userId) {
      this.$router.push('/')
    }
  },
  components: {
    FriendsList,
    StrangersList
  }
}
</script>

<style>
.chat-form {
  display: flex;
  flex-direction: row;
  margin: auto;
  max-width: 24rem;
}
.chat-form > input {
  flex-grow: 1;
}
h5 {
  margin: 0;
}
.Chat {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.chat-messages-list {
  list-style-type: none;
}
.chat-messages-list > li {
  text-align: left;
}
.chat-messages-list > .user-message {
  text-align: right;
}
</style>
