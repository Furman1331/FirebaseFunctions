module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 8,
    "sourceType": "module",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["warn", "double"],
    "indent": ["warn"],
    "arrow-parens": ["warn"],
    "operator-linebreak": ["warn"],
    "comma-dangle":["warn"],
    "linebreak-style": ["warn"],
    "eol-last": ["warn"],
    "semi": ["warn"],
    "max-len": ["warn"],
    "keyword-spacing": ["warn"],
    "no-trailing-spaces": ["warn"],
    "key-spacing": ["warn"],
    "require-jsdoc": ["warn"],
    "no-multi-spaces": ["warn"],
    "no-extra-semi": ["warn"],
    "no-var": ["warn"]
  },
};
