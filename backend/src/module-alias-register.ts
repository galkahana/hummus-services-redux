
import moduleAlias from 'module-alias'

/**
 * Using addAliases with __dirname instead of using the package json path definition of _moduleAliases and module-alias/register.
 * This allows having typescript imports going to typescript (based on what's in tsconfig, NOT BEING OVERRIDEN by having the def at package json), AND the compiled
 * to JS version to run properly.
 * 
 * It means i can use simple ts-node to run my typescripts with module aliases. 
 */

moduleAlias.addAliases(
    {
        '@setup': `${__dirname}/setup`,
        '@controllers': `${__dirname}/controllers`,
        '@lib': `${__dirname}/lib`,
        '@middlewares': `${__dirname}/middlewares`,
        '@models': `${__dirname}/models`,
        '@routes': `${__dirname}/routes`,
    }    
)