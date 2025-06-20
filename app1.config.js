// app.config.js
export default ({ config }) => ({
    ...config,
    name: "IGOTIT!",
    slug: "igotit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.jaytranberg.igotit",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.jaytranberg.igotit",
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png",
      title: "IGOTIT! - Track Your Items",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      LOCAL_API_URL: "http://10.0.0.167:5000",
      PROD_API_URL: "https://cartracker-t4bc.onrender.com",
      eas: {
        projectId: "bda6dd3b-e7d1-4856-a334-5b8ca5016c99",
      },
    },
    owner: "jaytranberg",
    runtimeVersion: {
      policy: "1.0.0",
    },
    updates: {
      url: "https://u.expo.dev/bda6dd3b-e7d1-4856-a334-5b8ca5016c99",
    },
  });
  