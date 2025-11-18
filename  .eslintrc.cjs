/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ["filenames", "unicorn"],
  extends: ["eslint:recommended"],
  rules: {
    // File harus camelCase
    "filenames/match-regex": ["warn", "^[a-z][a-zA-Z0-9]*$", true],

    // Optional: enforce filename case
    "unicorn/filename-case": [
      "warn",
      {
        cases: {
          camelCase: true,
        },
      },
    ],
  },
};
