const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { stage } = require("./base-url");

const entry = {
    quiz: "./src/quiz.ts",
    reading: "./src/reading.ts",
    share: "./src/share.ts",
    login: "./src/login.ts",
    activate: "./src/activate.ts",
    register: "./src/register.ts",
    reset: "./src/reset.ts",
};

const plainPages = [
    new HtmlWebpackPlugin({
        filename: `ping.html`,
        template: `./public/ping.ejs`,
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: `cache.html`,
        template: `./public/cache.ejs`,
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: `download.html`,
        template: `./public/download.ejs`,
        inject: false,
    }),
];

function generateHtmlWebpackPlugins() {
    return Object.keys(entry)
        .map(name => {
            return process.env.NODE_ENV === "production"
                ? new HtmlWebpackPlugin({
                      filename: path.resolve(__dirname, `../dist/${name}.html`),
                      template: `./public/${name}.ejs`,
                      chunks: [name],
                      inject: true,
                      minify: {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeAttributeQuotes: false,
                          // more options:
                          // https://github.com/kangax/html-minifier#options-quick-reference
                      },
                      __ENV__: stage,
                  })
                : new HtmlWebpackPlugin({
                      filename: `${name}.html`,
                      template: `./public/${name}.ejs`,
                      chunks: [name],
                      inject: true,
                      __ENV__: stage,
                  });
        })
        .concat(plainPages);
}

module.exports = { entry, generateHtmlWebpackPlugins };
