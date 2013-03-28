var inherits = require('inherits')
var events = require('events')

module.exports = function(game, opts) {
  return new Selector(game, opts)
}

function Selector(game, opts) {
  if (!opts) opts = {}
  this.opts = opts
  this.game = game
}

inherits(Selector, events.EventEmitter)

Selector.prototype.set = function(start, end, visible) {
  if (!visible) visible = true
  var THREE = this.game.THREE
  // draw box up 1 voxel
  start[1]++
  end[1]++
  this.start = start
  this.end = end
  var dimensions = this.dimensions(start, end)
  var w = dimensions[0]
  var h = dimensions[1]
  var d = dimensions[2]

  if (visible) {
    this.game.addMarker({x: start[0], y: start[1], z: start[2]})
    this.game.addMarker({x: end[0], y: end[1], z: end[2]})
    var cube = new THREE.CubeGeometry(w, h, d)
    var material = new game.THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true,
      wireframeLinewidth: 2
    })
    this.mesh = new THREE.Mesh( cube, material )
    var startV = new THREE.Vector3(start[0], start[1], start[2])
    var endV = new THREE.Vector3(end[0], end[1], end[2])
    this.mesh.position.copy(startV.lerp(endV, 0.5))
    this.game.scene.add(this.mesh)
  }
}

Selector.prototype.dimensions = function(start, end) {
  if (!start) start = this.start
  if (!end) end = this.end
  var w = end[0] >= start[0] ? end[0] - start[0] : start[0] - end[0]
  var h = end[1] >= start[1] ? end[1] - start[1] : start[1] - end[1]
  var d = end[2] >= start[2] ? end[2] - start[2] : start[2] - end[2]
  return [w, h, d]
}

Selector.prototype.transform = function(func) {
  var l = this.start
  var h = this.end
  var n = 0
  for(var z=l[2]; z<h[2]; ++z)
    for(var y=l[1]; y<h[1]; ++y)
      for(var x=l[0]; x<h[0]; ++x, ++n)
        func(x, y, z, n)
}

Selector.prototype.selection = function() {
  var d = this.dimensions()
  var v = new Int8Array(d[0]*d[1]*d[2])
  this.transform(function(x, y, z, n) {
    v[n] = this.game.getBlock(x, y, z)
  })
  return {voxels:v, dimensions:d, start: this.start}
}

Selector.prototype.reset = function() {
  this.start = false
  this.end = false
  if (this.mesh) {
    this.game.scene.remove(this.mesh)
    this.mesh = undefined
  }
}
