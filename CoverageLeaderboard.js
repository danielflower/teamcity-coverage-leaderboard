function BuildStatistics(buildTypeId, statisticsMap) {
	this.buildTypeId = buildTypeId;
	this.statisticsMap = statisticsMap;
	var me = this;
	this.coveragePercent = parseFloat(statisticsMap["CodeCoverageL"]);

	/**
	 * Gets a statistics value from the stats map. Sample map:
	 * <property name="ArtifactsSize" value="88830"/>
	 * <property name="BuildArtifactsPublishingTime" value="43"/>
	 * <property name="BuildCheckoutTime" value="15047"/>
	 * <property name="BuildTestStatus" value="1"/>
	 * <property name="CodeCoverageAbsCCovered" value="17.0"/>
	 * <property name="CodeCoverageAbsCTotal" value="21.0"/>
	 * <property name="CodeCoverageAbsLCovered" value="256.0"/>
	 * <property name="CodeCoverageAbsLTotal" value="464.0"/>
	 * <property name="CodeCoverageAbsMCovered" value="76.0"/>
	 * <property name="CodeCoverageAbsMTotal" value="94.0"/>
	 * <property name="CodeCoverageC" value="80.952385"/>
	 * <property name="CodeCoverageL" value="55.172413"/>
	 * <property name="CodeCoverageM" value="80.85107"/>
	 * <property name="PassedTestCount" value="25"/>
	 * <property name="SuccessRate" value="1"/>
	 * <property name="TimeSpentInQueue" value="15"/>
	 */
	this.get = function (key, defaultValue) {
		var v = me.statisticsMap[key];
		return v || defaultValue;
	};
	this.getInt = function (key, defaultValue) {
		var v = parseInt(me.statisticsMap[key]);
		return v || defaultValue;
	};
	this.getFloat = function (key, defaultValue) {
		var v = parseFloat(me.statisticsMap[key]);
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

function ProjectElement(parentElement, project, totalNumberOfProjects, headerFormat) {
	this.project = project;
	this.totalNumberOfProjects = totalNumberOfProjects;
	this.container = document.createElement("div");
	this.innerBox = document.createElement("div");
	this.name = document.createElement("span");
	this.statsSummary = document.createElement("span");
	this.percent = document.createElement("div");
	this.bar = document.createElement("div");
	this.container.className = 'ProjectBox';
	this.container.style.height = (100.0 / totalNumberOfProjects) + '%';
	this.innerBox.className = 'ProjectInnerBox';
	this.name.className = 'ProjectName';
	this.statsSummary.className = 'ProjectStatsSummary';
	this.percent.className = 'PercentageText';
	this.bar.className = 'PercentageBar';
	this.stats = null;
	this.rank = -1;

	this.innerBox.appendChild(this.percent);
	this.bar.appendChild(this.name);
	this.bar.appendChild(this.statsSummary);
	this.innerBox.appendChild(this.bar);
	this.container.appendChild(this.innerBox);
	parentElement.appendChild(this.container);

	var me = this;

	this.name.innerHTML = headerFormat
			.replace("%PROJECTNAME%", project.projectName)
			.replace("%BUILDNAME%", project.buildName);

	this.updatePercentage = function (newStats) {
		me.stats = newStats;
		var newValue = newStats.coveragePercent;
		var ceilingValue = Math.ceil(newValue);
		var backgroundColor = me.convertToColour(newValue);

		var summary = newStats.coveragePercent ? newStats.getInt("PassedTestCount", "?") + " tests covering "
				+ Math.floor(newStats.getInt("CodeCoverageAbsLTotal", 0)) + " lines" : "";
		me.statsSummary.innerHTML = summary;

		//log("Updating " + me.project.buildId + " to " + ceilingValue + "% (" + backgroundColor + ")");
		me.bar.style.width = ceilingValue + "%";
		me.bar.style.backgroundColor = backgroundColor;
		me.percent.innerHTML = (newValue || newValue === 0.0) ? ceilingValue + "%" : "??";
	};

	this.setRank = function (zeroIndexedRanking) {
		if (me.rank != zeroIndexedRanking) {
			me.rank = zeroIndexedRanking;
			var newY = Math.floor((zeroIndexedRanking / me.totalNumberOfProjects) * 100);
			$(me.container).animate({ top:newY + "%" });
		}
	};


	this.convertToColour = function (pct) {
		pct = pct / 100.0;
		var percentColors = [
			{ pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
			{ pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
			{ pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

		if (!pct) return percentColors[0].color;
		if (pct > 99) return percentColors[2].color;

		var toHex = function (num) {
			return num < 10 ? "0" + num.toString(16) : num.toString(16);
		};

		for (var i = 0; i < percentColors.length; i++) {
			if (pct < percentColors[i].pct) {
				var lower = percentColors[i - 1];
				var upper = percentColors[i];
				var range = upper.pct - lower.pct;
				var rangePct = (pct - lower.pct) / range;
				var pctLower = 1 - rangePct;
				var pctUpper = rangePct;
				var color = {
					r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
					g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
					b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
				};
				return "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
			}
		}

	};
}

function BuildCoordinator(container, totalNumberOfProjects, statsLoader, projectNameFormat) {
	var me = this;
	this.projectNameFormat = projectNameFormat;
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
	};

	this.addBuild = function (buildInfo) {
		var pe = new ProjectElement(me.container, buildInfo, me.totalNumberOfProjects, me.projectNameFormat);
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
					}, 60000);
				},
				function (jqXHR, textStatus, errorThrown) {
					log("Error getting stats for " + projectElement.project.projectName + "; will retry. Error: " + JSON.stringify(jqXHR) + " / " +
							textStatus + " / " + JSON.stringify(errorThrown));
					window.setTimeout(function () {
						me.watchProject(projectElement)
					}, 60000);
				}
		);
	};

}

function setTextSizes() {
	var barHeight = $('.ProjectInnerBox').height();
	$('.ProjectInnerBox').css('line-height', barHeight + "px");
	$('.PercentageText').css('font-size', barHeight + "px");
	$('.ProjectName').css('font-size', (barHeight  / 2) + "px");
}

function setupLeaderboard(containerElement, teamcityUrl, buildTypeIds, projectNameFormat) {
	var statsLoader = new BuildStatisticsLoader(teamcityUrl);
	var buildInfoLoader = new BuildInfoLoader(teamcityUrl);
	var buildCoordinator = new BuildCoordinator(containerElement, buildTypeIds.length, statsLoader, projectNameFormat);
	buildCoordinator.start(buildInfoLoader, buildTypeIds);

	window.setTimeout(setTextSizes, 500);
	window.onresize = setTextSizes;
}

function log(val) {
	if (console && console.log) {
		console.log(new Date().toTimeString() + ": " + val);
	}
}

