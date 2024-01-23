/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 0.5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    this.x = 0;
    this.y = 0;
    this.isDragging = false;

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("mousedown", this.mouseDown);
      this.el.sceneEl.addEventListener("mousemove", this.mouseMove);
      this.el.sceneEl.addEventListener("mouseup", this.mouseUp);
      // this.el.sceneEl.addEventListener("wheel", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("mousedown", this.mouseDown);
      this.el.sceneEl.removeEventListener("mousemove", this.mouseMove);
      this.el.sceneEl.removeEventListener("mouseup", this.mouseUp);
      // this.el.sceneEl.removeEventListener("wheel", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("mousedown", this.mouseDown);
    this.el.sceneEl.removeEventListener("mousemove", this.mouseMove);
    this.el.sceneEl.removeEventListener("mouseup", this.mouseUp);
    // this.el.sceneEl.removeEventListener("wheel", this.handleScale);
  },

  mouseDown: function (event) {
    this.x = event.clientX;
    this.y = event.clientY;
    this.isDragging = true;
  },

  mouseMove: function (event) {
    if (this.isDragging) {
      this.el.object3D.rotation.y +=
        (event.clientX - this.x) * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        (event.clientY - this.y) * this.data.rotationFactor;
    }
  },

  mouseUp: function (event) {
    if (this.isDragging) {
      this.x = 0;
      this.y = 0;
      this.isDragging = false;
    }
  },

  handleRotation: function (event) {
    console.log("rotation");
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function (event) {
    console.log("event", event);
    if (this.isVisible) {
      this.scaleFactor *= event.wheelDeltaY / 100;

      // 1 + event.detail.spreadChange / event.detail.startSpread;
      console.log("scaleFactor1", this.scaleFactor);

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );
      console.log("scaleFactor2", this.scaleFactor);

      console.log("intial scale", this.initialScale);

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});
