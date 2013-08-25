var Viewport = function(previewMesh) {

	var mouseDown = false,
	self = this,
	mouseDownX = 0,
	mouseDownY = 0,
	rotateX = 0,
	rotateY = 0,
	rotationXMouseDown = 0,
	rotationYMouseDown = 0;

	this.prototype = {
		init : function(e) {

			console.log(previewMesh);

			if (previewMesh == null)
			  return;

        mouseDown = true;
        mouseDownX = e.pageX;
        mouseDownY = e.pageY;
        rotationXMouseDown = previewMesh.rotation.x,
        rotationYMouseDown = previewMesh.rotation.y;
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
		}
	}

	return {
						init						: this.prototype.init,
						rotateView			: this.prototype.rotateView,
						stopRotateView  : this.prototype.stopRotateView
					}

};