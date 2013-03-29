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
  if (typeof visible === 'undefined') visible = true
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

Selector.prototype.dimensions = function(s, e) {
  if (!s) s = this.start
  if (!e) e = this.end
  // var w = e[0] >= s[0] ? e[0] - s[0] : s[0] - e[0]
  // var h = e[1] >= s[1] ? e[1] - s[1] : s[1] - e[1]
  // var d = e[2] >= s[2] ? e[2] - s[2] : s[2] - e[2]
  var w = e[0] - s[0]
  var h = e[1] - s[1]
  var d = e[2] - s[2]
  return [w, h, d]
}

Selector.prototype.transform = function(func) {
  var s = this.start
  var e = this.end
  var l = [], h = []
  if (s[0] < e[0]) l[0] = s[0], h[0] = e[0]
  else l[0] = e[0], h[0] = s[0]
  if (s[1] < e[1]) l[1] = s[1], h[1] = e[1]
  else l[1] = e[1], h[1] = s[1]
  if (s[2] < e[2]) l[2] = s[2], h[2] = e[2]
  else l[2] = e[2], h[2] = s[2]
  var n = 0
  for(var z = l[2]; z < h[2]; ++z)
    for(var y = l[1]; y < h[1]; ++y)
      for(var x = l[0]; x < h[0]; ++x, ++n) func(x, y, z, n)
}

Selector.prototype.selection = function() {
  var d = this.dimensions()
  var v = new Int8Array(d[0] * d[1] * d[2])
  this.transform(function(x, y, z, n) {
    v[n] = this.game.getBlock(x, y, z)
  })
  return {voxels: v, dimensions: d, start: this.start}
}

Selector.prototype.reset = function() {
  this.start = false
  this.end = false
  if (this.mesh) {
    this.game.scene.remove(this.mesh)
    this.mesh = undefined
  }
}
