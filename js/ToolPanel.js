
function ToolPanel() {
  this.toolPanel = null;

  // Layer Stuff...
  this.layerPalette = null;
  this.selectedLayers = [];
  this.layers = null;
  this.notRenderableInLayerPalette = [];

  this.init();
}

ToolPanel.prototype.init = function() {
  this.toolPanel = document.querySelector("aside.tool-panel");

  this.layerPalette = this.toolPanel.querySelector("section.layer-palette");
  this.layers = this.layerPalette.querySelector("ul.layers");
  this.notRenderableInLayerPalette = ["title","description","svg"];

  this.toolPanel.addEventListener("mousedown", function(e) {
    // block mousedowns from bubbling up to workspace element.
    e.stopPropagation();
  });
};

ToolPanel.prototype.addLayer = function() {
  // does nothing.
};

ToolPanel.prototype.removeLayer = function() {
  // does nothing.
};

ToolPanel.prototype.selectLayer = function() {
  // does nothing.
};