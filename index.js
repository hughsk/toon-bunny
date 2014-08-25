var canvas      = document.body.appendChild(document.createElement('canvas'))
var clear       = require('gl-clear')({ color: [1,1,1,1], depth: true })
var gl          = require('gl-context')(canvas, render)
var perspective = require('gl-mat4/perspective')
var create      = require('gl-mat4/create')
var Geometry    = require('gl-geometry')
var glslify     = require('glslify')
var bunny       = require('bunny')
var camera      = require('canvas-orbit-camera')(canvas)
var normals     = require('normals')

var geo = Geometry(gl)
  .attr('aPosition', bunny.positions)
  .attr('aNormal', normals.vertexNormals(bunny.cells, bunny.positions))
  .faces(bunny.cells)

camera.center[1] = 4

var uProjection = create()
var uModel = create()
var uView = create()

var cel = glslify({
    vert: './cel.vert'
  , frag: './cel.frag'
})(gl)

var outline = glslify({
    vert: './outline.vert'
  , frag: './outline.frag'
})(gl)

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

function render() {
  //
  camera.view(uView)
  camera.tick()
  perspective(uProjection
    , Math.PI / 4
    , canvas.width / canvas.height
    , 0.1
    , 1000
  )

  // Render Setup
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  clear(gl)

  // The important part from here on!
  // This draws the main content, using the front-facing triangles
  // of each face. See "cel.frag" for lighting.
  gl.cullFace(gl.BACK)
  geo.bind(cel)
  cel.uniforms.uProjection = uProjection
  cel.uniforms.uModel = uModel
  cel.uniforms.uView = uView
  geo.draw(gl.TRIANGLES)

  // Now we cull the front-facing triangles and draw backfaces
  // instead. The outline shader pushes the mesh out along its
  // vertex normals and fills each fragment with the outline color.
  // This looks like an outline because front-facing triangles
  // are culled and depth testing prefers the main mesh most of the time.
  gl.cullFace(gl.FRONT)
  geo.bind(outline)
  outline.uniforms.uProjection = uProjection
  outline.uniforms.uModel = uModel
  outline.uniforms.uView = uView
  geo.draw(gl.TRIANGLES)
}
