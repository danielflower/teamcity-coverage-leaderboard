


function createMockLoader() {
	return {
		getCoverage: function (buildId) { return 90; }
	};
}

function Project (buildId, name, coveragePercentage) {
	this.buildId = buildId;
	this.name = name;
	this.coveragePercentage = coveragePercentage;
	var me = this;
	this.updateCoverage = function (coverageLoader) {
		me.coveragePercentage = coverageLoader.getCoverage(me.buildId);
	};
}

function createProjects() {
	return [ new Project("bt19", "My Project", null) ];
}

function ProjectElement (parentElement, project) {
	this.project = project;
	this.container = document.createElement("div");
	this.name = document.createElement("span");
	this.percent = document.createElement("span");
	this.bar = document.createElement("div");
	this.container.className = 'ProjectBox';
	this.name.className = 'ProjectName';
	this.percent.className = 'PercentageText';
	this.bar.className = 'PercentageBar';

	this.container.appendChild(this.bar);
	this.container.appendChild(this.name);
	this.container.appendChild(this.percent);
	parentElement.appendChild(this.container);

	this.name.innerHTML = project.name;

	var me = this;
	this.updatePercentage = function (newValue) {
		me.percent.innerHTML = newValue + "%";
	};
}

function init() {

	var coverageLoader = createMockLoader();
	var projects = createProjects(document);
	var container = document.getElementById("projectContainer");
	var elements = [];
	for (var i = 0; i < projects.length; i++) {
		var project = projects[i];
		elements.push(new ProjectElement(container, project));
	}

}

window.onload = init;
