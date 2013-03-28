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
  var d = end[0] >= start[0] ? end[0] - start[0] : start[0] - end[0]
  var h = end[1] >= start[1] ? end[1] - start[1] : start[1] - end[1]
  var w = end[2] >= start[2] ? end[2] - start[2] : start[2] - end[2]
  var cube = new THREE.CubeGeometry(w, h, d)
  var material = new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } )
  var geometry = this.geoToLine(cube)
  this.mesh = new THREE.Line( geometry, material, THREE.LinePieces )
  this.mesh.position.copy({x: end[0], y: end[1], z: end[2]})
  this.game.scene.add(this.mesh)
}

Selector.prototype.reset = function() {
  this.game.scene.remove(this.mesh)
  this.mesh = undefined
}

Selector.prototype.geoToLine = function( geo ) {
  var THREE = this.game.THREE
  var geometry = new THREE.Geometry()
  var vertices = geometry.vertices
  
  for ( i = 0; i < geo.faces.length; i++ ) {

    var face = geo.faces[ i ]

    if ( face instanceof THREE.Face3 ) {

      vertices.push( geo.vertices[ face.a ].clone() )
      vertices.push( geo.vertices[ face.b ].clone() )
      vertices.push( geo.vertices[ face.b ].clone() )
      vertices.push( geo.vertices[ face.c ].clone() )
      vertices.push( geo.vertices[ face.c ].clone() )
      vertices.push( geo.vertices[ face.a ].clone() )

    } else if ( face instanceof THREE.Face4 ) {

      vertices.push( geo.vertices[ face.a ].clone() )
      vertices.push( geo.vertices[ face.b ].clone() )
      vertices.push( geo.vertices[ face.b ].clone() )
      vertices.push( geo.vertices[ face.c ].clone() )
      vertices.push( geo.vertices[ face.c ].clone() )
      vertices.push( geo.vertices[ face.d ].clone() )
      vertices.push( geo.vertices[ face.d ].clone() )
      vertices.push( geo.vertices[ face.a ].clone() )

    }

  }

  geometry.computeLineDistances()

  return geometry

}