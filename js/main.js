
document.addEventListener("DOMContentLoaded", function() {
  var workSpace = new WorkSpace();

  // TODO: Check if the browser supports SVG.
  if(!SVG.supported) {
    // toss up an error dialog, maybe short-circuit the loading of the app.
  }

  var toolPanel = document.querySelector("aside.tool-panel");

  toolPanel.addEventListener("mousedown", function(e) {
    // block mousedowns from bubbling up to workspace element.
    e.stopPropagation();
  });

  function processFilters() {
    alert("does nothing at the moment... soon!");
  }

  function toggleArtboard() {
    workSpace.toggleArtboard();
    
    if(workSpace.artboardIsVisible) {
      btnToggleArtboard.textContent = "Hide";
    } else {
      btnToggleArtboard.textContent = "Show";
    }
  }

  // ------------------------------------------ [ ToolPanel Controls ]

  var btnCenterSVG = document.querySelector("#center-svg");
  btnCenterSVG.addEventListener("click", function() {
    workSpace.center(toolPanel);
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
        workSpace.load(file);
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