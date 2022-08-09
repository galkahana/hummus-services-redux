import { model, Schema } from 'mongoose'
import { v1 } from 'uuid'
import { IGenerationJob, JobStatus } from './types'
import { ObjectId } from 'bson'

const generationJobSchema = new Schema<IGenerationJob>({
    uid: {
        type:String,
        require:true,
        unique:true,
        default: v1
    },
    status: {
        type: Number,
        enum: JobStatus,
        required: true
    },  
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true        
    },     
    label: String,
    ticket: { 
        type: Schema.Types.Mixed, 
        default: {} 
    },
    generatedFile: {
        type: Schema.Types.ObjectId,
        ref: 'GeneratedFile'
    }, 
    deleteFileAt: Date,
    finishedAt: Date
},    
{
    timestamps: true
})


generationJobSchema.index({ status: 1 })
generationJobSchema.index({ user: 1 })
generationJobSchema.index({ generatedFile: 1 })
generationJobSchema.index({ deleteFileAt: -1 })
generationJobSchema.index({ finishedAt: -1 })

const GENERATION_JOB_PRIVATE_FIELDS = [ 'user', '_id', '__v' ]
generationJobSchema.set('toJSON', { 
    transform: (_doc, ret) => {
        GENERATION_JOB_PRIVATE_FIELDS.forEach(function(fn) {
            delete ret[fn] 
        })

        // also this...delete unpopulated generatedFile cause i dont want the _id returned
        if(ret['generatedFile'] instanceof  ObjectId)
            delete ret['generatedFile']
    }
})

export default model<IGenerationJob>('GenerationJob', generationJobSchema)
