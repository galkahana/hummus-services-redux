import { CallbackError, model, Schema } from 'mongoose'
import uuid from 'node-uuid'

import generationJobsModel from '@models/generation-jobs'
import { IGeneratedFile, StorageSource } from './types'


const generatedFileSchema = new Schema<IGeneratedFile>({
    uid: {
        type:String,
        require:true,
        unique:true,
        default: uuid.v1
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true        
    },     
    downloadTitle: String,
    publicDownloadId: String,
    remoteSource: {
        sourceType: {
            type: Number,
            enum: StorageSource,
        },
        data: {
            remoteKey: String,
        }
    }
},    
{
    timestamps: true
})


generatedFileSchema.pre('remove', async function(next) {
    const thisID = this.id

    // When removing, automatically remove reference from generation job
    try {
        await generationJobsModel.updateOne({ generatedFile:thisID }, { $set: { generatedFile: null } })
        next()
    } catch(ex: unknown) {
        next(ex as CallbackError)
    }
})

generatedFileSchema.index({ uid: 1 })
generatedFileSchema.index({ user: 1 })
generatedFileSchema.index({ publicDownloadId: 1 })
generatedFileSchema.index({ 'remoteSource.sourceType': 1 })


const GENERATED_FILE_PRIVATE_FIELDS = [ 'user','remoteSource', '_id', '__v' ]
generatedFileSchema.set('toJSON', { 
    transform: function (doc, ret) {
        GENERATED_FILE_PRIVATE_FIELDS.forEach(function(fn) {
            delete ret[fn] 
        })
        
    }
})

export default model<IGeneratedFile>('GeneratedFile', generatedFileSchema)