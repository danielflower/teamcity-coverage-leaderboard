function assertThat(bool, message) {
	if (!bool) alert(message);
}

function assertEquals(expected, actual, message) {
	if (expected != actual) alert(message + "\nExpected: " + expected + "\nActual: " + actual);
}

function runTests() {

	testBuildInfoLoader();


}

function testBuildInfoLoader() {
	var loader = new BuildInfoLoader("http://localhost:7000");
	loader.retrieve("bt2", function (info) {
		assertEquals("bt2", info.buildId, "Build ID");
		assertEquals("teamcity-coverage-leaderboard", info.projectName, "Project name");
		assertEquals("CI Build", info.buildName, "Build name");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\nResponse text: " +  jqXHR.responseText + "\nText status: " + textStatus + "\n" + errorThrown);
	})
}
