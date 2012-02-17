function setupMockLeaderboard(containerElement) {
	var statsLoader = createMockLoader();
	var buildInfoLoader = new MockBuildInfoLoader();
	var projectIds = [ "bt2", "bt3", "bt4" ];
	var buildCoordinator = new BuildCoordinator(containerElement, projectIds.length, statsLoader, "%PROJECTNAME% - %BUILDNAME%");
	buildCoordinator.start(buildInfoLoader, projectIds);

	window.setTimeout(setTextSizes, 500);
	window.onresize = setTextSizes;

}

function createMockLoader() {
	return {
		getStats:function (buildId, successCallback, errorCallback) {
			var callback = function () {
				var stats = new BuildStatistics(buildId, {
					"CodeCoverageL": "" + (100 * Math.random()),
					"CodeCoverageAbsLCovered" : (500 * Math.random()) + ".0",
					"CodeCoverageAbsLTotal" : (2000 * Math.random()) + ".0",
					"PassedTestCount" : Math.floor(Math.random() * 50)
				});
				successCallback(stats);
			};
			window.setTimeout(callback, 500);
		}
	};
}

function MockBuildInfoLoader() {
	this.retrieve = function (buildTypeID, successCall, failure) {
		var callback = function () {
			successCall(new BuildInfo(buildTypeID, "Project " + Math.floor(100 * Math.random()), "CI Build"))
		};
		window.setTimeout(callback, 500);
	};
}
