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

function BuildStatistics(buildTypeId, statisticsMap) {
	this.buildTypeId = buildTypeId;
	this.statisticsMap = statisticsMap;
	var me = this;
	this.coveragePercent = statisticsMap["CodeCoverageL"];
	/*
	 Sample map:
	 <property name="ArtifactsSize" value="88830"/>
	 <property name="BuildArtifactsPublishingTime" value="43"/>
	 <property name="BuildCheckoutTime" value="15047"/>
	 <property name="BuildTestStatus" value="1"/>
	 <property name="CodeCoverageAbsCCovered" value="17.0"/>
	 <property name="CodeCoverageAbsCTotal" value="21.0"/>
	 <property name="CodeCoverageAbsLCovered" value="256.0"/>
	 <property name="CodeCoverageAbsLTotal" value="464.0"/>
	 <property name="CodeCoverageAbsMCovered" value="76.0"/>
	 <property name="CodeCoverageAbsMTotal" value="94.0"/>
	 <property name="CodeCoverageC" value="80.952385"/>
	 <property name="CodeCoverageL" value="55.172413"/>
	 <property name="CodeCoverageM" value="80.85107"/>
	 <property name="PassedTestCount" value="25"/>
	 <property name="SuccessRate" value="1"/>
	 <property name="TimeSpentInQueue" value="15"/>
	 */
	this.get = function (key, defaultValue) {
		var v = me.statisticsMap[key];
		return v || defaultValue;
	};
}

function BuildStatisticsLoader(teamcityBaseUrl) {
	var me = this;
	this.teamcityBaseUrl = teamcityBaseUrl;
	this.getStats = function (buildId, successCallback, errorCallback) {
		$.getJSON(me.teamcityBaseUrl + "/guestAuth/app/rest/builds/buildType:" + buildId + ",status:SUCCESS/statistics")
				.success(function (teamcityStatsArray) {
					//console.log(JSON.stringify(map));
					var map = {};
					var a = teamcityStatsArray.property;
					for (var i = 0; i < a.length; i++) {
						var pair = a[i];
						map[pair["@name"]] = pair["@value"];
					}
					successCallback(new BuildStatistics(buildId, map));
				})
				.error(errorCallback);
	};

	// Sample map: no tests:
	// {"property":[{"@name":"ArtifactsSize","@value":"114424"},{"@name":"BuildArtifactsPublishingTime","@value":"78"},{"@name":"BuildCheckoutTime","@value":"35"},{"@name":"BuildTestStatus","@value":"1"},{"@name":"SuccessRate","@value":"1"},{"@name":"TimeSpentInQueue","@value":"15"}]}
	// Sample map: with tests:
	// {"property":[{"@name":"ArtifactsSize","@value":"88830"},{"@name":"BuildArtifactsPublishingTime","@value":"43"},{"@name":"BuildCheckoutTime","@value":"15047"},{"@name":"BuildTestStatus","@value":"1"},{"@name":"CodeCoverageAbsCCovered","@value":"17.0"},{"@name":"CodeCoverageAbsCTotal","@value":"21.0"},{"@name":"CodeCoverageAbsLCovered","@value":"256.0"},{"@name":"CodeCoverageAbsLTotal","@value":"464.0"},{"@name":"CodeCoverageAbsMCovered","@value":"76.0"},{"@name":"CodeCoverageAbsMTotal","@value":"94.0"},{"@name":"CodeCoverageC","@value":"80.952385"},{"@name":"CodeCoverageL","@value":"55.172413"},{"@name":"CodeCoverageM","@value":"80.85107"},{"@name":"PassedTestCount","@value":"25"},{"@name":"SuccessRate","@value":"1"},{"@name":"TimeSpentInQueue","@value":"15"}]}
}

function BuildInfoLoader(teamcityBaseUrl) {
	this.teamcityBaseUrl = teamcityBaseUrl;
	var me = this;
	this.retrieve = function (buildTypeID, successCall, failure) {
		$.getJSON(me.teamcityBaseUrl + "/guestAuth/app/rest/builds/buildType:" + buildTypeID)
				.success(function (data) {
//					console.log(JSON.stringify(data));
					successCall(new BuildInfo(buildTypeID, data.buildType.projectName, data.buildType.name));
				})
				.error(failure);
		/* Sample JSON:
		 {"id":3,"number":"3","status":"SUCCESS","href":"/guestAuth/app/rest/builds/id:3","webUrl":"http://localhost:7000/viewLog.html?buildId=3&buildTypeId=bt2","personal":false,"history":false,"pinned":false,"statusText":"Success","buildType":{"id":"bt2","name":"CI Build","href":"/guestAuth/app/rest/buildTypes/id:bt2","projectName":"teamcity-coverage-leaderboard","projectId":"project2","webUrl":"http://localhost:7000/viewType.html?buildTypeId=bt2"},"startDate":"20120214T211744+0800","finishDate":"20120214T211745+0800","agent":{"name":"DanielPC","id":1,"href":"/guestAuth/app/rest/agents/id:1"},"tags":null,"properties":null,"revisions":{"revision":[{"display-version":"95b79f0f4dc9017d1d4f61f6ada234c6ed54d023","vcs-root":{"href":"/guestAuth/app/rest/vcs-roots/id:1","name":"teamcity-coverage-leaderboard-git"}}]},"changes":{"href":"/guestAuth/app/rest/changes?build=id:3","count":1},"relatedIssues":null}
		 */
	};
}

function BuildInfo(buildId, projectName, buildName) {
	// bt185,bt187
	//http://teamcity.jetbrains.com/guestAuth/app/rest/builds/buildType:bt187,status:SUCCESS/statistics/CodeCoverageL
	//http://teamcity.jetbrains.com/guestAuth/app/rest/builds/id:36552/statistics
	this.buildId = buildId;
	this.buildName = buildName;
	this.projectName = projectName;
}

function ProjectElement(parentElement, project, totalNumberOfProjects) {
	this.project = project;
	this.totalNumberOfProjects = totalNumberOfProjects;
	this.container = document.createElement("div");
	this.innerBox = document.createElement("div");
	this.name = document.createElement("span");
	this.percent = document.createElement("span");
	this.bar = document.createElement("div");
	this.container.className = 'ProjectBox';
	var barHeightPercentage = (100.0 / totalNumberOfProjects) + '%';
	this.container.style.height = barHeightPercentage;
	this.innerBox.className = 'ProjectInnerBox';
	this.name.className = 'ProjectName';
	this.percent.className = 'PercentageText';
	this.bar.className = 'PercentageBar';
	this.stats = null;
	this.rank = -1;

	this.bar.appendChild(this.name);
	this.bar.appendChild(this.percent);
	this.innerBox.appendChild(this.bar);
	this.container.appendChild(this.innerBox);
	parentElement.appendChild(this.container);

	this.name.innerHTML = project.projectName;

	var me = this;
	this.updatePercentage = function (newStats) {
		me.stats = newStats;
		var newValue = newStats.coveragePercent;
		var ceilingValue = Math.ceil(newValue);
		var backgroundColor = me.convertToColour(newValue);
		log("Updating " + me.project.buildId + " to " + ceilingValue + "% (" + backgroundColor + ")");
		me.bar.style.width = ceilingValue + "%";
		me.bar.style.backgroundColor = backgroundColor;
		me.percent.innerHTML = ceilingValue + "%";
	};

	this.setRank = function (zeroIndexedRanking) {
		if (me.rank != zeroIndexedRanking) {
			me.rank = zeroIndexedRanking;
			var newY = Math.floor((zeroIndexedRanking / me.totalNumberOfProjects) * 100);
			$(me.container).animate({ top:newY + "%" });
		}
	};


	this.convertToColour = function (numericalValue) {
		var proportion = (numericalValue / 100.0);
		var green = Math.ceil(Math.pow(proportion, 0.1) * 255.0);
		var red = Math.ceil(Math.pow(1.0 - proportion, 0.1) * 255.0);

		green = green.toString(16);
		red = red.toString(16);
		if (green.length == 1) green = "0" + green;
		if (red.length == 1) red = "0" + red;
		return "#" + red + green + "00";
	};
}

function CodeUpdater(coverageLoader, elements) {
	var me = this;
	this.start = function () {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var project = element.project;
			var percent = coverageLoader.getCoverage(project.buildId);
			element.updatePercentage(percent);
		}

		window.setTimeout(me.start, 10000);
	};
}

function BuildCoordinator(container, totalNumberOfProjects, statsLoader) {
	var me = this;
	this.statsLoader = statsLoader;
	this.container = container;
	this.builds = [];
	this.totalNumberOfProjects = totalNumberOfProjects;

	this.start = function (buildInfoLoader, projectIds) {
		for (var i = 0; i < projectIds.length; i++) {
			var id = projectIds[i];
			buildInfoLoader.retrieve(
					id, me.addBuild, function (jqXHR, textStatus, errorThrown) {
						log("Error getting " + id + ": " + textStatus + " " + errorThrown + "; will retry.");
						window.setTimeout(function () {
							me.start(buildInfoLoader, [ id ])
						}, 10000);
					});
		}
	}

	this.addBuild = function (buildInfo) {
		var pe = new ProjectElement(me.container, buildInfo, me.totalNumberOfProjects);
		pe.setRank(me.builds.length);
		me.watchProject(pe);
		me.builds.push(pe);
	};

	this.updateStats = function (projectElement, newStats) {
		projectElement.updatePercentage(newStats);
		me.builds.sort(function (a, b) {
			if (a.stats && !b.stats) return 1;
			if (b.stats && !a.stats) return -1;
			if (!a.stats && !b.stats) return 0;
			return b.stats.coveragePercent - a.stats.coveragePercent
		});
		for (var rank = 0; rank < me.builds.length; rank++) {
			me.builds[rank].setRank(rank);
		}
	};

	this.watchProject = function (projectElement) {
		me.statsLoader.getStats(projectElement.project.buildId,
				function (stats) {
					me.updateStats(projectElement, stats);
					window.setTimeout(function () {
						me.watchProject(projectElement)
					}, 5000);
				},
				function (a, b, c) {
					window.setTimeout(function () {
						me.watchProject(projectElement)
					}, 5000);
				}
		);
	};

}

function setupLeaderboard() {

	var statsLoader = createMockLoader();
	var buildInfoLoader = new MockBuildInfoLoader();
	var projectIds = [ "bt2", "bt3", "bt4" ];
	var container = document.getElementById("projectContainer");

	var buildCoordinator = new BuildCoordinator(container, projectIds.length, statsLoader);
	buildCoordinator.start(buildInfoLoader, projectIds);


	//var updater = new CodeUpdater(coverageLoader, elements);
	//updater.start();
}

function log(val) {
	if (console && console.log) {
		console.log(new Date().toTimeString() + ": " + val);
	}
}

