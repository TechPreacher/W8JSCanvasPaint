/// <reference group="Dedicated Worker" />

// canvas.js is adapted from wiliammalone's excellent 
// "Create a Drawing App with HTML5 Canvas and JavaScript" project. 
// (http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/).

// public members
var curColor;

var drawingApp = (function () {

    "use strict";

    var canvas,
		context,
		clickX = [],
		clickY = [],
        colorRed = "#ff0000",
        colorGreen = "#00ff00",
        colorBlue = "#0000ff",
        clickColor = new Array(),
        clickDrag = [],
		paint = false;

    curColor = colorRed;

    // Redraws the canvas.
    function redraw() {

        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            }
            else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = clickColor[i];
            context.stroke();
        }
    };

    // Adds a point to the drawing array.
    // @param x
    // @param y
    // @param dragging
    function addClick(x, y, dragging) {

        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickColor.push(curColor);
    };

    // Add mouse and touch event listeners to the canvas
    function createUserEvents() {

        // Add resize event handler to window.
        window.addEventListener("resize", resized, false);

        // Add mouse event listeners to canvas element
        canvas.addEventListener("mousedown", press, false);
        canvas.addEventListener("mousemove", drag, false);
        canvas.addEventListener("mouseup", release);
        canvas.addEventListener("mouseout", cancel, false);

        // Add touch event listeners to canvas element
        canvas.addEventListener("touchstart", press, false);
        canvas.addEventListener("touchmove", drag, false);
        canvas.addEventListener("touchend", release, false);
        canvas.addEventListener("touchcancel", cancel, false);
    };

    // Event Handlers
    function press(e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    };

    function drag(e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    };

    function release(e) {
        paint = false;
    };

    function cancel(e) {
        paint = false;
    };

    function resized() {
        canvas.setAttribute('width', window.innerWidth - 20 + "px");
        canvas.setAttribute('height', window.innerHeight - 20 + "px");
        redraw();
    };

    function setColorRed() {
        curColor = colorRed;
        redraw();
    };

    function setColorGreen() {
        curColor = colorGreen;
        redraw();
    };

    function setColorBlue() {
        curColor = colorBlue;
        redraw();
    };

    // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
    function init() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        createUserEvents();
        resized();
    };

    return {
        init: init,
        setColorRed: setColorRed,
        setColorGreen: setColorGreen,
        setColorBlue: setColorBlue
    };
}());

