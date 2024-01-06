import {ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, Renderer2} from '@angular/core';
import gsap from 'gsap';
import { clamp, throttle } from 'lodash-es';
import {
    AddEquation, Clock,
    Color,
    CustomBlending,
    DoubleSide, FloatType, Mesh,
    OneFactor, PerspectiveCamera, PlaneGeometry, Points,
    Scene,
    ShaderMaterial,
    Uniform, Vector3,
    Vector4,
    WebGLRenderer, WebGLRenderTarget,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {createLines, createLinesGeometry} from '../../utils/createLines';
import linef from '../../utils/shaders/linef.glsl';
import linev from '../../utils/shaders/linev.glsl';
import postprocf from '../../utils/shaders/postprocf.glsl';
import postprocv from '../../utils/shaders/postprocv.glsl';

export const SIZES = {
    width: window.innerWidth,
    height: window.innerHeight,
};

@Component({
    selector: 'mm-webgl',
    templateUrl: './webgl.component.html',
    styleUrls: ['./webgl.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebglComponent implements OnInit {
    cameraFocalDistance = 49.19;
    cameraFocalDistanceMin = 40.8;
    cameraFocalDistanceMax = 60.55;
    bokehStrength = 0.06;
    samples = 1;
    exposure = 0.0012;
    rotationCoef = 0.016;
    prevFrameTime = 0;

    mouse = {x: 0, y: 0};

    dirVec = new Vector3(2, 2, 10).normalize().multiplyScalar(50);
    renderer = new WebGLRenderer({
    });
    scene: Scene = new Scene();
    postProcScene: Scene = new Scene();
    camera = new PerspectiveCamera(23, SIZES.width / SIZES.height, 2, 200);
    postProcCamera = new PerspectiveCamera(23, SIZES.width / SIZES.height, 2, 200);
    controls = new OrbitControls(this.camera, this.renderer.domElement);
    clock = new Clock();

    lines = createLines();
    linesGeometry = createLinesGeometry(this.lines);

    linesMaterial = new ShaderMaterial({
        vertexShader: linev,
        fragmentShader: linef,
        uniforms: {
            uTime: { value: 0 },
            uRandom: { value: 3 },
            uRandomVec4: new Uniform(new Vector4(0, 0, 0, 0)),
            uFocalDepth: { value: this.cameraFocalDistance },
            uBokehStrength: { value: this.bokehStrength },
            uMinimumLineSize: { value: 0.015 },
        },
        side: DoubleSide,
        depthTest: false,
        blending: CustomBlending,
        blendEquation: AddEquation,
        blendSrc: OneFactor,
        blendSrcAlpha: OneFactor,
        blendDst: OneFactor,
        blendDstAlpha: OneFactor,
    });
    linesMesh = new Points(this.linesGeometry, this.linesMaterial);

    offscreenRT = new WebGLRenderTarget(SIZES.width, SIZES.height, {
        stencilBuffer: false,
        depthBuffer: false,
        type: FloatType,
    });

    postProcQuadGeo = new PlaneGeometry(2, 2);
    postProcQuadMaterial = new ShaderMaterial({
        vertexShader: postprocv,
        fragmentShader: postprocf,
        uniforms: {
            textureOffRT: { value: this.offscreenRT.texture },
            uSamples: { value: this.samples },
            uExposure: { value: this.exposure },
            uBackgroundColor: new Uniform(new Vector3(21 / 255, 16 / 255, 16 / 255)),
        },
    });
    postProcMesh = new Mesh(this.postProcQuadGeo, this.postProcQuadMaterial);

    constructor (private el: ElementRef,
                 private zone: NgZone,
                 private renderer2: Renderer2) {
        this.renderer.setSize(SIZES.width, SIZES.height);
        this.renderer.setPixelRatio(window.devicePixelRatio );
        this.renderer.autoClear = false;

        this.scene.add(this.linesMesh);
        this.postProcMesh.frustumCulled = false;
        this.postProcScene.add(this.postProcMesh);

        this.camera.position.set( this.dirVec.x, this.dirVec.y, this.dirVec.z );
        this.postProcCamera.position.set( this.dirVec.x, this.dirVec.y, this.dirVec.z );

        this.controls.rotateSpeed     = .5;
        this.controls.minAzimuthAngle = -Infinity;
        this.controls.maxAzimuthAngle = +Infinity;
        this.controls.minPolarAngle   = 0.85;
        this.controls.maxPolarAngle   = Math.PI - 0.85;
        this.controls.enableZoom = false;

        if (typeof Worker !== 'undefined') {
            // Create a new
            const worker = new Worker(new URL('./webgl.worker', import.meta.url));

            worker.onmessage = ({ data }) => {
               //
            };
            worker.postMessage({lines: this.lines});
        } else {
            // Web workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }
    }

    ngOnInit (): void {
        this.renderer2.appendChild(this.el.nativeElement, this.renderer.domElement);

        this.zone.runOutsideAngular(() => {
            const h1 = document.querySelector('h1');
            const scroll = document.querySelector('.scroll');
            const menu = document.querySelector('.webgl-container__menu');
            const tl = gsap.timeline();
            tl.from(h1, {
                duration: 1.5,
                opacity: .3,
                ease: 'power2in',
                delay: .5,
            }).to(h1, {
                duration: 2.2,
                filter: 'blur(0px)',
                ease: 'power2out',
                delay: .5,
            }, ' -=1.5').from(menu, {
                duration: 1,
                opacity: 0,
                ease: 'power2in',
                delay: 0,
            }, '-=1').from(scroll, {
                duration: 1,
                opacity: 0,
                bottom: 500,
                ease: 'power2in',
                delay: 0,
            }, '-=1.5').from('p', {
                duration: 1,
                opacity: 0,
                ease: 'power4in',
            }, '-=1');
            // this.camera.fov += 1;
            window.addEventListener('resize', () => {
                const sizes = {width: window.innerWidth, height: window.innerHeight};
                this._resetCanvas();
                this.camera.aspect = sizes.width / sizes.height;
                this.camera.updateProjectionMatrix();

                // Update renderer
                this.renderer.setSize(sizes.width, sizes.height);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, {passive: true});

            this.el.nativeElement.addEventListener('wheel', throttle((e: HTMLElementEventMap['wheel']) => {
                this.cameraFocalDistance -= 0.3 * Math.sign(e.deltaY);
                this.cameraFocalDistance = clamp(
                    this.cameraFocalDistance,
                    this.cameraFocalDistanceMin,
                    this.cameraFocalDistanceMax,
                );

                // this.camera.position.z += 1;
                this.camera.fov -= 1 * Math.sign(e.deltaY);
                // if (this.cameraFocalDistance > 50) {
                    // this.linesMesh.visible = false;
                    // this.linesMesh.position.z -= 5;
                    // this.postProcMesh.position.z -= 5;
                    // this.linesMesh.rotation.x += 2;
                    // this.postProcMesh.rotation.x += 2;
                // }
            }, 100), {passive: true});
            this.el.nativeElement.addEventListener('mousemove', throttle((e: HTMLElementEventMap['mousemove']) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }, 100), {passive: true});
            setTimeout(this._render.bind(this), 0);
        });
    }

    private _render (now = 0): void {
        const frameDelta = now - this.prevFrameTime;
        if (frameDelta > 16.7) {
            this._resetCanvas();
            this.prevFrameTime = now;
        }
        window.requestAnimationFrame(this._render.bind(this));

        const elapsedTime = this.clock.getElapsedTime();
        this.linesMesh.rotation.y = 50;
        this.postProcMesh.rotation.y = 50;
        this.linesMesh.rotation.z = (this.rotationCoef * elapsedTime);
        this.postProcMesh.rotation.z = (this.rotationCoef * elapsedTime);
        this.controls.update();

        for (let i = 0; i < 8; i++) {
            this.samples++;
            // @ts-ignore
            this.linesMaterial.uniforms.uBokehStrength.value = this.bokehStrength;
            // @ts-ignore
            this.linesMaterial.uniforms.uFocalDepth.value = this.cameraFocalDistance;
            // @ts-ignore
            this.linesMaterial.uniforms.uRandom.value = Math.random() * 1000;
            // @ts-ignore
            this.linesMaterial.uniforms.uTime.value = (now * 0.001) % 100;
            // @ts-ignore
            this.linesMaterial.uniforms.uRandomVec4.value = new Vector4(
                Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);

            this.renderer.setRenderTarget(this.offscreenRT);
            this.renderer.render(this.scene, this.camera);
        }

        // @ts-ignore
        this.postProcQuadMaterial.uniforms.uSamples.value = this.samples;
        // @ts-ignore
        this.postProcQuadMaterial.uniforms.uExposure.value = this.exposure;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.postProcScene, this.postProcCamera);
    }
    private _resetCanvas (): void {
        this.scene.background = new Color(0x000000);
        this.renderer.setRenderTarget(this.offscreenRT);
        this.renderer.render(this.scene, this.camera);
        this.samples = 0;
        this.scene.background = null;
    }

    private _record (canvas: { captureStream: (arg0: number) => any; }, time: number): Promise<any> {
        const recordedChunks: BlobPart[] | undefined = [];
        return new Promise( res => {
            const stream = canvas.captureStream(25 /*fps*/);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9',
            });

            // ondataavailable will fire in interval of `time || 4000 ms`
            mediaRecorder.start(time || 4000);

            mediaRecorder.ondataavailable =  (event) => {
                recordedChunks.push(event.data);
                // after stop `dataavilable` event run one more time
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }

            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, {type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                res(url);
            };
        });
    }

}
