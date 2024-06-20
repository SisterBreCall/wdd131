export function AddPhoto(imageBitmap) {
    AddPhotoGPU(imageBitmap);
}

const canvas = container.querySelector('canvas');
const context = canvas.getContext('webgpu');

if (!navigator.gpu) {
    console.log("WebGPU is not supported on this browser!");
}

const adapter = await navigator.gpu.requestAdapter();

const device = await adapter.requestDevice();

const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
    device: device,
    format: canvasFormat,
});

async function AddPhotoGPU(imageBitmap) {
    const vertices = new Float32Array([
        -1, -1, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0,

        1, -1, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0,

        1, 1, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0,

        -1, 1, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        0.0, 0.0

    ]);

    const indices = new Uint16Array([
        0, 1, 3, 1, 2, 3
    ]);

    const vertexBuffer = device.createBuffer({
        label: "vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const indexBuffer = device.createBuffer({
        label: "indices",
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    let imageTexture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        format: 'rgba8unorm',
        usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertices);
    device.queue.writeBuffer(indexBuffer, 0, indices);
    device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture: imageTexture },
        [imageBitmap.width, imageBitmap.height]
    );

    const vertexBufferLayout = {
        arrayStride: 40,
        attributes: [{
            format: "float32x4",
            offset: 0,
            shaderLocation: 0
        }, {
            format: "float32x4",
            offset: 16,
            shaderLocation: 1,
        }, {
            format: "float32x2",
            offset: 32,
            shaderLocation: 2
        }]
    };

    const imageSampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
    });

    const shaderModule = device.createShaderModule({
        label: "vertex and fragment shader",
        code: `
        @group(0) @binding(0) var mySampler: sampler;
        @group(0) @binding(1) var myTexture: texture_2d<f32>;
        
        struct VertexIn {
            @location(0) position: vec4<f32>,
            @location(1) color: vec4<f32>,
            @location(2) uv: vec2<f32>,
        };

        struct VertexOut {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
            @location(1) uv: vec2<f32>,
        };

        @vertex
        fn vertex_main(vert: VertexIn) -> VertexOut {
            var out: VertexOut;
            out.color = vert.color;
            out.position = vert.position;
            out.uv = vert.uv;
            return out;
        }

        @fragment
        fn fragment_main(
            in: VertexOut) -> @location(0) vec4<f32> {
            return textureSample(myTexture, mySampler, in.uv);
        }
        `
    });

    const graphicsPipeline = device.createRenderPipeline({
        label: "graphics pipeline",
        layout: "auto",
        vertex: {
            module: shaderModule,
            entryPoint: "vertex_main",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragment_main",
            targets: [{
                format: canvasFormat
            }]
        }
    });


    const uniformBindGroup = device.createBindGroup({
        layout: graphicsPipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: imageSampler,
            },
            {
                binding: 1,
                resource: imageTexture.createView(),
            },
        ],
    });

    const encoder = device.createCommandEncoder();

    const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
            storeOp: "store",
        }]
    });

    renderPass.setPipeline(graphicsPipeline);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setIndexBuffer(indexBuffer, "uint16");
    renderPass.drawIndexed(indices.length, 1, 0, 0, 0);

    renderPass.end();

    device.queue.submit([encoder.finish()]);
}

async function NoPhoto() {
    const vertices = new Float32Array([
        -1, 1, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1, 1, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1, -1, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        -1, -1, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 2, 3, 0
    ]);

    const vertexBuffer = device.createBuffer({
        label: "vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const indexBuffer = device.createBuffer({
        label: "indices",
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertices);
    device.queue.writeBuffer(indexBuffer, 0, indices);

    const vertexBufferLayout = {
        arrayStride: 2 * 4 * 4,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0
        }, {
            format: "float32x4",
            offset: 4 * 4,
            shaderLocation: 1,
        }]
    };

    const shaderModule = device.createShaderModule({
        label: "vertex and fragment shader",
        code: `
        struct VertexIn {
            @location(0) position: vec4<f32>,
            @location(1) color: vec4<f32>,
        };

        struct VertexOut {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
        };

        @vertex
        fn vertex_main(vert: VertexIn) -> VertexOut {
            var out: VertexOut;
            out.color = vert.color;
            out.position = vert.position;
            return out;
        };

        @fragment
        fn fragment_main(in: VertexOut) -> @location(0) vec4<f32> {
            return vec4<f32>(in.color);
        }
        `
    });

    const graphicsPipeline = device.createRenderPipeline({
        label: "graphics pipeline",
        layout: "auto",
        vertex: {
            module: shaderModule,
            entryPoint: "vertex_main",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragment_main",
            targets: [{
                format: canvasFormat
            }]
        }
    });

    const encoder = device.createCommandEncoder();

    const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
            storeOp: "store",
        }]
    });

    renderPass.setPipeline(graphicsPipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setIndexBuffer(indexBuffer, "uint16");
    renderPass.drawIndexed(indices.length, 1, 0, 0, 0);

    renderPass.end();

    device.queue.submit([encoder.finish()]);
}

NoPhoto();