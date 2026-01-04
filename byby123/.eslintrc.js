module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: ['eslint:recommended'],
    ignorePatterns: ['dist', '.eslintrc.js'],
    parser: '@typescript-eslint/parser',
    rules: {
        'no-unused-vars': 0,
    },
    overrides: [
        {
            files: ['frontend/**/*.tsx, frontend/**/*.ts'],
            plugins: ['react-refresh'],
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
            rules: {
                'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            },
        },
    ],
};