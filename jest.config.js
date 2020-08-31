module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageThreshold: {
		global: {
			branches: 92,
			functions: 100,
			lines: 100,
			statements: 100
		}
    }
};
