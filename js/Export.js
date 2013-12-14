var Export = function() {}

Export.prototype = {
  // convert vectors to usable strings
  stringifyVector : function(vec) {
      return "" + vec.x + " " + vec.y + " " + vec.z;
  },

  // convert vertexes to usable strings
  stringifyVertex : function(vec) {
    return "vertex " + this.stringifyVector(vec) + " \n";
  },

  // basically writes a giant string repping an ASCII STL file
  generateSTL : function(geometry) {
    var vertices = geometry.vertices,
        tris     = geometry.faces;

    stl = "solid pixel";
    for (var i = 0; i < tris.length; i++) {
      stl += ("facet normal " + this.stringifyVector(tris[i].normal) + " \n");
      stl += ("outer loop \n");
      stl += this.stringifyVertex(vertices[tris[i].a]);
      stl += this.stringifyVertex(vertices[tris[i].b]);
      stl += this.stringifyVertex(vertices[tris[i].c]);
      stl += ("endloop \n");
      stl += ("endfacet \n");
    }
    stl += ("endsolid");

    return stl;
  },

  saveSTL : function(geometry) {
    var stlString = this.generateSTL(geometry);
    var blob = new Blob([stlString], {type: 'text/plain'});
    saveAs(blob, 'yayLathe.stl');
  }
};