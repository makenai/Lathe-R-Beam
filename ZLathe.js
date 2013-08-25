var ZLathe = function($, t) {


	// dont ask. 
	var magicNumber = 208,
			pointArray,
			editCanvas,
			previewCanvas,
			pointArray = [],
			previewMesh = null,
			editCanvas,
			previewCanvas,
			viewport,
			file;

	function init() {
		console.log('ZLathe initializing...');

		// create edit window canvas
		editCanvas = new CanvasBox({
			'canvasWidth'  : 800,
			'canvasHeight' : 800,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'editWindow',
			'lights' : false,
			'lineHelper' : true
		}, pointArray);

		// create preview window canvas
		previewCanvas = new CanvasBox({
			'canvasWidth'  : 400,
			'canvasHeight' : 400,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'previewWindow',
			'lights' : true,
			'lineHelper' : false
		}), pointArray;

		// populate the scenes with the bare essentials
		editCanvas.setTheScene();
		previewCanvas.setTheScene();

		// render the window scenes
		editCanvas.renderUpdate();
		previewCanvas.renderUpdate();

		// bind click events
		bindClickEvents();

		console.log('ZLathe ready!')

		// take this out later, just for testing
		// window.editCanvas = editCanvas;
		// window.previewCanvas = previewCanvas;

	}

	function bindClickEvents() {

		$( "#editWindow" ).bind({
			click: function(e) {
				// put the add point function here
				var vec = editCanvas.findSceneLoc(e.pageX, e.pageY),
						xPos = vec.xPos,
						yPos = vec.yPos;

				// make a sphere
				editCanvas.addPoint(xPos, yPos);
				
				// Don't draw single point lines
				if (pointArray.length < 2) {
						editCanvas.renderUpdate();
						return;
				}

				// find the previous point we made to help join the dots
				var prev_xPos = pointArray[ pointArray.length - 2 ][0],
						prev_yPos = pointArray[ pointArray.length - 2 ][1];

				// make our line
				editCanvas.drawLine(prev_xPos, prev_yPos, xPos, yPos, 5);
				// render
				editCanvas.renderUpdate();
			}
		});

		$('#lathe').bind({
			click: function(e) {
				e.preventDefault();
				// run lathe 
				previewMesh = previewCanvas.makeLathe(pointArray, previewMesh);
				// render!!
				previewCanvas.renderUpdate();

				// kick off a new viewport for ther new mesh
				viewport = new Viewport(previewMesh);

				// bind viewport events
				previewCanvas.bindViewportEvents(viewport);	
			}
		});

		$('#exportstl').bind({
			click: function(e) {
				e.preventDefault();
				var file = new Export;
				file.saveSTL(previewMesh.geometry);
			}
		});

	}

	return {
		'init': init
	}

}(jQuery, THREE);

// let's kick this shit off
ZLathe.init();