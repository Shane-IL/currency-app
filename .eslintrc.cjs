module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        // "eslint:recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "plugin:react/jsx-runtime",
    ],
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],

            parserOptions: {
                project: "./**/tsconfig.json",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
        project: "./**/tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    plugins: [
        "react",
        "prettier",
        "@typescript-eslint",
        "testing-library",
        "jest-dom",
    ],
    rules: {
        "no-console": "off",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: [
                    "**/*.test.ts",
                    "**/*.test.tsx",
                    "**/*.spec.ts",
                    "tests/**/*",
                ],
            },
        ],
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-nested-ternary": "off",
        "@typescript-eslint/quotes": [
            "error",
            "double",
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
    },
};
