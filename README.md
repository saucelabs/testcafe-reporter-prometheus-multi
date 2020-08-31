testcafe-reporter-prometheus-multi ![testcafe-reporter-prometheus-multi pipeline](https://github.com/saucelabs/testcafe-reporter-prometheus-multi/workflows/testcafe-reporter-prometheus-multi%20pipeline/badge.svg)
==================================

Prometheus reporter for [TestCafe](https://devexpress.github.io/testcafe/) allowing for alerts based on multiple suite executions across time.

## Installation

```sh
$ npm install --save-exact --save-dev testcafe-reporter-prometheus-multi
```

## Usage

### Setup

Specify the reporter in your TestCafe config, e.g.

```json
reporter: [
	"spec",
	{
		"name": "prometheus-multi",
		"output": "report.txt"
	}
]
```

Use option `-r prometheus-multi:report.txt` if you're running TestCafe from command line.

### Labeling tests

The reporter makes use of _fixtures_' and _tests_' `meta.app` and `meta.owner`. If `app` or `owner` is not specified for a _test_, the `meta` from the _fixture_ is used.

#### Example fixture with correct `meta` tags

```js
fixture('My fixture')
  .meta({
    app: 'my-app',
    owner: 'me',
  })
  .page(...);

test('some test about my-app', async (testcafe) => {
  ...
});

test.meta({ app: 'someone-elses-app' })('a test about someone-elses-app', async (testcafe) => {
  ...
});

test.meta({ app: 'someone-elses-app', owner: 'someone-else' })('a test about someone-elses-app with a different owner', async (testcafe) => {
  ...
});
```

For more information, refer to [TestCafe documentation](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/reporters.html#using-the-reporters).

### Sending data to Prometheus

The easiest way to send the report to Prometheus, is via [Pushgateway](https://github.com/prometheus/pushgateway). Just `curl` the report file to the Pushgateway endpoint:

```sh
curl --data-binary @report.txt http://address.of/pushgateway
```

## Output format

The aim of this project is for the report format to be compatible with [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). Output contains the number of _passed_, _skipped_ and _failed_ tests for every combination of `app` and `owner` from the test suite.

Metric names (`e2e_passed_tests`, `e2e_skipped_tests`, `e2e_failed_tests`) are hardcoded, because TestCafe doesn't provide an option to pass any parameters to the reporter. If you need to use different metric names, you'll have to fork the project and create a new node.js package.

#### Example
```
# HELP e2e_passed_tests Passed tests
# TYPE e2e_passed_tests gauge
e2e_passed_tests{app="my-app",owner="me"} 1
e2e_passed_tests{app="someone-elses-app",owner="someone-else"} 1
e2e_passed_tests{app="my-app",owner="someone-else"} 1

# HELP e2e_skipped_tests Skipped tests
# TYPE e2e_skipped_tests gauge
e2e_skipped_tests{app="my-app",owner="me"} 0
e2e_skipped_tests{app="someone-elses-app",owner="someone-else"} 0
e2e_skipped_tests{app="my-app",owner="someone-else"} 0

# HELP e2e_failed_tests Failed tests
# TYPE e2e_failed_tests gauge
e2e_failed_tests{app="my-app",owner="me"} 1
e2e_failed_tests{app="someone-elses-app",owner="someone-else"} 0
e2e_failed_tests{app="my-app",owner="someone-else"} 1
```

## Development

Use NPM [`link`](https://docs.npmjs.com/cli/link) command to make this package available for use on your local machine.

First, link this package to your global `node_modules` folder:

```sh
cd /path/to/testcafe-reporter-prometheus-multi
npm install
npm link
```

Then, go to your project with the test suite and link the package from the global folder:

```sh
cd /path/to/your-project-with-tests
npm link testcafe-reporter-prometheus-multi # or your changed package name
```

## FAQ

#### Why is the name so long?

TestCafe requires all reporters to have `testcafe-reporter-` prefix, and `testcafe-reporter-prometheus` is [already taken](https://www.npmjs.com/package/testcafe-reporter-prometheus).

#### Can I customize the metric names?

No, TestCafe currently doesn't offer a possibility to pass parameters to reporters, but you can always fork the project.
