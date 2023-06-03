const { Pool } = require('pg');
const config = require("./config")
const itemsPool = new Pool(config);
itemsPool.connect().then((data)=>{
  console.log('connected DB');
}).catch(err=>{
  console.log('error connect DB');
})

const insertData = async (query)=>{
    sqlResult = await itemsPool.query(query);
    return sqlResult
}
const updateData = async (query)=>{
    sqlResult = await itemsPool.query(query);
    return sqlResult
}
const deleteData = async (query)=>{
    sqlResult = await itemsPool.query(query);
    return sqlResult
}
const selectData = async (query)=>{
    sqlResult = await itemsPool.query(query);
    return sqlResult
}

module.exports = {insertData, updateData, deleteData, selectData}