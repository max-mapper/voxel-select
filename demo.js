var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var highlight = require('voxel-highlight')
var createSelect = require('./')
var game = require('voxel-hello-world')({
  texturePath: textures,
  playerSkin: textures + 'player.png'
}, setup)

function setup(game, avatar) {
  var select = createSelect(game)
  window.sel = select

  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0x000000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })
  hl.on('highlight-deselect', function(pos) {
    select.set(pos.start, pos.end, false)
  })

  var shiftDown = false

  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 16) shiftDown = true
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
  })

  window.addEventListener('keyup', function (ev) {
    if (ev.keyCode === 16) shiftDown = false
  })
  
  game.on('fire', function (target, state) {
    var select = game.controls.state.select
    if (shiftDown && select) return game.controls.state.select = false
    if (shiftDown && !select) return game.controls.state.select = true
    
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, 1)
    } else {
      position = blockPosErase
      if (position) game.setBlock(position, 0)
    }
  })
}
