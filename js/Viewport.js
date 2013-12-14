var Viewport = function(initialPreviewMesh) {
  // update what the preview mesh should be before manipulating
  this.setPreviewMesh(initialPreviewMesh);

}

Viewport.prototype = {

  mouseDown          : false,
  mouseDownX         : 0,
  mouseDownY         : 0,
  rotateX            : 0,
  rotateY            : 0,
  rotationXMouseDown : 0,
  rotationYMouseDown : 0,


  startRotateView : function(e) {
    // don't make a viewport if there's no mesh
    if (!this.previewMesh) {
      return;
    }

    this.rotationXMouseDown = this.previewMesh.rotation.x;
    this.rotationYMouseDown = this.previewMesh.rotation.y;

    this.mouseDown = true;
    this.mouseDownX = e.pageX;
    this.mouseDownY = e.pageY;
    this.rotateY = this.rotateX = 0;
  },

  rotateView : function(e) {
    if (this.mouseDown) {
      this.rotateY = ( e.pageX - this.mouseDownX ) * 0.02;
      this.rotateX = ( e.pageY - this.mouseDownY ) * 0.02;

      this.previewMesh.rotation.x = this.rotationXMouseDown - this.rotateX;
      this.previewMesh.rotation.y = this.rotationYMouseDown - this.rotateY;
    }
  },

  stopRotateView : function(e) {
    this.mouseDown = false;
  },

  setPreviewMesh : function(newPreviewMesh) {
    this.previewMesh = newPreviewMesh;
  }

};