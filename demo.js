var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var highlight = require('voxel-highlight')
var createSelect = require('./')
var fly = require('voxel-fly')
var transforms = require('voxel-transforms')
var game = require('voxel-hello-world')({
  generate: function(i,j,k) {
    var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;    
    if(j > h0+1) {
      return 0;
    }
    if(h0 <= j) {
      return 1;
    }
    var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
    if(h1 <= j) {
      return 2;
    }
    if(2 < j) {
      return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
    }
    return 3;
  },
  materials: [
    ['grass', 'dirt', 'grass_dirt'],
    'obsidian',
    'brick',
    'grass',
    'plank',
    'whitewool'
  ],
  chunkDistance: 4,
  texturePath: textures,
  playerSkin: textures + 'player.png'
}, setup)

var makeFly = fly(game)
makeFly(game.controls.target())

function setup(game, avatar) {
  avatar.position.copy({x: 9, y: 30, z: 19})

  var select = createSelect(game)
  window.sel = select

  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0x000000, distance: 100 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })
  hl.on('highlight-deselect', function(pos) {
    select.reset()
    select.set(pos.start, pos.end, true)
    var bounds = select.bounds()
    switch (dropdown.value) {
      case 'overlay': return select.transform(transforms.overlay(6))
      case 'walls': return transforms.walls(game, bounds[0], bounds[1], 3)
      case 'erase': return select.transform(transforms.erase)
      case 'nothing': return
    }
  })

  var shiftDown = false

  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 16) shiftDown = true
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
  })

  window.addEventListener('keyup', function (ev) {
    if (ev.keyCode === 16) shiftDown = false
  })
  
  var dropdown = document.querySelector('select')
  
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
