/* eslint-disable */
const presets = [
    ["@babel/env", {
        useBuiltIns: "usage"
    }],
    "@babel/preset-react",
    "@babel/preset-flow",
];

const plugins = [
    ["@babel/plugin-proposal-class-properties"]
];

module.exports = {
    presets,
    plugins,
};
