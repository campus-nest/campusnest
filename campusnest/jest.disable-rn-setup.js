// Prevent React Native's Jest setup from running its window overrides
const path = require("path");

module.exports = () => {
  const rnSetupPath = path.resolve(
    __dirname,
    "node_modules/react-native/jest/setup.js"
  );

  require.extensions[".js"] = (module, filename) => {
    if (filename === rnSetupPath) {
      // ⛔ Do NOT execute react-native/jest/setup.js
      return module._compile("", filename);
    }

    return require("module")._extensions[".js"](module, filename);
  };
};
