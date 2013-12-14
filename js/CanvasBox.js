// function to generate canvas scenes for us to use
var CanvasBox = function(settings) {
      var self = this,
      s = settings,
      canvasWidth = s.canvasWidth,
      canvasHeight = s.canvasHeight,
      canvasContainer = document.getElementById(s.canvasContainer),
      canvasId = s.canvasId,
      projector = new THREE.Projector();

      self.scene = new THREE.Scene();

    // create a new scene for use
    function setTheScene() {
  
      // create scene 
      self.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 1000);
      self.camera.position.z = 400;

      if (s.renderer == 'Canvas') {
        self.renderer = new THREE.CanvasRenderer();
      } else {
        self.renderer = new THREE.WebGLRenderer({ antialias: true }); 
      }
      self.renderer.setSize(canvasWidth, canvasHeight);

      // put the renderer into the canvas element
      canvasContainer.appendChild( self.renderer.domElement ).setAttribute( 'id', canvasId );
      
      // need to call this before calling findSceneLoc (why?)
      renderUpdate();

      // draw a line down the middle of the scene for the edit window only
      if (s.lineHelper) {
        var radius = findSceneLoc( canvasWidth / 2, 0 );
        var line = this.drawLine( 0, radius.yPos, 0, -radius.yPos, { color: 0x0000FF, dashed: true } );
        self.scene.add(line);
      }

      if (s.lights) {
        var light = new THREE.PointLight( 0xFFFFFF, 1.5 );
            light.position.set( 20, 20, 600 );
            self.scene.add( light );
      }

    }

    // simple function to draw a line between two defined vectors
    function drawLine(x1, y1, x2, y2, options) {
      options = options || {};
      color = options.color || 0x000000;
      thickness = options.thickness || 2;
      dashed = options.dashed || false;

      var path = new THREE.Geometry(),
        lineMaterial = dashed ? 
          new THREE.LineDashedMaterial({ dashSize: 4, gapSize: 5, opacity: 0.25 }) : 
          new THREE.LineBasicMaterial();

      //put the user created points into the geometry
      path.vertices.push(new THREE.Vector3( x1, y1, 0));
      path.vertices.push(new THREE.Vector3( x2, y2, 0));
      path.computeLineDistances();

      // set the line properties
      lineMaterial.color = new THREE.Color( color ),
      lineMaterial.linewidth = thickness;

      // create the line and add it to the scene
      var line = new THREE.Line(path, lineMaterial);
      self.scene.add(line);   
    }

    // function to add a sphere, then push to an array for drawing lines later
    function addPoint(x, y) {

      // make sphere
      var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.5), 
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0x5F5F9F) })
      );

      // set sphere props
      sphere.overdraw = true;
      sphere.position.x = x;
      sphere.position.y = y;
      sphere.position.z = 0;
      
      // add spehere to scene
      self.scene.add(sphere);
    }

    function clearScene() {
      var children = self.scene.children.slice(0);
      $.each( children, function( i, child) {
        // Remove everything but the dotted line
        if ( i > 0 )
          self.scene.remove( child );
      }); 
    }

    function removeLastItem() {
      var children = self.scene.children.slice(0);
      if ( children.length == 1 )
        return;
      self.scene.remove( children[ children.length - 1 ] );
    }

    // mapping browser coords to canvas 3d space coords
    // Susan, please tell me if these comments make any sense and if I am understanding what is happening. :3 -Pawel
    function findSceneLoc(x, y) {
        // Calculate the x,y on the near plane of the camera between -1 and 0
        var vector = new THREE.Vector3( ( x / canvasWidth ) * 2 - 1,  -( y / canvasHeight ) * 2 + 1, 0.5 );
        // Translate from the 2D coordinate to the 3D world
        projector.unprojectVector( vector, self.camera );
            // Zoom our point away from our camera to the right point on the Z scale mostly (0)
        var direction = vector.sub( self.camera.position ).normalize(),
            // Cast a ray from in the camera in direction of the click
            ray = new THREE.Ray( self.camera.position, direction ),
            // Calculate the scale of the distance
            distance_ratio = -self.camera.position.z / direction.z,
            // Get final position on Z plane by multiplying by our correct distance ratio
            pos = self.camera.position.clone().add( direction.multiplyScalar( distance_ratio ) );
        return {'xPos': pos.x, 'yPos': pos.y }
    }

    // major function to create the lathed object
    function makeLathe(pointArray, previewMesh) {
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

      // Lazily load and cache preview mesh texture
      if ( !self.texture ) {
        self.texture = THREE.ImageUtils.loadTexture('images/texture.png', {}, function() {
          renderUpdate();
        });
      }

      // wooo new mesh
      previewMesh = new THREE.Mesh(
        // let's give it 36 segs for now
        new THREE.LatheGeometry(path.vertices, 36),
        // make it shiny, textured and pretty
        new THREE.MeshPhongMaterial({ 
            color: new THREE.Color( 0x2020FF ),
            shininess: 200,
            specular: 0x202020,
            bumpMap: self.texture,
            bumpScale: 3,
            side: THREE.DoubleSide
          })
      );

      // add the mesh to the previewCanvas scene
      self.scene.add( previewMesh );
      // rotate it to correct orientation
      previewMesh.rotation.x = -Math.PI / 2;

      return previewMesh;
    }

    // once a viewport is created, bind the mouse events
    function bindViewportEvents(viewport) {

      $( "#previewWindow" ).bind({
        mousedown: function(e) {
          viewport.startRotateView(e);
        },
        mousemove: function(e) {
          viewport.rotateView(e);
          renderUpdate();
        },
        mouseup: function(e) {
          viewport.stopRotateView();
        }
      });

    }

    // very useful and heavily used to update render in the canvas
   function renderUpdate() {
      self.renderer.render(self.scene, self.camera);
    }

  return {
            setTheScene        : setTheScene,
            renderUpdate       : renderUpdate, 
            drawLine           : drawLine,
            addPoint           : addPoint,
            removeLastItem     : removeLastItem,
            makeLathe          : makeLathe,
            findSceneLoc       : findSceneLoc,
            clearScene         : clearScene,
            bindViewportEvents : bindViewportEvents,
            scene              : self.scene,
            canvasWidth        : canvasWidth,
            canvasHeight       : canvasHeight
          }
};