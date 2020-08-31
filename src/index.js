const PromClient = require('prom-client');

module.exports = function () {
    const registry = new PromClient.Registry();
  
    const defaultOptions = {
        registers: [registry],
        labelNames: ['owner', 'app'],
    };
  
    const passedGauge = new PromClient.Gauge({
        ...defaultOptions,
        name: 'e2e_passed_tests',
        help: 'Passed tests',
    });
  
    const skippedGauge = new PromClient.Gauge({
        ...defaultOptions,
        name: 'e2e_skipped_tests',
        help: 'Skipped tests',
    });
  
    const failedGauge = new PromClient.Gauge({
        ...defaultOptions,
        name: 'e2e_failed_tests',
        help: 'Failed tests',
    });
  
    return {
        currentApp: null,
  
        reportTaskStart(/* startTime, userAgents, testCount */) {
        },
  
        reportFixtureStart(name, path, meta) {
            const { app, owner } = meta;
            this.currentApp = app;
            this.currentOwner = owner;
        },
  
        reportTestDone(name, testRunInfo, meta) {
            const app = meta.app || this.currentApp;
            const owner = meta.owner || this.currentOwner;
            const labels = { app, owner };
    
            if (!skippedGauge._getValue(labels)) { // eslint-disable-line no-underscore-dangle
                skippedGauge.set(labels, 0);
            }
            if (!failedGauge._getValue(labels)) { // eslint-disable-line no-underscore-dangle
                failedGauge.set(labels, 0);
            }
            if (!passedGauge._getValue(labels)) { // eslint-disable-line no-underscore-dangle
                passedGauge.set(labels, 0);
            }
    
            if (testRunInfo.skipped) {
                skippedGauge.inc(labels, 1);
            } else if (testRunInfo.errs.length) {
                failedGauge.inc(labels, 1);
            } else {
                passedGauge.inc(labels, 1);
            }
        },
  
        reportTaskDone(/* endTime, passed, warnings, result */) {
            this.write(registry.metrics());
        },
    };
};
