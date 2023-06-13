const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SupplierSchema = new Schema({
    name :{type:String,
        require:[true,'ten khong duoc bo trong'],
        maxLength:[50,'ten khong duoc vuot qua 50 ki tu'],},

    email:{type:String,
        validate:{
            validator:function(value){
                // pass email 
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            },
            //fail email
            message: `{VALUE} sai dinh dang email!`,
        },
        required: [true, 'email khong duoc bo trong'],},

    phoneNumber:{type:String,
        validate:{
            // pass phoneNumber
            validator:function(value){
                const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
                return phoneRegex.test(value);
            },
            //fail phoneNumber
            message: `{VALUE} sai dinh dang phoneNumber`,
        },
        require:[true,'so dien thoai khong duoc bo trong'],
    },

    address:{type:String,require:[true,'dia chi khong duoc bo trong'],
    maxLength:[500,'dia chi khong qua 500 ki tu'],
},

},
 {
    versionKey: false,
 
 },

);

const Supplier = model('Supplier', SupplierSchema);
module.exports = Supplier;