module.exports = {
  plugins: ["@babel/transform-runtime"],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
};
