var Chart = require('ti.jbchart');

var COLORS = {
	background: '#111827',
	card: '#1F2937',
	text: '#F9FAFB',
	secondaryText: '#9CA3AF',
	blue: '#3B82F6',
	green: '#22C55E',
	orange: '#F59E0B',
	purple: '#A855F7',
	pink: '#EC4899',
	selection: '#FFFFFF'
};

var LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Next'];

function randomValues(count, minimum, maximum) {
	var values = [];
	var index;

	for (index = 0; index < count; index += 1) {
		values.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
	}

	return values;
}

function randomSeries(seriesCount) {
	var series = [];
	var index;

	for (index = 0; index < seriesCount; index += 1) {
		series.push(randomValues(LABELS.length, 4, 28));
	}

	return series;
}

function createRows() {
	var rows = [];
	var index;

	for (index = 1; index <= 24; index += 1) {
		rows.push({
			title: 'Scrollable TableView row ' + index,
			height: 50,
			color: COLORS.text,
			backgroundColor: index % 2 === 0 ? '#172033' : COLORS.background
		});
	}

	return rows;
}

function createStatusLabel() {
	return Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: 42,
		left: 16,
		right: 16,
		color: COLORS.text,
		font: { fontSize: 14, fontWeight: 'semibold' },
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text: 'Touch or drag across the chart'
	});
}

function createChart(type, cancelParentGestures) {
	var common = {
		width: Ti.UI.FILL,
		height: 240,
		left: 16,
		right: 16,
		backgroundColor: COLORS.card,
		chartBackgroundColor: COLORS.card,
		selectionBarColor: COLORS.selection,
		toolTipData: LABELS,
		autoRelayoutChartOnOrientationChange: true,
		cancelParentGestures: cancelParentGestures,
		bubbleParent: false
	};

	if (type === 'bar') {
		common.data = randomValues(LABELS.length, 4, 28);
		common.barColors = [COLORS.blue, COLORS.green, COLORS.orange, COLORS.purple];
		common.defaultBarColor = COLORS.pink;
		common.barPadding = 5;
		common.barCornerRadius = 8;
		common.barCornerPosition = Chart.BAR_CORNERS_TOP;
		common.animateOnLoad = true;
		common.animateOnReload = true;
		common.barAnimationDuration = 350;
		common.barAnimationStagger = 30;
		return Chart.createBarChartView(common);
	}

	if (type === 'line') {
		common.data = randomSeries(3);
		common.styles = [Chart.CHART_LINE_SOLID, Chart.CHART_LINE_DASHED];
		common.lineColors = [COLORS.green, COLORS.blue];
		common.selectedLineColors = [COLORS.selection, COLORS.orange];
		common.lineWidths = [2, 5];
		common.defaultLineColor = COLORS.pink;
		common.defaultSelectedLineColor = COLORS.selection;
		common.defaultLineWidth = 3;
		return Chart.createLineChartView(common);
	}

	common.data = randomSeries(3);
	common.styles = [Chart.CHART_AREA_SMOOTH, Chart.CHART_AREA_SOLID];
	common.lineColors = [COLORS.green, COLORS.blue];
	common.fillColors = ['#5522C55E', '#553B82F6'];
	common.selectedLineColors = [COLORS.selection, COLORS.orange];
	common.selectedAreaColors = ['#88FFFFFF', '#88F59E0B'];
	common.defaultLineColor = COLORS.pink;
	common.defaultFillColor = '#55EC4899';
	common.defaultSelectedLineColor = COLORS.selection;
	common.defaultSelectedAreaColor = '#88FFFFFF';
	common.barWidth = 3;
	return Chart.createAreaChartView(common);
}

function updateChartData(chartView, type) {
	chartView.toolTipData = LABELS;

	if (type === 'bar') {
		chartView.data = randomValues(LABELS.length, 4, 28);
		chartView.barPadding = Math.random() > 0.5 ? 2 : 7;
	} else {
		chartView.data = randomSeries(3);
	}

	chartView.reloadData();
}

function addChartEvents(chartView, statusLabel, type) {
	chartView.addEventListener('selected', function (event) {
		var seriesText = type === 'bar' ? '' : 'series ' + event.dataIndex + ', ';
		statusLabel.text = 'Selected ' + seriesText + 'column ' + event.columnIndex;
		Ti.API.info('[Ti.JBChart selected] ' + JSON.stringify(event));
	});

	chartView.addEventListener('unselected', function (event) {
		statusLabel.text = 'Selection ended';
		Ti.API.info('[Ti.JBChart unselected] ' + JSON.stringify(event));
	});
}

function createDemoWindow(type, initiallyProtected) {
	var title = type.charAt(0).toUpperCase() + type.slice(1) + ' chart';
	var win = Ti.UI.createWindow({
		title: title,
		backgroundColor: COLORS.background,
		barColor: COLORS.background,
		translucent: false,
		swipeToClose: true
	});
	var header = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: type === 'bar' ? 520 : 445,
		layout: 'vertical',
		backgroundColor: COLORS.background
	});
	var instructions = Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: 62,
		left: 16,
		right: 16,
		color: COLORS.secondaryText,
		font: { fontSize: 13 },
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text: 'Drag across the chart, then try to scroll the table or swipe back. Toggle protection to compare behaviors.'
	});
	var statusLabel = createStatusLabel();
	var chartView = createChart(type, initiallyProtected);
	var controlRow = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 52,
		layout: 'horizontal'
	});
	var reloadButton = Ti.UI.createButton({
		width: '48%',
		height: 38,
		title: 'Reload random data',
		color: COLORS.blue
	});
	var protectionLabel = Ti.UI.createLabel({
		width: '34%',
		height: 38,
		color: COLORS.text,
		font: { fontSize: 13 },
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		text: 'Protect drag'
	});
	var protectionSwitch = Ti.UI.createSwitch({
		width: '18%',
		height: 38,
		value: initiallyProtected
	});
	var tableView = Ti.UI.createTableView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: COLORS.background,
		separatorColor: '#374151',
		showVerticalScrollIndicator: true,
		headerView: header,
		data: createRows()
	});

	header.add(instructions);
	header.add(statusLabel);
	header.add(chartView);
	controlRow.add(reloadButton);
	controlRow.add(protectionLabel);
	controlRow.add(protectionSwitch);
	header.add(controlRow);

	if (type === 'bar') {
		var cornerModes = [
			{ title: 'Top corners', value: Chart.BAR_CORNERS_TOP },
			{ title: 'Bottom corners', value: Chart.BAR_CORNERS_BOTTOM },
			{ title: 'All corners', value: Chart.BAR_CORNERS_ALL },
			{ title: 'Square corners', value: Chart.BAR_CORNERS_NONE }
		];
		var cornerModeIndex = 0;
		var animationDurations = [200, 350, 600];
		var animationDurationIndex = 1;
		var cornerRow = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 52,
			layout: 'horizontal'
		});
		var cornerButton = Ti.UI.createButton({
			width: '40%',
			height: 38,
			title: cornerModes[cornerModeIndex].title,
			color: COLORS.purple
		});
		var radiusLabel = Ti.UI.createLabel({
			width: '22%',
			height: 38,
			color: COLORS.text,
			font: { fontSize: 13 },
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			text: 'Radius 8'
		});
		var radiusSlider = Ti.UI.createSlider({
			width: '38%',
			height: 38,
			min: 0,
			max: 20,
			value: 8
		});
		var animationRow = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 52,
			layout: 'horizontal'
		});
		var animationLabel = Ti.UI.createLabel({
			width: '36%',
			height: 38,
			color: COLORS.text,
			font: { fontSize: 13 },
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			text: 'Animate reload'
		});
		var animationSwitch = Ti.UI.createSwitch({
			width: '18%',
			height: 38,
			value: true
		});
		var durationButton = Ti.UI.createButton({
			width: '46%',
			height: 38,
			title: 'Duration 350 ms',
			color: COLORS.green
		});

		cornerRow.add(cornerButton);
		cornerRow.add(radiusLabel);
		cornerRow.add(radiusSlider);
		animationRow.add(animationLabel);
		animationRow.add(animationSwitch);
		animationRow.add(durationButton);
		header.add(cornerRow);
		header.add(animationRow);

		cornerButton.addEventListener('click', function () {
			cornerModeIndex = (cornerModeIndex + 1) % cornerModes.length;
			chartView.barCornerPosition = cornerModes[cornerModeIndex].value;
			cornerButton.title = cornerModes[cornerModeIndex].title;
			statusLabel.text = 'barCornerPosition: ' + cornerModes[cornerModeIndex].title;
		});

		radiusSlider.addEventListener('change', function (event) {
			var radius = Math.round(event.value);
			chartView.barCornerRadius = radius;
			radiusLabel.text = 'Radius ' + radius;
		});

		animationSwitch.addEventListener('change', function (event) {
			chartView.animateOnReload = event.value;
			statusLabel.text = 'animateOnReload: ' + event.value;
		});

		durationButton.addEventListener('click', function () {
			animationDurationIndex = (animationDurationIndex + 1) % animationDurations.length;
			chartView.barAnimationDuration = animationDurations[animationDurationIndex];
			durationButton.title = 'Duration ' + animationDurations[animationDurationIndex] + ' ms';
		});
	}
	win.add(tableView);

	addChartEvents(chartView, statusLabel, type);

	reloadButton.addEventListener('click', function () {
		updateChartData(chartView, type);
		statusLabel.text = 'Data reloaded';
	});

	protectionSwitch.addEventListener('change', function (event) {
		chartView.cancelParentGestures = event.value;
		statusLabel.text = 'cancelParentGestures: ' + event.value;
	});

	return win;
}

var demos = [
	{ title: 'Bar chart — every property, protected', type: 'bar', protected: true },
	{ title: 'Bar chart — legacy touch behavior', type: 'bar', protected: false },
	{ title: 'Line chart — every property and style', type: 'line', protected: true },
	{ title: 'Area chart — every property and style', type: 'area', protected: true }
];
var menuWindow = Ti.UI.createWindow({
	title: 'Ti.JBChart 0.8.0 Tests',
	backgroundColor: COLORS.background,
	barColor: COLORS.background,
	translucent: false
});
var menuRows = demos.map(function (demo, index) {
	return {
		title: demo.title,
		itemId: String(index),
		hasChild: true,
		height: 58,
		color: COLORS.text,
		backgroundColor: COLORS.background
	};
});
var menuTable = Ti.UI.createTableView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	backgroundColor: COLORS.background,
	separatorColor: '#374151',
	data: menuRows
});
var navigation = Ti.UI.createNavigationWindow({ window: menuWindow });

menuTable.addEventListener('click', function (event) {
	var demo = demos[Number(event.rowData.itemId)];
	navigation.openWindow(createDemoWindow(demo.type, demo.protected));
});

menuWindow.add(menuTable);
navigation.open();
