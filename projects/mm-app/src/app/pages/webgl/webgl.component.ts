import {Component, ElementRef, NgZone, OnInit, Renderer2} from '@angular/core';
import { clamp, throttle } from 'lodash';
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
import { linef, linev } from '../../utils/shaders/line';
import {postprocf, postprocv } from '../../utils/shaders/postproc';

export const SIZES = {
    width: window.innerWidth,
    height: window.innerHeight,
};

@Component({
    selector: 'mm-webgl',
    templateUrl: './webgl.component.html',
    styleUrls: ['./webgl.component.scss'],
})
export class WebglComponent implements OnInit {
    cameraFocalDistance = 49.19;
    cameraFocalDistanceMin = 40.8;
    cameraFocalDistanceMax = 60.55;
    bokehStrength = 0.06;
    samples = 1;
    exposure = 0.0013;
    rotationCoef = 0.016;

    dirVec = new Vector3(2, 2, 10).normalize().multiplyScalar(50);

    renderer = new WebGLRenderer({
        alpha: true,
    });
    scene: Scene = new Scene();
    postProcScene: Scene = new Scene();
    camera = new PerspectiveCamera(20, SIZES.width / SIZES.height, 2, 200);
    postProcCamera = new PerspectiveCamera(20, SIZES.width / SIZES.height, 2, 200);
    controls = new OrbitControls(this.camera, this.renderer.domElement);
    clock = new Clock();

    lines = createLines();
    linesGeometry = createLinesGeometry(this.lines);

    linesMaterial = new ShaderMaterial({
        vertexShader: linev,
        fragmentShader: linef,
        uniforms: {
            uTime: { value: 0 },
            uRandom: { value: 0 },
            uRandomVec4: new Uniform(new Vector4(0, 0, 0, 0)),
            uFocalDepth: { value: this.cameraFocalDistance },
            uBokehStrength: { value: this.bokehStrength },
            uMinimumLineSize: { value: 0.015 },
        },
        side:           DoubleSide,
        depthTest:      false,

        blending:      CustomBlending,
        blendEquation: AddEquation,
        blendSrc:      OneFactor,
        blendSrcAlpha: OneFactor,
        blendDst:      OneFactor,
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
            // @ts-ignore
            textureOffRT: { type: 't', value: this.offscreenRT.texture },
            uSamples: { value: this.samples },
            uExposure: { value: this.exposure },
            uBackgroundColor: new Uniform(new Vector3(21 / 255, 16 / 255, 16 / 255)),
        },
        side: DoubleSide,
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
    }

    ngOnInit (): void {
        this.renderer2.appendChild(this.el.nativeElement, this.renderer.domElement);
        this.linesMesh.rotation.x = .2;
        this.postProcMesh.rotation.x = .2;

        this.zone.runOutsideAngular(() => {
            this.renderer.domElement.addEventListener('wheel', throttle((e: HTMLElementEventMap['wheel']) => {
                this.cameraFocalDistance -= 0.3 * Math.sign(e.deltaY);
                this.cameraFocalDistance = clamp(
                    this.cameraFocalDistance,
                    this.cameraFocalDistanceMin,
                    this.cameraFocalDistanceMax,
                );

            }, 100));
            this._render();
        });
    }

    private _render (now= 0): void {
        if (now % 2 < 1) {
            this._resetCanvas();
        }
        window.requestAnimationFrame(this._render.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

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

}
