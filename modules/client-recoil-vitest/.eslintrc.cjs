module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "plugin:react/jsx-runtime",
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        //"eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module",
        "project": "./modules/*/tsconfig.json",
    },
    "plugins": [
        "react",
        "prettier",
        "@typescript-eslint",
        "testing-library",
        "jest-dom"
    ],
    "rules": {
    },
    "@typescript-eslint/quotes": [
        "error",
        "double",
        {
            "avoidEscape": true,
            "allowTemplateLiterals": true
        }
    ]
}
