module.exports = {
  projectId: "bofeid",
  screenshotOnRunFailure: false,
  video: false,

  e2e: {
    excludeSpecPattern: "*.html",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
