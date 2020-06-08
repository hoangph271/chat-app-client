import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import Toasted from 'vue-toasted'

import App from './App.vue'
import router from './router'
import * as API from './api'

Vue.use(Vuex)
Vue.use(Toasted)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    users: [],
    friends: [],
    inboxFriend: null,
    inboxMessages: [],
    userId: window.sessionStorage.getItem('@userId'),
    userEmail: window.sessionStorage.getItem('@userEmail')
  },
  getters: {
    friendIds: state => state.friends.map(friend => friend._id),
    strangers: state => {
      const { friendIds, userId } = store.getters
      const isNOTFriendOrUser = user => user._id !== userId && !(friendIds.includes(user._id))

      return state.users.filter(isNOTFriendOrUser)
    },
    userEmail: state => state.userEmail,
    friends: state => state.friends,
    userId: state => state.userId,
    inboxMessages: state => state.inboxMessages,
    inboxFriend: state => state.inboxFriend,
    users: state => state.users
  },
  mutations: {
    updateUser (state) {
      state.userId = window.sessionStorage.getItem('@userId')
      state.userEmail = window.sessionStorage.getItem('@userEmail')
    },
    changeInboxFriend (state, user) {
      state.inboxFriend = user
      state.inboxMessages = []
    },
    changeInboxMessages (state, inboxMessages) {
      state.inboxMessages = inboxMessages
    },
    removeFriend (state, friendId) {
      state.friends = state.friends.filter(friend => friend._id !== friendId)
    },
    updateUsers (state, users) {
      state.users = users
    },
    updateFriends (state, friends) {
      state.friends = friends
    },
    addFriend (state, friend) {
      state.friends = [...state.friends, friend]
    },
    friendOffline (state, friendId) {
      ;(state.friends.find(friend => friend._id === friendId) || {}).isOnline = false
      state.friends = [...state.friends]
    },
    friendOnline (state, friendId) {
      ;(state.friends.find(friend => friend._id === friendId) || {}).isOnline = true
      state.friends = [...state.friends]
    }
  },
  actions: {
    updateUser (context) {
      context.commit('updateUser')
    },
    async updateUsers (context) {
      const users = await API.getUsers()
      context.commit('updateUsers', users)
    },
    async updateFriends (context) {
      if (!context.state.userId) {
        context.commit('updateFriends', [])
        return
      }

      const friends = await API.getFriends({ _id: context.state.userId })
      context.commit('updateFriends', friends)
    },
    removeFriend (context, friendId) {
      context.commit('removeFriend', friendId)
    },
    friendOffline (context, friendId) {
      context.commit('friendOffline', friendId)
    },
    friendOnline (context, friendId) {
      context.commit('friendOnline', friendId)
    },
    addFriend (context, friend) {
      context.commit('addFriend', friend)
    },
    async changeInboxFriend (context, user) {
      context.commit('changeInboxFriend', user)

      const inboxMessages = await API.getMessages({
        _id: context.state.userId,
        friendId: user._id
      })

      context.commit('changeInboxMessages', inboxMessages)
    },
    async newInboxMessage (context, inboxMessage) {
      context.commit('changeInboxMessages', [
        ...context.state.inboxMessages,
        inboxMessage
      ])
    }
  }
})

// const socket = io('http://localhost:3000')
const socket = io('https://demo-chat-app-server.herokuapp.com')

store.watch(
  state => state.userId,
  (userId) => { userId && socket.emit('userId', userId) },
  {
    immediate: true
  }
)

socket.on('updateFriends', function () {
  store.dispatch('updateFriends')
})
socket.on('updateUsers', function () {
  store.dispatch('updateUsers')
})
socket.on('addFriend', function (friend) {
  store.dispatch('addFriend', friend)
})
socket.on('removeFriend', function (friendId) {
  store.dispatch('removeFriend', friendId)
})
socket.on('@friendOffline', function (friendId) {
  store.dispatch('friendOffline', friendId)
})
socket.on('@friendOnline', function (friendId) {
  store.dispatch('friendOnline', friendId)
})
socket.on('@new-message', (inboxMessage) => {
  store.dispatch('newInboxMessage', inboxMessage)
  // Vue.toasted.show(`${email}: ${message}`, {
  //   theme: 'outline',
  //   position: 'bottom-center',
  //   duration: 5000
  // })
})

Vue.mixin({
  computed: {
    $socket () {
      return socket
    }
  }
})

new Vue({
  store,
  router,
  socket,
  render: h => h(App)
}).$mount('#app')
