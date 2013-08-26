var ZLathe = function($, t) {

	var editCanvas,
			previewCanvas,
			pointArray = [], // Kind of feels like this should live in 
							 // editCanvas and we should call editCanvas.getPointArray? -Pawel
			previewMesh = null,
			editCanvas,
			previewCanvas,
			viewport,
			file;

	function init() {
		console.log('ZLathe initializing...');

		// create edit window canvas
		editCanvas = new CanvasBox({
			'canvasWidth'  : 570,
			'canvasHeight' : 570,
			'canvasContainer' : 'windows',
			'canvasId' : 'editWindow',
			'renderer' : 'Canvas',
			'lights' : false,
			'lineHelper' : true
		});

		// create preview window canvas
		previewCanvas = new CanvasBox({
			'canvasWidth'  : 570,
			'canvasHeight' : 570,
			'canvasContainer' : 'windows',
			'canvasId' : 'previewWindow',
			'lights' : true,
			'lineHelper' : false
		});

		// populate the scenes with the bare essentials
		editCanvas.setTheScene();
		previewCanvas.setTheScene();

		// render the window scenes
		editCanvas.renderUpdate();
		previewCanvas.renderUpdate();

		// bind click events
		bindClickEvents();

		console.log('ZLathe ready!')

		// take this out later, just for testing/debugging
		// window.editCanvas = editCanvas;
		// window.previewCanvas = previewCanvas;

	}

	// Enable / disable the Lathe and STL buttons
	function updateButtonStates() {
		console.log('updating.');
		// Less than three poitns are not lathe-able
		if (pointArray.length < 3) {
			$('#lathe').prop('disabled', true);
		} else {
			$('#lathe').prop('disabled', false);
		}

		// Preview mesh is required for an export
		if ( previewMesh ) {
			$('#exportstl').prop('disabled', false);
		} else {
			$('#exportstl').prop('disabled', true);
		}

	}	

	function bindClickEvents() {

		$("#editWindow").bind({
			click: function(e) {

				// Firefox support for relative X / Y positions
				var offsetX = e.offsetX || e.clientX - $(e.target).offset().left,
					offsetY = e.offsetY || e.clientY - $(e.target).offset().top;

				// put the add point function here
				var vec = editCanvas.findSceneLoc(offsetX, offsetY),
						xPos = vec.xPos,
						yPos = vec.yPos;

				// make a sphere
				editCanvas.addPoint(xPos, yPos);
				pointArray.push([ xPos, yPos ]);

				// Draw a line connecting the dots
				if ( pointArray.length > 1 ) {
					editCanvas.drawLine( 
						pointArray[ pointArray.length - 2 ][0], pointArray[ pointArray.length - 2 ][1], 
						pointArray[ pointArray.length - 1 ][0], pointArray[ pointArray.length - 1 ][1],
						{ thickness: 2 }
					);
				}		

				editCanvas.renderUpdate();
				updateButtonStates();
			}
		});

		$('#lathe').bind({
			click: function(e) {
				// this ain't no hyperlink yo
				e.preventDefault();

				// run lathe and render
				previewMesh = previewCanvas.makeLathe(pointArray, previewMesh);
				previewCanvas.renderUpdate();

				// kick off a new viewport for ther new mesh, then bind events for it
				if ( !viewport ) {
					viewport = new Viewport(previewMesh);
					previewCanvas.bindViewportEvents(viewport);
				} else {
					viewport.setPreviewMesh( previewMesh );
				}
				updateButtonStates();
			}
		});

		$('#clear').bind({
			click: function(e) {
				// this ain't no hyperlink yo
				e.preventDefault();
				if ( !confirm('Are you sure you want to clear everything?') )
					return;
				// Empty out the point array
				pointArray.splice(0,pointArray.length);
				editCanvas.clearScene();
				editCanvas.renderUpdate();
				updateButtonStates();
			}
		});

		$('#undo').bind({
			click: function(e) {
				// this ain't no hyperlink yo
				e.preventDefault();
				pointArray.pop();			
				// Remove line. then the point
				editCanvas.removeLastItem();
				editCanvas.removeLastItem();
				editCanvas.renderUpdate();
				updateButtonStates();
			}
		});		

		$('#exportstl').bind({
			click: function(e) {
				// this ain't no hyperlink yo
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

// let's kick this off
ZLathe.init();