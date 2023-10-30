const mongoose = require("mongoose");
const validator = require("validator")
const bcrpt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require("./task")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain the String password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    profilePic: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Email ID not found")
    }

    const isMatch = bcrpt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Please enter a valid password")
    }

    return user


}
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'authorID'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.profilePic

    return userObject
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrpt.hash(user.password, 8)
    }

    next()

})

userSchema.pre("remove", async function (next) {
    const user = this
    try {
        await Task.deleteMany({ authorID: user._id })
        next()
    } catch (error) {

    }

})
const User = mongoose.model("User", userSchema)
User.createIndexes()

module.exports = User