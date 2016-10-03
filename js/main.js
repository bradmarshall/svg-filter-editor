
document.addEventListener("DOMContentLoaded", function() {
  //var svg = document.querySelector("svg");
  var toolPanel = document.querySelector("aside.tool-panel");
  var workSpace = document.querySelector("main.work-space");

  var graphic = null;
  var parsedSVG = null;

  var artboardIsVisible = false;

  var svgCurrentPosX = 0;
  var svgCurrentPosY = 0;

  document.addEventListener("mousedown", function(e) {
    if(graphic) {
      var mouseStartX = e.clientX;
      var mouseStartY = e.clientY;

      var svgStartPosX = graphic.getBoundingClientRect().left;
      var svgStartPosY = graphic.getBoundingClientRect().top;

      window.evtMouseMove = function(e) {
        var mouseNewX = e.clientX;
        var mouseNewY = e.clientY;

        var dragDistanceX = (mouseNewX - mouseStartX);
        var dragDistanceY = (mouseNewY - mouseStartY);

        svgCurrentPosX = (svgStartPosX + dragDistanceX) - workSpace.offsetLeft;
        svgCurrentPosY = (svgStartPosY + dragDistanceY) - workSpace.offsetTop;

        // Set new position relative to top left of WORKSPACE.
        graphic.style.left = svgCurrentPosX + "px";
        graphic.style.top  = svgCurrentPosY + "px";
      };

      // If started with a left-click, begin tracking mouse movements.
      if(e.button == 0) {
        document.addEventListener("mousemove", window.evtMouseMove);
        workSpace.classList.add("grabbing");
      }
    }
  });

  document.addEventListener("mouseup", function(e) {
    document.removeEventListener("mousemove", window.evtMouseMove);
    workSpace.classList.remove("grabbing");
  });

  toolPanel.addEventListener("mousedown", function(e) {
    // block mousedowns from bubbling up to workspace element.
    e.stopPropagation();
  });


  // centerSVG():
  // toolPanelElem is optional. Include it if you want this function
  // to take into account the presence of a tool panel and offset
  // it's final center value. Produces "optical" centering.

  function centerSVG(svgElem, toolPanelElem) {
    var viewportHalfWidth  = (document.documentElement.clientWidth / 2);
    var viewportHalfHeight = (document.documentElement.clientHeight / 2);

    var svgHalfWidth = (svgElem.clientWidth / 2);
    var svgHalfHeight = (svgElem.clientHeight / 2);

    var svgNewPosX = viewportHalfWidth - svgHalfWidth;
    var svgNewPosY = viewportHalfHeight - svgHalfHeight;

    // With the toolpanel taking up ~25% of the screen, we don't
    // really want "center of the viewport". We want "center of the
    // viewport, plus the width of the toolpanel".
    if(toolPanelElem !== undefined) {
      svgNewPosX += (toolPanelElem.clientWidth / 2) + (toolPanelElem.offsetLeft / 2);
    }

    // Set new position relative to top left of WORKSPACE.
    svgElem.style.left = svgNewPosX + "px";
    svgElem.style.top  = svgNewPosY + "px";
  }

  // Load a new SVG document.
  function load(id) {
    // TODO: jam the svg-loading in here when we refactor this mess.
  }

  function processFilters() {
    alert("does nothing at the moment... soon!");
  }

  function toggleArtboard() {
    artboardIsVisible = !artboardIsVisible;
    
    if(artboardIsVisible) {
      workSpace.classList.add("artboardIsVisible");
      btnToggleArtboard.textContent = "Hide";
    } else {
      workSpace.classList.remove("artboardIsVisible");
      btnToggleArtboard.textContent = "Show";
    }
  }

  // ------------------------------------------ [ ToolPanel Controls ]

  var btnCenterSVG = document.querySelector("#center-svg");
  btnCenterSVG.addEventListener("click", function() {
    centerSVG(graphic, toolPanel);
  });


  var btnProcessFilters = document.querySelector("#process-filters");
  btnProcessFilters.addEventListener("click", function() {
    processFilters();
  });

  var btnToggleArtboard = document.querySelector("#toggle-artboard");
  btnToggleArtboard.addEventListener("click", function() {
    toggleArtboard();
  });


  var fileUploadControl = document.querySelector("#file-upload-control");
  var inputFileUpload   = document.querySelector("#file-input");

  if(inputFileUpload) {
    inputFileUpload.addEventListener("change", function(e) {
      if(this.files.length) {
        var file = this.files[0];

        if(file.type == "image/svg+xml") {
          var fileReader = new FileReader();

          fileReader.addEventListener("load", function() {
            workSpace.innerHTML = this.result;
            graphic = document.querySelector(".work-space > svg");

            parsedSVG = SVG(graphic);
            parsedSVG.size(500, 500);

            centerSVG(graphic, toolPanel);
          });

          fileReader.addEventListener("error", function() {
            alert("Sorry, file could not be uploaded for unknown reasons.");
          });

          fileReader.readAsText(file);
        } else {
          alert("File type must be SVG! Please check your file or try a different one.");
        }
      }
    });
  }

  if(fileUploadControl) {
    fileUploadControl.addEventListener("click", function() {
      if(inputFileUpload) {
        inputFileUpload.click();
      }
    });
  }
});