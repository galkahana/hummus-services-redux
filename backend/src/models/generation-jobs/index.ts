import { model, Schema } from 'mongoose'
import uuid from 'node-uuid'
import { IGenerationJob, JobStatus } from './types'

const generationJobSchema = new Schema<IGenerationJob>({
    uid: {
        type:String,
        require:true,
        unique:true,
        default: uuid.v1
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
    deleteFileAt: Date
},    
{
    timestamps: true
})


generationJobSchema.index({status: 1})
generationJobSchema.index({user: 1})
generationJobSchema.index({generatedFile: 1})
generationJobSchema.index({deleteFileAt: -1})

const GENERATION_JOB_PRIVATE_FIELDS = ['user']
generationJobSchema.set('toJSON', { 
    transform: (_doc, ret) => {
        GENERATION_JOB_PRIVATE_FIELDS.forEach(function(fn) {
            delete ret[fn] 
        })
        
    }
})

export default model<IGenerationJob>('GenerationJob', generationJobSchema)
