// function to generate canvas scenes for us to use
var CanvasBox = function(settings, pointArray) {
			var self = this,
			s = settings,
			canvasWidth = s.canvasWidth,
			canvasHeight = s.canvasHeight,
			canvasContainer = document.getElementById(s.canvasContainer),
			canvasId = s.canvasId,
			lights = s.lights,
			// dont ask.
			magicNumber = 208;
			self.scene = new THREE.Scene();

	this.prototype = {

		// create a new scene for use
		setTheScene	: function() {
	
			// create scene 
			self.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 1000);
			self.camera.position.z = 500;
			self.renderer = new THREE.WebGLRenderer();
			self.renderer.setSize(canvasWidth, canvasHeight);

			// put the renderer into the canvas element
			canvasContainer.appendChild( self.renderer.domElement ).setAttribute( 'id', canvasId );
			
			// draw a line down the middle of the scene for the edit window only
			if (s.lineHelper) {
				var line = this.drawLine( 0, magicNumber, 0, -magicNumber, 1 );
				self.scene.add(line);
			}

			if (lights) {
				var ambientLight = new THREE.AmbientLight( 0x050505 );
		    self.scene.add(ambientLight);

		    var pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
		    pointLight.position.y = 50;
		    self.scene.add(pointLight);
			}

		},

		// simple function to draw a line between two defined vectors
		drawLine : function( x1, y1, x2, y2, linewidth ) {
			var path = new THREE.Geometry(),
					lineMaterial = new THREE.LineBasicMaterial();

			put the user created points into the geometry
			path.vertices.push(new THREE.Vector3( x1, y1, 0));
			path.vertices.push(new THREE.Vector3( x2, y2, 0));

			// set the line properties
			lineMaterial.color = 0x000000,
			lineMaterial.linewidth = linewidth;

			// create the line and add it to the scene
			var line = new THREE.Line(path, lineMaterial);
			self.scene.add(line);		
		},

		// function to add a sphere, then push to an array for drawing lines later
	 	addPoint : function( x, y ) {

			// make sphere
			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(5, 10, 10), 
				new THREE.MeshNormalMaterial()
			);

			// set sphere props
			sphere.overdraw = true;
			sphere.position.x = x;
			sphere.position.y = y;
			pointArray.push([ x, y ]);
			
			// add spehere to scene
			self.scene.add(sphere);
	},

		// mapping browser coords to canvas 3d space coords
		findSceneLoc : function(x, y) {
				var xPos = ( x - ( canvasWidth / 2  ) ) * ( magicNumber * 2 / canvasWidth ),
						yPos = ( ( canvasHeight / 2 ) - y ) * ( magicNumber * 2 / canvasHeight );

				return {'xPos': xPos, 'yPos': yPos}
		},

		// major function to create the lathed object
		makeLathe: function(pointArray, previewMesh) {
			// if someone didn't draw a very good shape with enough points
			if (pointArray.length < 3) {
				return;
			}

			// start creating our new path prepped for lathing
			var path = new THREE.Geometry();

			// populate new geometry with all the points the user created
			$.each(pointArray, function(i, p) {
				path.vertices.push(new THREE.Vector3(0, p[0], p[1]));
			});

			// snap first and last points for cleaner lathing
			path.vertices[0].y = 0.01;
			path.vertices[path.vertices.length - 1].y = 0.01;

			// if there's already a mesh, remove it ready for a new one
			if (previewMesh != null) {
				self.scene.remove( previewMesh );
			}

			// wooo new mesh
			previewMesh = new THREE.Mesh(
				// let's give it 36 segs for now
				new THREE.LatheGeometry(path.vertices, 36),
				// make it shiny
				new THREE.MeshPhongMaterial({ color: 0x3333AA, shininess: 150 })
			);

			// add the mesh to the previewCanvas scene
			self.scene.add( previewMesh );
			// rotate it to correct orientation
			previewMesh.rotation.x = 300;

			return previewMesh;
		},

		// once a viewport is created, bind the mouse events
		bindViewportEvents : function(viewport) {

			$( "#previewWindow" ).bind({
	  		mousedown: function(e) {
	    		viewport.init(e);
	  		},
	  		mousemove: function(e) {
	    		viewport.rotateView(e);
	    		self.renderer.render(self.scene, self.camera);
	  		},
		  	mouseup: function(e) {
		    	viewport.stopRotateView();
		  	}
			});

		},

		// very useful and heavily used to update render in the canvas
		renderUpdate : function() {
			self.renderer.render(self.scene, self.camera);
		}

	};

	return {
						setTheScene				 : this.prototype.setTheScene,
						renderUpdate  		 : this.prototype.renderUpdate, 
						drawLine					 : this.prototype.drawLine,
						addPoint					 : this.prototype.addPoint,
						makeLathe					 : this.prototype.makeLathe,
						findSceneLoc			 : this.prototype.findSceneLoc,
						bindViewportEvents : this.prototype.bindViewportEvents,
						scene			   		 	 : self.scene,
						canvasWidth  		 	 : canvasWidth,
						canvasHeight 		 	 : canvasHeight
					}
};