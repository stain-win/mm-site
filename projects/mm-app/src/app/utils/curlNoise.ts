import {createNoise3D} from 'simplex-noise';
import {Vector3} from 'three';

const noise = createNoise3D();
const e = 0.1;
export function noise3 ( px: number, py: number, pz: number): Vector3 {
    const rv = new Vector3();

    const x = noise(px, py, pz);
    const y = noise(px - 129825, py, pz + 1230951);
    const z = noise(px, py - 321523, pz + 1523512);

    rv.x = x;
    rv.y = y;
    rv.z = z;

    return rv;
}

export function curlNoise ( p: Vector3): Vector3 {
    const dx = new Vector3(e, 0, 0);
    const dy = new Vector3(0, e, 0);
    const dz = new Vector3(0, 0, e);

    const p_x0 = noise3(p.x - dx.x, p.y - dx.y, p.z - dx.z);
    const p_x1 = noise3(p.x + dx.x, p.y + dx.y, p.z + dx.z);
    const p_y0 = noise3(p.x - dy.x, p.y - dy.y, p.z - dy.z);
    const p_y1 = noise3(p.x + dy.x, p.y + dy.y, p.z + dy.z);
    const p_z0 = noise3(p.x - dz.x, p.y - dz.y, p.z - dz.z);
    const p_z1 = noise3(p.x + dz.x, p.y + dz.y, p.z + dz.z);

    const x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    const y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    const z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const divisor = 1.0 / (2.0 * e);
    const rv = new Vector3(x, y, z);
    rv.multiplyScalar(divisor);
    rv.normalize();

    return rv;
}
