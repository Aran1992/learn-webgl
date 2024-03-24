async function loadText(url) {
    const res = await fetch(url);
    return await res.text();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function setRectangle(gl, x, y, width, height) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y,
        x + width, y,
        x + width, y + height,
        x, y,
        x + width, y + height,
        x, y + height,
    ]), gl.STATIC_DRAW);
}

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

async function main() {
    const vertexShaderSource = await loadText("vertex.glsl");
    const fragmentShaderSource = await loadText("fragment.glsl");

    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl2");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        0, 0,
        666, 0,
        0, 233,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 255);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    for (let i = 0; i < 1; i++) {
        setRectangle(
            gl,
            100,
            100,
            1000,
            1000,
        );

        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

main();
