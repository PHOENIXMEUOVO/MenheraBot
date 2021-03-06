module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': ['error', { exceptMethods: ['run'] }],
    'no-param-reassign': ['error', { props: false }],
    radix: 'off',
    'default-case': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'import/no-unresolved': [2, { ignore: ['config.json$'] }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
        ],
      },
    },
  },
};
