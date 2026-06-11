// Extends app.json. CI sets ANDROID_VERSION_CODE (from the workflow run
// number) so every APK build is an installable upgrade over the previous one.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    versionCode: Number(process.env.ANDROID_VERSION_CODE ?? 1),
  },
});
