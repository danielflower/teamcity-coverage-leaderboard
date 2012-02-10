function createMockLoader() {
	return {
		getCoverage:function (buildId) {
			return 100 * Math.random();
		}
	};
}

function Project(buildId, name) {
	// bt185,bt187
	//http://teamcity.jetbrains.com/guestAuth/app/rest/builds/buildType:bt187,status:SUCCESS/statistics/CodeCoverageL
	//http://teamcity.jetbrains.com/guestAuth/app/rest/builds/id:36552/statistics
	this.buildId = buildId;
	this.name = name;
}

function createProjects() {
	return [ new Project("bt19", "My Project"), new Project("bt20", "Another great project"), new Project("bt21", "Proj 3") ];
}

function ProjectElement(parentElement, project, totalNumberOfProjects) {
	this.project = project;
	this.container = document.createElement("div");
	this.innerBox = document.createElement("div");
	this.name = document.createElement("span");
	this.percent = document.createElement("span");
	this.bar = document.createElement("div");
	this.container.className = 'ProjectBox';
	var barHeightPercentage = parseInt(100.0 / totalNumberOfProjects) + '%';
	this.container.style.height = barHeightPercentage;
	this.innerBox.className = 'ProjectInnerBox';
	this.name.className = 'ProjectName';
	this.percent.className = 'PercentageText';
	this.bar.className = 'PercentageBar';

	this.bar.appendChild(this.name);
	this.bar.appendChild(this.percent);
	this.innerBox.appendChild(this.bar);
	this.container.appendChild(this.innerBox);
	parentElement.appendChild(this.container);

	this.name.innerHTML = project.name;

	var me = this;
	this.updatePercentage = function (newValue) {
		var ceilingValue = Math.ceil(newValue);
		var backgroundColor = me.convertToColour(newValue);
		log("Updating " + me.project.buildId + " to " + ceilingValue + "% (" + backgroundColor + ")");
		me.bar.style.width = ceilingValue + "%";
		me.bar.style.backgroundColor = backgroundColor;
		me.percent.innerHTML = ceilingValue + "%";
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

function init() {

	var coverageLoader = createMockLoader();
	var projects = createProjects(document);
	var container = document.getElementById("projectContainer");
	var elements = [];
	for (var i = 0; i < projects.length; i++) {
		var project = projects[i];
		elements.push(new ProjectElement(container, project, projects.length));
	}

	var updater = new CodeUpdater(coverageLoader, elements);
	updater.start();
}

function log(val) {
	if (console && console.log) {
		console.log(new Date().toTimeString() + ": " + val);
	}
}

window.onload = init;

