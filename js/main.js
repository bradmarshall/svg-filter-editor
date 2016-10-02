
document.addEventListener("DOMContentLoaded", function() {
  var svg = document.querySelector("svg");
  var toolPanel = document.querySelector("aside.tool-panel");
  var workSpace = document.querySelector("main.work-space");

  var graphic = null;

  var artboardIsVisible = false;

  centerSVG(svg, toolPanel); // Start with a centered SVG.
  load("blinky");

  var svgCurrentPosX = 0;
  var svgCurrentPosY = 0;

  document.addEventListener("mousedown", function(e) {
    var mouseStartX = e.clientX;
    var mouseStartY = e.clientY;

    var svgStartPosX = svg.getBoundingClientRect().left;
    var svgStartPosY = svg.getBoundingClientRect().top;

    window.evtMouseMove = function(e) {
      var mouseNewX = e.clientX;
      var mouseNewY = e.clientY;

      var dragDistanceX = (mouseNewX - mouseStartX);
      var dragDistanceY = (mouseNewY - mouseStartY);

      svgCurrentPosX = (svgStartPosX + dragDistanceX) - workSpace.offsetLeft;
      svgCurrentPosY = (svgStartPosY + dragDistanceY) - workSpace.offsetTop;

      // Set new position relative to top left of WORKSPACE.
      svg.style.left = svgCurrentPosX + "px";
      svg.style.top  = svgCurrentPosY + "px";
    };

    // If started with a left-click, begin tracking mouse movements.
    if(e.button == 0) {
      document.addEventListener("mousemove", window.evtMouseMove);
      workSpace.classList.add("grabbing");
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
    graphic = SVG(id);
    console.log(graphic);    
  }

  function processFilters() {
    alert("does nothing at the moment... soon!");
  }

  function toggleArtboard() {
    artboardIsVisible = !artboardIsVisible;
    
    if(artboardIsVisible) {
      graphic.addClass("artboardIsVisible");
      btnToggleArtboard.textContent = "Hide";
    } else {
      graphic.removeClass("artboardIsVisible");
      btnToggleArtboard.textContent = "Show";
    }
  }

  // ------------------------------------------ [ ToolPanel Controls ]

  var btnCenterSVG = document.querySelector("#centerSVG");
  btnCenterSVG.addEventListener("click", function() {
    centerSVG(svg, toolPanel);
  });


  var btnProcessFilters = document.querySelector("#processFilters");
  btnProcessFilters.addEventListener("click", function() {
    processFilters();
  });

  var btnToggleArtboard = document.querySelector("#toggleArtboard");
  btnToggleArtboard.addEventListener("click", function() {
    toggleArtboard();
  });
});