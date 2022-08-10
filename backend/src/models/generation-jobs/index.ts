import { model, Schema } from 'mongoose'
import { v1 } from 'uuid'
import { IGenerationJob, JobStatus } from './types'

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
    statusMessage: {
        type: String
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
        type: String
    },
    deleteFileAt: Date,
    finishedAt: Date
},    
{
    timestamps: true
})

generationJobSchema.virtual('generatedFileObject', {
    ref: 'GeneratedFile',
    localField: 'generatedFile',
    foreignField: 'uid',
    justOne: true
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

        if(!ret.generatedFileObject) {
            // if for whatever reason (not populated or just there's nothing there) the object is null, remove
            // the entry so it wont show up
            delete ret['generatedFileObject']
        }
    },
    virtuals: true
})

generationJobSchema.set('toObject', {
    virtuals: true
})

export default model<IGenerationJob>('GenerationJob', generationJobSchema)
