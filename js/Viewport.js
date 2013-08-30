var Viewport = function(initialPreviewMesh) {

  var mouseDown = false,
  self = this,
  mouseDownX = 0,
  mouseDownY = 0,
  rotateX = 0,
  rotateY = 0,
  rotationXMouseDown = 0,
  rotationYMouseDown = 0,
  previewMesh = initialPreviewMesh;

  this.prototype = {
    init : function(e) {
      // don't make a viewport if there's no mesh
      if (previewMesh == null) {
        return;
      }
      self.prototype.setPreviewMesh( previewMesh );
        mouseDown = true;
        mouseDownX = e.pageX;
        mouseDownY = e.pageY;
        rotateY = rotateX = 0;
    },

    rotateView : function(e) {
      if (mouseDown) {
            rotateY = ( e.pageX - mouseDownX ) * 0.02;
            rotateX = ( e.pageY - mouseDownY ) * 0.02;

            previewMesh.rotation.x = rotationXMouseDown - rotateX;
            previewMesh.rotation.y = rotationYMouseDown - rotateY;
      }
    },

    stopRotateView : function(e) {
      mouseDown = false;
    },

    setPreviewMesh : function(newPreviewMesh) {
      previewMesh = newPreviewMesh;
      rotationXMouseDown = previewMesh.rotation.x,
      rotationYMouseDown = previewMesh.rotation.y;
    }
  }

  return {
    init            : this.prototype.init,
    rotateView      : this.prototype.rotateView,
    stopRotateView  : this.prototype.stopRotateView,
    setPreviewMesh  : this.prototype.setPreviewMesh
  }

};