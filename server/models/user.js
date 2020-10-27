const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'This field is required']
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: [true, 'This field is required']
        },
        img: {
            type: String
        },
        role: {
            type: String,
            default: 'USER_ROLE',
            required: true,
            enum: validRoles
        },
        active: {
            type: Boolean,
            default: true
        },
        google: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: {
            transform: function(doc, ret) {
                delete ret.password
            }
        }
    }
)

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)