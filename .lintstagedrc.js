// see https://github.com/okonet/lint-staged

module.exports = {
    '(src|static)/**/*.{js,jsx,vue,ts}': [
        'eslint --fix',
        'pretty-quick --staged',
        'git add'
    ],
};
