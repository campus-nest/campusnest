const rn = jest.requireActual("react-native");

// Prevent double registration of views like RCTText
rn.Text.render = () => null;

// Fix Platform safely
rn.Platform = {
  OS: "ios",
  select: (objs) => objs.ios,
};

// Fix UIManager (prevent devmenu errors)
rn.UIManager = {
  getViewManagerConfig: () => null,
  hasViewManagerConfig: () => false,
};

module.exports = rn;
