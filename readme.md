# voxel-select

work in progress -- not done yet

select a cube shaped group/region of voxels in game. useful for exporting parts of a world, etc

```js
npm install voxel-select
```

## example

```js
var createSelector = require('voxel-select')

var selector = createSelector(game)

select.set(start, end) // bounding box positions
```

## api

### require('voxel-selector')

returns an initialization function that you must pass your game object into in order to get a selector instance

### selector.set(start, end)

more docs soon

## license

BSD