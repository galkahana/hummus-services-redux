import { model, Schema } from 'mongoose'

import { Roles } from '@lib/authorization/rbac'
import { IFileDownloadedAccountingEvent } from './types'

const fileDownloadedAccountingEventSchema = new Schema<IFileDownloadedAccountingEvent>({
    user: {
        type:  Schema.Types.ObjectId,
        ref: 'User',
        require: true        
    },
    // Token data is optional to allow for public download
    tokenId: {
        type: String,
    },
    tokenString: {
        type: String,
    },
    tokenType: {
        type:String,
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