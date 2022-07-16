import { model, Schema } from 'mongoose'

import { Roles } from '@lib/authorization/rbac'
import { IFileDownloadedAccountingEvent } from './types'

const fileDownloadedAccountingEventSchema = new Schema<IFileDownloadedAccountingEvent>({
    user: {
        type:  Schema.Types.ObjectId,
        ref: 'User',
        require: true        
    },
    tokenId: {
        type: String,
        require: true        
    },
    tokenString: {
        type: String,
        required: true
    },
    tokenType: {
        type:String,
        enum: Roles,
    },
    file: {
        type: Schema.Types.ObjectId,
        ref: 'GeneratedFile',
        require: true
    },
    fileSize: {
        type: Number,
        require: true
    }
},    
{
    timestamps: true
})


fileDownloadedAccountingEventSchema.index({ user: 1 })
fileDownloadedAccountingEventSchema.index({ downloadedFile: 1 })

export default model<IFileDownloadedAccountingEvent>('FileDownloadedAccountingEvent', fileDownloadedAccountingEventSchema)