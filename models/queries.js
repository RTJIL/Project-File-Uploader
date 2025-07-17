import { prisma } from "../db/index.js";

const allowedModels = ["user", "file", "session", "folder"];

const findAll = async (modelName) => {
  if (!allowedModels.includes(modelName))
    throw new Error(`Model ${modelName} is not allowed`);

  console.log(`🔃Fetching all ${modelName}s from ${modelName} DB`);

  const res = await prisma[modelName].findMany();

  console.log("✅Completed", res);
  console.log("----");

  return res;
}; //SELECT * FROM user

const findAllWhere = async (modelName, value) => {
  if (!allowedModels.includes(modelName))
    throw new Error(`Model ${modelName} is not allowed`);

  console.log(`🔃Fetching all ${modelName}s from ${modelName} DB`);

  const res = await prisma[modelName].findMany({
    where: value,
  });

  console.log("✅Completed", res);
  console.log("----");

  return res;
};

const findUnique = async (modelName, value) => {
  console.log("🔃Fetching data from DB");

  console.log(`🔃Fetching ${modelName} from ${modelName} DB`);

  const res = await prisma[modelName].findUnique({ where: value });

  console.log("✅Completed", res);

  console.log("✅Completed: ", res);
  console.log("----");

  return res;
};
// SELECT * FROM user WHERE value = "someValue"

const postUser = async (username, password) =>
  await prisma.user.create({
    data: {
      username,
      password,
    },
  });

const postFolder = async (title, userId) => {
  console.log("🔃Creating new folder");

  const folder = await prisma.folder.create({
    data: {
      title,
      userId,
    },
  });

  console.log("✅Completed: ", folder);

  return folder;
};

const postFile = async (title, size, folderId, path) => {
  console.log("🔃Creating new file");

  const folder = await prisma.file.create({
    data: {
      title,
      size,
      folderId,
      path,
    },
  });

  console.log("✅Completed: ", folder);

  return folder;
};

const deleteSome = async (modelName, value) => {
  if (!allowedModels.includes(modelName))
    throw new Error(`Model ${modelName} is not allowed`);

  console.log(`🔃Deleting ${modelName} ${value} from DB`);

  const res = await prisma[modelName].delete({ where: value });

  console.log("✅Completed", res);
  console.log("----");

  return res;
};

const updateSome = async (modelName, value, data) => {
  if (!allowedModels.includes(modelName))
    throw new Error(`Model ${modelName} is not allowed`);

  console.log(
    `🔃Updating ${modelName} ${JSON.stringify(value, null, 2)} with values ${JSON.stringify(data, null, 2)}`,
  );

  const res = await prisma[modelName].update({ where: value, data: data });

  console.log("✅Completed", res);
  console.log("----");

  return res;
};

export default {
  findAll,
  findUnique,
  findAllWhere,
  postUser,
  postFolder,
  postFile,
  deleteSome,
  updateSome,
};
