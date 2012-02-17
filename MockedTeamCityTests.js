function setupMockLeaderboard(containerElement) {
	var statsLoader = createMockLoader();
	var buildInfoLoader = new MockBuildInfoLoader();
	var projectIds = [ "bt2", "bt3", "bt4" ];
	var buildCoordinator = new BuildCoordinator(containerElement, projectIds.length, statsLoader);
	buildCoordinator.start(buildInfoLoader, projectIds);
}

function createMockLoader() {
	return {
		getStats:function (buildId, successCallback, errorCallback) {
			var callback = function () {
				successCallback({ coveragePercent:Math.floor(100 * Math.random()) });
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
