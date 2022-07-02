import { AccessControl } from 'accesscontrol'

export enum Roles {
    SiteUser = 'SiteUser',
    JobManager = 'JobManager',
    JobCreator = 'JobCreator'
}

export enum Resources {
    Job = 'Job',
    File = 'File',
    User = 'User',
    Token = 'Token',
}

export enum Actions {
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

export const accesscontrol = new AccessControl()

// Site User access
accesscontrol.grant(Roles.SiteUser)
    .createOwn(Resources.Job)
    .deleteOwn(Resources.Job)
    .readOwn(Resources.Job)
    .readOwn(Resources.File)
    .readOwn(Resources.User)
    .updateOwn(Resources.User)
    .createOwn(Resources.Token)
    .readOwn(Resources.Token)
    .deleteOwn(Resources.Token)

// Job Manager access
accesscontrol.grant(Roles.JobManager)
    .createOwn(Resources.Job)
    .deleteOwn(Resources.Job)
    .readOwn(Resources.Job)
    .readOwn(Resources.File)


// Job Creator access
accesscontrol.grant(Roles.JobManager)
    .createOwn(Resources.Job)
    .readOwn(Resources.Job)
    .readOwn(Resources.File)
