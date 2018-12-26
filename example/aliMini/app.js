App({
  onLaunch(options) {
    this.pluginData = options.referrerInfo.data || {};
  },
  onShow(options) {
    this.pluginData = options.referrerInfo.data || {};
  },
  pluginData: {},
});

