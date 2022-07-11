import { model, Schema } from 'mongoose'

import { Roles } from '@lib/authorization/rbac'
import { JobStatus } from '@models/generation-jobs/types'
import { IJobRanAccountingEvent } from './types'


const jobRanAccountingEventSchema = new Schema<IJobRanAccountingEvent>({
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
    job: {
        type: Schema.Types.ObjectId,
        ref: 'GenerationJob',
        require: true        
    },
    jobStatus: {
        type: Number,
        enum: JobStatus,
        required: true
    },
    resultFile: {
        type: Schema.Types.ObjectId,
        ref: 'GeneratedFile'
    },
    resultFileSize: {
        type: Number
    }
},    
{
    timestamps: true
})


jobRanAccountingEventSchema.index({ user: 1 })
jobRanAccountingEventSchema.index({ job: 1 })

export default model<IJobRanAccountingEvent>('JobRanAccountingEvent', jobRanAccountingEventSchema)