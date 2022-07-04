import path from 'path'

const localResourcesPath = path.resolve(__dirname,'../../../../local-resources/')

export const localResources = {
    'arial': path.resolve(localResourcesPath,'./fonts/arial.ttf'),
    'arial bold': path.resolve(localResourcesPath,'./fonts/arialb.ttf'),
    'arial bold italic': path.resolve(localResourcesPath,'./fonts/arialbi.ttf'),
    'arial black': path.resolve(localResourcesPath,'./fonts/arialbl.ttf'),
    'arial black bold': path.resolve(localResourcesPath,'./fonts/arialblb.ttf'),
    'arial black italic': path.resolve(localResourcesPath,'./fonts/arialbli.ttf'),
    'arial italic': path.resolve(localResourcesPath,'./fonts/ariali.ttf'),
    'comic sans': path.resolve(localResourcesPath,'./fonts/comicms.ttf'),
    'comic sans bold': path.resolve(localResourcesPath,'./fonts/comicmsb.ttf'),
    'courier': path.resolve(localResourcesPath,'./fonts/courier.ttf'),
    'courier bold': path.resolve(localResourcesPath,'./fonts/courierb.ttf'),
    'courier bold italic':  path.resolve(localResourcesPath,'./fonts/courierbi.ttf'),
    'courier italic': path.resolve(localResourcesPath,'./fonts/courieri.ttf'),
    'georgia': path.resolve(localResourcesPath,'./fonts/georgia.ttf'),
    'georgia bold': path.resolve(localResourcesPath,'./fonts/georgiab.ttf'),
    'georgia bold italic': path.resolve(localResourcesPath,'./fonts/georgiabi.ttf'),
    'georgia italic': path.resolve(localResourcesPath,'./fonts/georgiai.ttf'),
    'impact': path.resolve(localResourcesPath,'./fonts/impact.ttf')
}