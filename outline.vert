precision mediump float;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

attribute vec3 aPosition;
attribute vec3 aNormal;

#define OUTLINE_AMOUNT 0.09

// The outline mesh is drawn by moving vertices
// along their normals, multiplied by a specific
// amount. The back face is drawn instead of the
// front in this case, which is what achieves the
// outline-like look.
void main() {
  gl_Position = (
      uProjection
    * uView
    * uModel
    * vec4(aPosition + normalize(aNormal) * OUTLINE_AMOUNT, 1.0)
  );
}
