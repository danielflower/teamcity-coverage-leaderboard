
var currentTest = "";

function assertThat(bool, message) {
	if (!bool) {
		alert(currentTest + ": " + message)
	} else {
		console.log(currentTest + " passed");
	}
}

function assertEquals(expected, actual, message) {
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
	currentTest = "BuildInfoLoader";
	var loader = new BuildInfoLoader("http://localhost:7000");
	loader.retrieve("bt2", function (info) {
		assertEquals("bt2", info.buildId, "Build ID");
		assertEquals("teamcity-coverage-leaderboard", info.projectName, "Project name");
		assertEquals("CI Build", info.buildName, "Build name");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	})
}

function testStatisticsUpdater() {
	currentTest = "StatisticsLoader";
	var loader = new BuildStatisticsLoader("http://localhost:7000");
	loader.getStats("bt2", function (stats) {
		assertThat(!stats.coveragePercent, "Coverage is undefined for this build");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	})

}
