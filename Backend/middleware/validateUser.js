const validator = require('validator');

const validateUser = function(data){

    const mandatory = ['name','password','email'];
    
    const isAllow = mandatory.every((k)=>(Object.keys(data).includes(k)));

    if(!isAllow){
        throw new Error("All Fields are Required");
    }

    if(data.name.length < 3 || data.name.length > 25){
        throw new Error("Name Must Contain characters betweeen 3 to 25");
    }
    if(!validator.isEmail(data.email)){
        throw new Error("Invalid Email Id");
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("Weak Password");
    }
}

module.exports = validateUser;