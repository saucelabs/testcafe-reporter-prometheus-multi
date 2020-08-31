const createReporter = require('./../src/');

describe('testcafe-reporter-prometheus-multi', () => {
    const fixture = {
        name: 'My set of tests',
        path: '/some/path',
        meta: {
            app: 'my-app',
            owner: 'me',
        },
    };

    const test1 = {
        name: 'Test Number One',
        testRunInfo: {
            errs: [],
            skipped: false,
        },
        meta: {},
    };

    const test2 = {
        name: 'Test Number Two',
        testRunInfo: {
            errs: [new Error()],
            skipped: false,
        },
        meta: {},
    };

    const test3 = {
        name: 'Test Number Three',
        testRunInfo: {
            errs: [],
            skipped: true,
        },
        meta: {},
    };
    const test4 = {
        name: 'Test Number Four',
        testRunInfo: {
            errs: [],
            skipped: false,
        },
        meta: {
            app: 'someone-elses-app',
            owner: 'someone-else',
        },
    };
    const test5 = {
        name: 'Test Number Five',
        testRunInfo: {
            errs: [new Error()],
            skipped: false,
        },
        meta: {
            owner: 'someone-else',
        },
    };

    let reporter;

    beforeEach(() => {
        reporter = createReporter();
        reporter.write = jest.fn();
    });

    it('reports three tests, one of each status', () => {
        reporter.reportTaskStart();
        reporter.reportFixtureStart(fixture.name, fixture.path, fixture.meta);
        [test1, test2, test3].forEach((test) => (
            reporter.reportTestDone(test.name, test.testRunInfo, test.meta)
        ));
        reporter.reportTaskDone();
        expect(reporter.write).toMatchSnapshot();
    });

    it('test meta properties app & owner overwrite fixture properties', () => {
        reporter.reportTaskStart();
        reporter.reportFixtureStart(fixture.name, fixture.path, fixture.meta);
        [test1, test2, test4, test5].forEach((test) => (
            reporter.reportTestDone(test.name, test.testRunInfo, test.meta)
        ));
        reporter.reportTaskDone();
        expect(reporter.write).toMatchSnapshot();
    });
});
