var Export = function() {

	// convert vectors to usable strings
	function stringifyVector(vec) {
		  return ""+vec.x+" "+vec.y+" "+vec.z;
	}

	// convert vertexes to usable strings
	function stringifyVertex(vec) {
	  return "vertex "+stringifyVector(vec)+" \n";
	}

	// basically writes a giant string repping an ASCII STL file
	function generateSTL(geometry) {
	  var vertices = geometry.vertices;
	  var tris     = geometry.faces;

	  stl = "solid pixel";
	  for (var i = 0; i < tris.length; i++) {
	    stl += ("facet normal "+stringifyVector( tris[i].normal )+" \n");
	    stl += ("outer loop \n");
	    stl += stringifyVertex( vertices[ tris[i].a ] );
	    stl += stringifyVertex( vertices[ tris[i].b ] );
	    stl += stringifyVertex( vertices[ tris[i].c ] );
	    stl += ("endloop \n");
	    stl += ("endfacet \n");
	  }
	  stl += ("endsolid");

	  return stl;
	};

	this.prototype = {

		saveSTL : function(geometry) {
			var stlString = generateSTL(geometry);
			var blob = new Blob([stlString], {type: 'text/plain'});
			saveAs(blob, 'yayLathe.stl');
		}

	};

	return {saveSTL : this.prototype.saveSTL}
}