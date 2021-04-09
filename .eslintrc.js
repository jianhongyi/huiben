module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        "plugin:vue/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
    ],
    plugins: ["vue", "@typescript-eslint"],
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2018,
        sourceType: "module",
    },
    // add your custom rules here
    // 0 = off, 1 = warn, 2 = error
    rules: {
        "prettier/prettier": 0,
        // allow async-await
        "generator-star-spacing": 0,
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : 0,
        "no-console": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/camelcase": 0,
    },
    globals: {
        __BASE_URL__: true,
        __DEV__: true,
        __ENV__: true,
        Venus: true,
        readingjourney: true,
        do_external: true,
        bind_trigger: true,
    },
};
