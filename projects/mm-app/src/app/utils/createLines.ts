import * as THREE from 'three';
import {BufferGeometry} from 'three';
import {curlNoise} from './curlNoise';

const pointsPerFrame = 5000;
const pointsPerLine  = 25;


// whether each line has assigned a quantity of points proportional to its length or a fixed number instead
const useLengthSampling = false;

export function createLines (): any[] {
    const nrings = 32;
    const lines = [];

    for (let j = 0; j < nrings; j++) {
        const color = [0, .003, .009];
        const angle = (j / nrings) * Math.PI / (Math.random() * (4 - 2) + 2);
        const p = new THREE.Vector3(0, 0, 1);
        p.applyAxisAngle(new THREE.Vector3(2, 1, -1), angle);

        const rad = p.y;
        const z   = p.z;

        const trad = 5;
        // const trad = 3.5;

        const nsegments = 70 + Math.abs(Math.floor(rad * 360));
        const noiseSpeed = Math.random();
        for (let i = 0; i < nsegments; i++) {

            const a1 = (i / nsegments) * Math.PI * 2;
            const a2 = ((i + 1) / nsegments) * Math.PI * 2;

            let frad = trad;
            if (Math.random() > 0.92) { frad = (frad + 0.15); }

            const x1 = Math.cos(a1) * rad * frad;
            const y1 = Math.sin(a1) * rad * frad;
            const z1 = z                  * frad;

            const x2 = Math.cos(a2) * rad * frad;
            const y2 = Math.sin(a2) * rad * frad;
            const z2 = z                  * frad;

            const noiseStrength1 =
                0.1 + curlNoise(
                    new THREE.Vector3(x1 * noiseSpeed * 0.3, y1 * noiseSpeed * 0.3, z1 * noiseSpeed * 0.3))
                    .x * 0.7;
            const noiseStrength2 =
                0.1 + curlNoise(
                    new THREE.Vector3(x2 * noiseSpeed * 0.3, y2 * noiseSpeed * 0.3, z2 * noiseSpeed * 0.3))
                    .x * 0.7;
            const v1 =
                curlNoise(new THREE.Vector3(x1 * noiseSpeed, y1 * noiseSpeed, z1 * noiseSpeed))
                    .multiplyScalar(noiseStrength1);
            const v2 =
                curlNoise(new THREE.Vector3(x2 * noiseSpeed, y2 * noiseSpeed, z2 * noiseSpeed))
                    .multiplyScalar(noiseStrength2);

            let colorMult = .1;
            let colorMult2 = 0.1;


            const ldir = new THREE.Vector3(-0.2, -0.35, -0.5);
            ldir.normalize();
            ldir.multiplyScalar(-1);

            const normal = new THREE.Vector3(x1, y1, z1);
            normal.normalize();

            const diffuse1 = Math.pow(Math.max(normal.dot(ldir), 0.0), 3.0);
            const diffuse2 = Math.pow(Math.max(normal.dot(ldir), 0.0), 1.5);
            colorMult *= diffuse1;
            colorMult2 *= diffuse2;
            colorMult += 0.002;
            colorMult2 += 0.002;

            const t = 1;

            if (Math.random() > 0.975) {

                let rc = 2;
                const rd1 = 1 + Math.random() * 0.2;
                const rd2 = rd1 + Math.pow(Math.random(), 2) * 0.2;
                if (Math.random() > 0.8) {
                    rc = 6;
                }

                lines.push({
                    x1: (x1 + v1.x) * rd1,
                    y1: (y1 + v1.y) * rd1,
                    z1: (z1 + v1.z) * rd1,

                    x2: (x1 + v1.x) * rd2,
                    y2: (y1 + v1.y) * rd2,
                    z2: (z1 + v1.z) * rd2,

                    c1r: rc * colorMult2,
                    c1g: rc * colorMult2,
                    c1b: rc * colorMult2,

                    c2r: rc * colorMult2,
                    c2g: rc * colorMult2,
                    c2b: rc * colorMult2,
                    weight: 30,
                });
            } else {
                lines.push({
                    x1: x1 + v1.x,
                    y1: y1 + v1.y,
                    z1: z1 + v1.z,

                    x2: x2 + v2.x,
                    y2: y2 + v2.y,
                    z2: z2 + v2.z,

                    c1r: colorMult + color[0],
                    c1g: colorMult * t + color[1],
                    c1b: colorMult * t + color[2],

                    c2r: colorMult + color[0],
                    c2g: colorMult * t + color[0],
                    c2b: colorMult * t + color[0],
                });
            }

        }
    }
    return lines;
}

export function createLinesGeometry (lines: string | any[]): BufferGeometry {

    const geometry = new THREE.BufferGeometry();
    const position1 = [];
    const position2 = [];
    const color1 = [];
    const color2 = [];
    const seed = [];


    let accumulatedLinesLength = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const lx1 = line.x1;
        const ly1 = line.y1;
        const lz1 = line.z1;

        const lx2 = line.x2;
        const ly2 = line.y2;
        const lz2 = line.z2;

        const weight = line.weight || 1;

        const dx = lx1 - lx2;
        const dy = ly1 - ly2;
        const dz = lz1 - lz2;
        const lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz) * weight;

        accumulatedLinesLength += lineLength;
    }
    const pointsPerUnit = pointsPerFrame / accumulatedLinesLength;

    for (let j = 0; j < lines.length; j++) {

        const line = lines[j];

        const lx1 = line.x1;
        const ly1 = line.y1;
        const lz1 = line.z1;

        const lx2 = line.x2;
        const ly2 = line.y2;
        const lz2 = line.z2;

        const weight = line.weight || 1;


        // how many points per line?
        let points = pointsPerLine;
        let invPointsPerLine = 1 / points;

        if (useLengthSampling) {
            const dx = lx1 - lx2;
            const dy = ly1 - ly2;
            const dz = lz1 - lz2;
            const lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

            points = Math.max(  Math.floor(pointsPerUnit * lineLength * weight), 1  );
            invPointsPerLine = 1 / points;
        }
        const color = new THREE.Color();
        for (let ppr = 0; ppr < points; ppr++) {
            position1.push(lx1, ly1, lz1);
            position2.push(lx2, ly2, lz2);
            color.setHSL(line.c1r * invPointsPerLine, line.c1g * invPointsPerLine, line.c1b * invPointsPerLine);
            color1.push(line.c1r * invPointsPerLine, line.c1g * invPointsPerLine, line.c1b * invPointsPerLine);
            color2.push(line.c2r * invPointsPerLine, line.c2g * invPointsPerLine, line.c2b * invPointsPerLine);

            seed.push(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);
        }
    }

    geometry.setAttribute( 'position',  new THREE.Float32BufferAttribute( new Float32Array(position1), 3 ) );
    geometry.setAttribute( 'position1', new THREE.Float32BufferAttribute( new Float32Array(position2), 3 ) );
    geometry.setAttribute( 'color1',    new THREE.Float32BufferAttribute( new Float32Array(color1), 3 ) );
    geometry.setAttribute( 'color2',    new THREE.Float32BufferAttribute( new Float32Array(color2), 3 ) );
    geometry.setAttribute( 'aSeed',     new THREE.Float32BufferAttribute( new Float32Array(seed), 4 ) );

    return geometry;
}
