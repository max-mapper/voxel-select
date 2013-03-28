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

Selector.prototype.set = function(start, end) {
  var THREE = this.game.THREE
  start[1]++
  end[1]++
  this.game.addMarker({x: start[0], y: start[1], z: start[2]})
  this.game.addMarker({x: end[0], y: end[1], z: end[2]})
  var w = end[0] >= start[0] ? end[0] - start[0] : start[0] - end[0]
  var h = end[1] >= start[1] ? end[1] - start[1] : start[1] - end[1]
  var d = end[2] >= start[2] ? end[2] - start[2] : start[2] - end[2]
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

Selector.prototype.reset = function() {
  this.game.scene.remove(this.mesh)
  this.mesh = undefined
}
