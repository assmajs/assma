module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ["packages/*/src/**/*.js"],
	coverageDirectory: "coverage",
	modulePaths: ["<rootDir>/packages", "<rootDir>/node_modules"]
};
