module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    extends: ['plugin:@typescript-eslint/recommended'], // Uses the linting rules from @typescript-eslint/eslint-plugin
    env: {
        node: true, // Enable Node.js global variables
    },
    rules: {
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1
            }
        ],
        'quotes': [2, 'single', 'avoid-escape'],
        'no-console': 'off',
        'semi': [2, 'never'],
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
    },
}