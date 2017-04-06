
"use strict";

document.addEventListener("DOMContentLoaded", function() {
  var workSpace = new WorkSpace();
  var toolPanel = new ToolPanel();

  // TODO: Check if the browser supports SVG.
  if(!SVG.supported) {
    // toss up an error dialog, maybe short-circuit the loading of the app.
  }

  // ------------------------------------------ [ ToolPanel Controls ]

  var btnCenterSVG = document.querySelector("#center-svg");
  btnCenterSVG.addEventListener("click", function() {
    workSpace.center(toolPanel.toolPanel);
  });

  var btnProcessFilters = document.querySelector("#process-filters");
  btnProcessFilters.addEventListener("click", function() {
    processFilters();
  });

  var btnToggleArtboard = document.querySelector("#toggle-artboard");
  btnToggleArtboard.addEventListener("click", function() {
    toggleArtboard();
  });

  // File Upload.
  var inputFileUpload   = document.querySelector("#file-input");
  var fileUploadControl = document.querySelector("#file-upload-control");

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

  // ----------------------------- [ Handlers for ToolPanel Controls ]

  function processFilters() {
    console.log("processing filters...");

    if(workSpace.currentDoc) {
      workSpace.currentDoc.filter(function(filterElement) {
        var hueRotate = filterElement.colorMatrix('hueRotate', 180);

        // Add filter to entire SVG element. At some point I want to
        // let the user choose which layer/node to apply a filter to
        // but this should get us started playing around with filters
        // at least.
        workSpace.currentDoc.attr("filter", "url(#" + filterElement.attr("id") + ")");
      });      
    }
  }

  function toggleArtboard() {
    workSpace.toggleArtboard();
    
    if(workSpace.artboardIsVisible) {
      btnToggleArtboard.textContent = "Hide";
    } else {
      btnToggleArtboard.textContent = "Show";
    }
  }
});