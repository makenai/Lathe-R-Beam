var ZLathe = (function($, t) {

	// dont ask. 
	var magicNumber = 208,
			pointArray;

	function init() {
		console.log('oh hey');

		// create edit window canvas
		var editCanvas = createCanvasScene({
			'canvasWidth'  : 800,
			'canvasHeight' : 800,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'editWindow',
			'lights' : false,
			'lineHelper' : true
		});

		// create preview window canvas
		var previewCanvas = createCanvasScene({
			'canvasWidth'  : 400,
			'canvasHeight' : 400,
			'canvasContainer' : 'canvasContainer',
			'canvasId' : 'previewWindow',
			'lights' : true,
			'lineHelper' : false
		});

		// render the window scenes
		editCanvas.renderScene;
		previewCanvas.renderScene;
	}

	// function to generate canvas scenes for us to use
	function createCanvasScene(settings) {
		var s = settings,
				canvasWidth = s.canvasWidth,
				canvasHeight = s.canvasHeight,
				canvasContainer = document.getElementById(s.canvasContainer),
				canvasId = s.canvasId,
				lights = s.lights;

		// create scene 
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 1000);
		this.camera.position.z = 500;
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(canvasWidth, canvasHeight);

		// put the renderer into the canvas element
		canvasContainer.appendChild( renderer.domElement ).setAttribute( 'id', canvasId );
		
		// draw a line down the middle of the scene for the edit window only
		if (s.lineHelper) {
			var line = drawLine( 0, magicNumber, 0, -magicNumber );
			this.scene.add(line);
		}

		if (lights) {
			var ambientLight = new THREE.AmbientLight( 0x050505 );
	    this.scene.add(ambientLight);

	    var pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
	    pointLight.position.y = 50;
	    this.scene.add(pointLight);
		}

		return {
							'renderScene': this.renderer.render(scene, camera), 
							'scene'			 : this.scene
						}
	}

	// simple function to draw a line between two defined vectors
	function drawLine( x1, y1, x2, y2 ) {
		var path = new THREE.Geometry(),
				lineMaterial = new THREE.LineBasicMaterial();

		path.vertices.push(new THREE.Vector3( x1, y1, 0));
		path.vertices.push(new THREE.Vector3( x2, y2, 0));

		lineMaterial.color = 0x000000,
		lineMaterial.linewidth = 1;

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

		// move these to the click event when you make it!
		console.log('move scene and renderer from addPoint() !!')
		scene.add( sphere );
		renderer.render(scene, camera);

		return sphere;
		
	}


	return {
		'init': init
	}


}(jQuery, THREE));

ZLathe.init();