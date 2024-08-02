const user =(name,email,password)=>{
    return {
      name:name?name:'',
      email,
      password
    }
}
console.log(user(email=email))
module.exports = user