
function WorkSpace() {
  this.workSpace = document.querySelector("main.work-space");

  this.toolPanel = document.querySelector("aside.tool-panel");

  
  this.currentDoc = null; // An instance of SVG.Doc, as returned by SVG.js.

  this.artboardIsVisible = false;

  this.svgCurrentPosX = 0;
  this.svgCurrentPosY = 0;

  this.init();
}

WorkSpace.prototype.init = function() {
  var self = this;

  document.addEventListener("mousedown", function(e) {
    if(self.currentDoc) {
      var mouseStartX = e.clientX;
      var mouseStartY = e.clientY;

      var svgStartPosX = self.currentDoc.node.getBoundingClientRect().left;
      var svgStartPosY = self.currentDoc.node.getBoundingClientRect().top;

      window.evtMouseMove = function(e) {
        var mouseNewX = e.clientX;
        var mouseNewY = e.clientY;

        var dragDistanceX = (mouseNewX - mouseStartX);
        var dragDistanceY = (mouseNewY - mouseStartY);

        self.svgCurrentPosX = (svgStartPosX + dragDistanceX) - self.workSpace.offsetLeft;
        self.svgCurrentPosY = (svgStartPosY + dragDistanceY) - self.workSpace.offsetTop;

        // Set new position relative to top left of WORKSPACE.
        self.currentDoc.node.style.left = self.svgCurrentPosX + "px";
        self.currentDoc.node.style.top  = self.svgCurrentPosY + "px";
      };

      // If started with a left-click, begin tracking mouse movements.
      if(e.button == 0) {
        document.addEventListener("mousemove", window.evtMouseMove);
        self.workSpace.classList.add("grabbing");
      }
    }
  });

  document.addEventListener("mouseup", function(e) {
    document.removeEventListener("mousemove", window.evtMouseMove);
    self.workSpace.classList.remove("grabbing");
  });
}

// load()
// Load takes a File object, as obtained from a file input's change event.
// the File objects type property must be "image/svg+xml". Creates
// a new instance of an SVG document (this.currentDoc) if all goes well.

WorkSpace.prototype.load = function(file) {
  var self = this;

  if(file.type == "image/svg+xml") {
    var fileReader = new FileReader();

    fileReader.addEventListener("load", function(e) {
      self.workSpace.innerHTML = e.target.result;

      self.currentDoc = SVG(document.querySelector(".work-space > svg"));

      // TODO: Figure out how best to set height. We can set:
      // - width/height attributes
      // - CSS
      // - Viewport
      // which order should we try them in?

      // Get width/height from width & height attributes on svg element:
      //self.currentDoc.size(self.currentDoc.width(), self.currentDoc.height());

      // You can get an instance of SVG.Viewbox like so:
      //self.currentDoc.viewbox();

      // For now, set width & height attributes:
      self.currentDoc.size(500, 500);

      // Center the artwork.
      self.center(self.toolPanel);

      // Loop through all child nodes. Not used for anything just yet,
      // but eventually will populate the layers palette with layers
      // representing the child nodes of the loaded SVG. This is
      // insane that you can even do this. SVG.js is awesome!
      self.currentDoc.each(function(i, children) {
        // console.log(this);
        // console.log(i);
        // console.log(children);
      }, true);
    });

    fileReader.addEventListener("error", function() {
      alert("Sorry, file could not be uploaded for unknown reasons.");
    });

    fileReader.readAsText(file);
  } else {
    alert("File type must be SVG! Please check your file or try a different one.");
  }
};

// center()
// toolPanel is optional. Include it if you want this function
// to take into account the presence of a tool panel and offset
// it's final center value. Produces "optical" centering.
WorkSpace.prototype.center = function(toolPanel) {
  if(this.currentDoc) {
    var viewportHalfWidth  = (document.documentElement.clientWidth / 2);
    var viewportHalfHeight = (document.documentElement.clientHeight / 2);

    var svgHalfWidth = (this.currentDoc.node.getBoundingClientRect().width / 2);
    var svgHalfHeight = (this.currentDoc.node.getBoundingClientRect().height / 2);

    var svgNewPosX = viewportHalfWidth - svgHalfWidth;
    var svgNewPosY = viewportHalfHeight - svgHalfHeight;

    // With the toolpanel taking up ~25% of the screen, we don't
    // really want "center of the viewport". We want "center of the
    // viewport, plus the width of the toolpanel".
    if(toolPanel !== undefined) {
      svgNewPosX += (toolPanel.clientWidth / 2) + (toolPanel.offsetLeft / 2);
    }

    // Set new position relative to top left of WORKSPACE.
    this.currentDoc.node.style.left = svgNewPosX + "px";
    this.currentDoc.node.style.top  = svgNewPosY + "px";
  }
};

// toggleArtboard()
// show/hide artboard behind svg artwork. Artboard is a white square,
// which is really annoying for artwork that only contains white.
// Might be nice to be able change the color of the artboard.
WorkSpace.prototype.toggleArtboard = function() {
  this.artboardIsVisible = !this.artboardIsVisible;
  
  if(this.artboardIsVisible) {
    this.workSpace.classList.add("artboardIsVisible");
  } else {
    this.workSpace.classList.remove("artboardIsVisible");
  }
};