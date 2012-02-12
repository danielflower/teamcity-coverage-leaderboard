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
	var loader = new BuildInfoLoader("http://teamcity.jetbrains.com");
	loader.retrieve("bt187", function (info) {
		assertEquals("bt187", info.buildId, "Build ID");
		assertEquals("TestNG Test Project", info.projectName, "Project name");
		assertEquals("TestNG - Coverage", info.buildName, "Build name");
	}, function (jqXHR, textStatus, errorThrown) {
		alert(jqXHR + "\n" + textStatus + "\n", errorThrown);
	})
}
