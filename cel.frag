precision mediump float;

varying vec3 vNormal;

void main() {
  // This is *the* simplest technique you could use for
  // cel-shaded lighting. Another popular technique would
  // be to use a lookup texture containing a gradient and
  // using that for the luminance of the fragment.
  float luma = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
  vec3 color = luma <= 0.0
    ? vec3(0.3, 0.32, 0.4)
    : vec3(0.9, 0.95, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
