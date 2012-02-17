

function assertThat(currentTest, bool, message) {
	if (!bool) {
		alert(currentTest + ": " + message)
	} else {
		console.log(currentTest + " passed");
	}
}

function assertEquals(currentTest, expected, actual, message) {
	if (expected != actual) {
		alert(currentText + ": " + message + "\nExpected: " + expected + "\nActual: " + actual);
	} else {
		console.log(currentTest + " passed with value " + expected);
	}
}

function runTests() {

	testBuildInfoLoader();
	testStatisticsUpdater();


}
function testBuildInfoLoader() {
	var t = "BuildInfoLoader";
	var loader = new BuildInfoLoader("http://localhost:7000");
	loader.retrieve("bt2", function (info) {
		assertEquals(t, "bt2", info.buildId, "Build ID");
		assertEquals(t, "teamcity-coverage-leaderboard", info.projectName, "Project name");
		assertEquals(t, "CI Build", info.buildName, "Build name");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	});
}

function testStatisticsUpdaterWithNoTests() {
	var t = "StatisticsLoaderWithNoTests";
	var loader = new BuildStatisticsLoader("http://localhost:7000");
	loader.getStats("bt2", function (stats) {
		assertThat(t, !stats.coveragePercent, "Coverage is undefined for this build");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	});

}

function testStatisticsUpdaterWithTests() {
	var t = "StatisticsLoaderWithTests";
	var loader = new BuildStatisticsLoader("http://localhost:7000");
	loader.getStats("bt3", function (stats) {
		assertEquals(t, 50, stats.coveragePercent, "Coverage percentage");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	});

}
