<template>
  <div class="chat-screen">
    <div class="users-list">
      <FriendsList @select-friend="handleUserSelected" />
      <StrangersList @select-stranger="handleUserSelected" />
    </div>
    <div class="inbox">
      <ul
        ref="chat-messages-list"
        class="chat-messages-list"
        v-if="inboxMessages && inboxMessages.length > 0"
      >
        <li
          :class="[
            message.from === userId ? 'user-message' : ''
          ].join(' ')"
          :key="message._id"
          v-for="message in inboxMessages"
        >
          <span class="message-container">
            <span class="message-content">{{ message.content }}</span>
            <span class="message-time">{{ new Date(message.time).toLocaleTimeString() }}</span>
          </span>
        </li>
      </ul>
      <div class="chat-messages-list-empty" v-else>N/A</div>
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
    </div>
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
  watch: {
    inboxMessages: {
      handler () {
        this.$nextTick(() => {
          const messagesList = this.$refs['chat-messages-list']

          messagesList && messagesList.scrollTo(messagesList.scrollLeft, Number.MAX_SAFE_INTEGER)
        })
      },
      immediate: true
    }
  },
  methods: {
    handleUserSelected (user) {
      this.$store.dispatch('changeInboxFriend', user)
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
.chat-screen {
  height: 100vh;
  padding: 0 0.4rem;
  display: flex;
  flex-direction: column;
}
.inbox {
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.chat-form {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 0.2rem;
  width: 30rem;
  max-width: calc(100% - 0.4rem);
}
.chat-form > input {
  flex-grow: 1;
}
h5 {
  margin: 0;
}
.users-list {
  display: grid;
  max-width: 100%;
  grid-template-columns: calc(50% - 0.2rem) calc(50% - 0.2rem);
  grid-column-gap: 0.4rem;
  max-height: 20%;
  overflow: auto;
}
.chat-messages-list-empty {
  flex-grow: 1;
}
.chat-messages-list {
  flex-basis: 0;
  flex-grow: 1;
  margin: auto;
  margin-bottom: 0.2rem;
  width: 30rem;
  max-width: calc(100% - 0.4rem);
  list-style-type: none;
  padding: 0.4rem;
  padding-bottom: 0.2rem;
  border: 2px solid lightgrey;
  margin-top: 0.6rem;
  overflow: auto;
}
.chat-messages-list > li {
  text-align: left;
}
.chat-messages-list > li > span {
  text-align: left;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 0 11px rgba(33,33,33, 0.6);
  margin: 0.2rem 0;
  padding: 0.2rem 1.2rem;
  display: inline-block;
}
.chat-messages-list > .user-message {
  text-align: right;
}
.chat-messages-list > .user-message > span {
  box-shadow: 0 0 11px rgba(0, 184, 148, 0.6);
}
.message-container > .message-content {
  display: block;
}
.message-container > .message-time {
  display: block;
  color: gray;
  font-size: x-small;
}
</style>
