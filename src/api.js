const API_ROOT = 'http://localhost:3000'

const getUsers = async () => {
  const res = await fetch(`${API_ROOT}/users`)

  return res.json()
}
const getMessages = async ({ _id, friendId }) => {
  const res = await fetch(`${API_ROOT}/messages/${[_id, friendId].sort().join('_')}`)

  return res.json()
}
const createUser = async ({ email }) => {
  const res = await fetch(`${API_ROOT}/users`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: { 'Content-Type': 'application/json' }
  })

  return res.ok
}
const getFriends = async ({ _id }) => {
  const res = await fetch(`${API_ROOT}/users/friends/${_id}`)

  return res.json()
}
const removeFriend = async ({ _id, friendId }) => {
  const res = await fetch(`${API_ROOT}/users/friends/${_id}/${friendId}`, {
    method: 'DELETE'
  })

  return res.ok
}
const addFriend = async ({ _id, email, friendId, friendEmail }) => {
  const res = await fetch(`${API_ROOT}/users/friends`, {
    method: 'POST',
    body: JSON.stringify({ _id, email, friendId, friendEmail }),
    headers: { 'Content-Type': 'application/json' }
  })

  return res.ok
}

export {
  getUsers,
  addFriend,
  getFriends,
  createUser,
  getMessages,
  removeFriend
}
