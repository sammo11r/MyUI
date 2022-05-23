export default {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
    "@babel/preset-flow",
  ],
  plugins: [
    "babel-plugin-styled-components",
    "@babel/plugin-proposal-class-properties",
  ],
};
