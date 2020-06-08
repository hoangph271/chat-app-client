<template>
  <div class="home">
    <form @submit.prevent="handleCreateUser">
      <input required type="email" placeholder="email" v-model="email" />
      <input type="submit" value="Create" :disabled="isLoading" />
    </form>
    <h4>Click any email to login</h4>
    <ul>
      <li
        class="user-item"
        :key="user._id"
        v-for="user in users"
        @click="handleLogin(user)"
      >
        {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script>
import { createUser } from '../api'

export default {
  name: 'Home',
  data () {
    return {
      email: 'hhp@gmail.com'
    }
  },
  async mounted () {
    if (this.userId) {
      this.$router.push('/chat')
    }
  },
  methods: {
    async handleCreateUser () {
      const { email } = this
      await createUser({ email })
    },
    handleLogin ({ email, _id }) {
      window.sessionStorage.setItem('@userId', _id)
      window.sessionStorage.setItem('@userEmail', email)

      this.$store.dispatch('updateUser')
      this.$router.push('/chat')
    }
  },
  computed: {
    users () { return this.$store.getters.users },
    userId () { return this.$store.getters.userId },
    isLoading () { return this.$store.getters.isLoading }
  }
}
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
form > * {
  width: 20rem;
  box-sizing: border-box;
}
.user-item:hover {
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
}
</style>
