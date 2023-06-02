const { Client } = require("pg");
const config = require("./config")
const client = new Client(config);

client
  .connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Error connecting to database");
  });

const insertData = async (query)=>{
    sqlResult = await client.query(query);
    return sqlResult
}
const updateData = async (query)=>{
    sqlResult = await client.query(query);
    return sqlResult
}
const deleteData = async (query)=>{
    sqlResult = await client.query(query);
    return sqlResult
}
const selectData = async (query)=>{
    sqlResult = await client.query(query);
    return sqlResult
}

module.exports = {insertData, updateData, deleteData, selectData}