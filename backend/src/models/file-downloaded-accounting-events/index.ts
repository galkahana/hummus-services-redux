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
    downloadedFile: {
        type: Schema.Types.ObjectId,
        ref: 'GeneratedFile',
        require: true
    },
    downloadedFileSize: {
        type: Number
    }
},    
{
    timestamps: true
})


fileDownloadedAccountingEventSchema.index({ user: 1 })
fileDownloadedAccountingEventSchema.index({ downloadedFile: 1 })

export default model<IFileDownloadedAccountingEvent>('FileDownloadedAccountingEvent', fileDownloadedAccountingEventSchema)