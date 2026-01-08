import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [3, 'username must be at least 5 characters long' ],
            maxlength: 30,
        },
        fullName : {
            type : String,
            required : true,
            minlength: [ 3, 'Name must be at least 3 characters long'],
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase : true,
            minlength: [ 5, 'Email must be at least 5 characters long' ],
            trim : true
        },
        password : {
            type: String,
            required: true,
            select: false,
        },
        avatar: {
            type: {
                public_id: String,
                url: String //cloudinary url
            },
            required: true
        },
        coverImage: {
            type: {
                public_id: String,
                url: String //cloudinary url
            },
        },
        bio: {
            type: String,
            maxlength: 160,
        },
        followersCount: {
            type: Number,
            default: 0,
        },
        followingCount: {
            type: Number,
            default: 0,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken : {
            type : String,
            select : false
        }

    },
    {timestamps : true})


userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password , this.password);
}


userSchema.methods.generateAccessToken = function (params) {
    return jwt.sign(
        {
            _id : this._id,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
             _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



const User = mongoose.model('User', userSchema)


export {
    User
}

export default User