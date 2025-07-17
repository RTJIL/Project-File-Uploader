import { prisma } from '../db/index.js'

const getAllUsers = async () => {
  console.log('🔃Fetching all users from DB')

  const res = await prisma.user.findMany()

  console.log('✅Completed', res)
  console.log('----')

  return res
} //SELECT * FROM user

const findUnique = async (value) => {
  console.log('🔃Fetching unique data from DB')

  const res = await prisma.user.findUnique({ where: value })

  console.log('✅Completed: ', res)
  console.log('----')

  return res
}
// SELECT * FROM user WHERE value = "someValue"

const postUser = async (username, password) =>
  await prisma.user.create({
    data: {
      username,
      password,
    },
  })

export default {
  getAllUsers,
  findUnique,
  postUser,
}
