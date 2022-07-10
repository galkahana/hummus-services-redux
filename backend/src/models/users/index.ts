import { model, Schema } from 'mongoose'
import uuid from 'node-uuid'
import { IUser, UserStatus } from './types'

const userSchema = new Schema<IUser>({
    uid: {
        type:String,
        require:true,
        unique:true,
        default: uuid.v1
    },
    username: {
        type:String,
        require:true,
        unique:true
    },
    email: {
        type:String,
        require:true
    },
    name: {
        type:String
    },
    hash: {
        type:String,
    },
    salt: {
        type:String,
    },
    iterations: {
        type: Number
    },
    status: {
        type:String,
        enum: UserStatus,
        required:true,
        default: UserStatus.Trial
    
    }
},    {
    timestamps: true
})


userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

const USER_PRIVATE_FIELDS = [ 'hash', 'salt', 'iterations', '_id', '__v' ]
userSchema.set('toJSON', { 
    transform: (_doc, ret) => {
        USER_PRIVATE_FIELDS.forEach(function(fn) {
            delete ret[fn] 
        })
        
    }
})

export default model<IUser>('User', userSchema)
