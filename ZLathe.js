var ZLathe = (function($, t) {

	// dont ask. 
	var magicNumber = 208,
			pointArray,
			editCanvas,
			previewCanvas,
			pointArray = [],
			previewMesh = null;  

	function init() {
		console.log('oh hey');

		// create edit window canvas
		editCanvas = new canvasBox({
			'canvasWidth'  : 800,
			'canvasHeight' : 800,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'editWindow',
			'lights' : false,
			'lineHelper' : true
		});

		// create preview window canvas
		previewCanvas = new canvasBox({
			'canvasWidth'  : 400,
			'canvasHeight' : 400,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'previewWindow',
			'lights' : true,
			'lineHelper' : false
		});

		// render the window scenes
		editCanvas.renderUpdate();
		previewCanvas.renderUpdate();

		// bind click events
		bindClickEvents();

		window.editCanvas = editCanvas;

	}

	// function to generate canvas scenes for us to use
	function canvasBox(settings) {
		var s = settings,
				canvasWidth = s.canvasWidth,
				canvasHeight = s.canvasHeight,
				canvasContainer = document.getElementById(s.canvasContainer),
				canvasId = s.canvasId,
				lights = s.lights,
				self = this;

		// create scene 
		self.scene = new THREE.Scene();
		self.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 1000);
		self.camera.position.z = 500;
		self.renderer = new THREE.WebGLRenderer();
		self.renderer.setSize(canvasWidth, canvasHeight);

		// put the renderer into the canvas element
		canvasContainer.appendChild( self.renderer.domElement ).setAttribute( 'id', canvasId );
		
		// draw a line down the middle of the scene for the edit window only
		if (s.lineHelper) {
			var line = drawLine( 0, magicNumber, 0, -magicNumber, 1 );
			self.scene.add(line);
		}

		if (lights) {
			var ambientLight = new THREE.AmbientLight( 0x050505 );
	    self.scene.add(ambientLight);

	    var pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
	    pointLight.position.y = 50;
	    self.scene.add(pointLight);
		}

		function renderUpdate() {
			console.log('attempting ' + canvasId + ' render');
			self.renderer.render(self.scene, self.camera);
		}

		return {
							renderUpdate  : renderUpdate, 
							scene			   : self.scene,
							canvasWidth  : canvasWidth,
							canvasHeight : canvasHeight
						}
	}

	// simple function to draw a line between two defined vectors
	function drawLine( x1, y1, x2, y2, linewidth ) {
		var path = new THREE.Geometry(),
				lineMaterial = new THREE.LineBasicMaterial();

		path.vertices.push(new THREE.Vector3( x1, y1, 0));
		path.vertices.push(new THREE.Vector3( x2, y2, 0));

		lineMaterial.color = 0x000000,
		lineMaterial.linewidth = linewidth;

		var line = new THREE.Line(path, lineMaterial);

		return line;			
	}

	// function to add a sphere, then push to an array for drawing lines later
	function addPoint( x, y ) {

		console.log("addPoint(" + x + ', ' + y + ');');

		// make sphere
		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(5, 10, 10), 
			new THREE.MeshNormalMaterial()
		);
		sphere.overdraw = true;
		sphere.position.x = x;
		sphere.position.y = y;
		pointArray.push([ x, y ]);
		
		return sphere;	
	}

	function bindClickEvents() {
		$( "#previewWindow" ).bind({
  		mousedown: function(e) {
    		// change to viewport init() function
  		},
  		mousemove: function(e) {
    		// change to viewport rotate() function
  		},
	  	mouseup: function(e) {
	    	// change to rotate viewport stoprotate() function
	  	}
		});

		$( "#editWindow" ).bind({
			click: function(e) {
				// put the add point function here
				var vec = findSceneLoc(e.pageX, e.pageY, editCanvas),
						xPos = vec.xPos,
						yPos = vec.yPos;

				// make a sphere
				var sphere = addPoint(xPos, yPos);
				editCanvas.scene.add(sphere);

				// Don't draw single point lines
				if (pointArray.length < 2) {
						editCanvas.renderUpdate();
						return;
				}

				// find the previous point we made to help join the dots
				var prev_xPos = pointArray[ pointArray.length - 2 ][0],
						prev_yPos = pointArray[ pointArray.length - 2 ][1];

				// make our line
				line = drawLine(prev_xPos, prev_yPos, xPos, yPos, 5);
				editCanvas.scene.add(line);
				editCanvas.renderUpdate();
			}
		});

	}

	function findSceneLoc(x, y, canvasName) {
		var xPos = ( x - ( canvasName.canvasWidth / 2  ) ) * ( magicNumber * 2 / canvasName.canvasWidth ),
				yPos = ( ( canvasName.canvasHeight / 2 ) - y ) * ( magicNumber * 2 / canvasName.canvasHeight );

		return {'xPos': xPos, 'yPos': yPos}
	}


	return {
		'init': init
	}


}(jQuery, THREE));

ZLathe.init();