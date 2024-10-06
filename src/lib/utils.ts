import { Vector2D } from "./vector";

export class SecoundOrderSystemSemiImplicitEulerSolver {
    private xp: Vector2D;
    private y: Vector2D;
    private yd: Vector2D;
    private k1: number
    private k2: number
    private k3: number

    constructor(private f: number, private z: number, private r: number, x0: Vector2D) {
        this.k1 = z / (Math.PI * f);
        this.k2 = 1 / ((2 * Math.PI * f) * (2 * Math.PI * f));
        this.k3 = r * z / (2 * Math.PI * f);

        this.xp = x0;
        this.y = x0;
        this.yd = new Vector2D(0, 0);
    }

    change(f: number, z: number, r: number) {
        this.f = f;
        this.z = z;
        this.r = r;
        this.k1 = z / (Math.PI * f);
        this.k2 = 1 / ((2 * Math.PI * f) * (2 * Math.PI * f));
        this.k3 = r * z / (2 * Math.PI * f);
    }

    update(T: number, x: Vector2D, xd: Vector2D | null = null): Vector2D {
        T = Math.min(0.01, T)
        if (xd == null) {
            xd = x.subtract(this.xp).divide(T);
            this.xp = x;
        }
        this.y = this.y.add(this.yd.multiply(T));
        this.yd = this.yd.add(((x.add(xd.multiply(this.k3)).subtract(this.y).subtract(this.yd.multiply(this.k1))).divide(this.k2)).multiply(T));
        return this.y;
    }

    shallow_copy(v: Vector2D) {
        return new SecoundOrderSystemSemiImplicitEulerSolver(this.f, this.z, this.r, v)
    }
}


export function ConstrainDistance(pos: Vector2D, anchor: Vector2D, constraint: number): Vector2D {
    let constrainedVec = pos.clone().subtract(anchor).normalize().multiply(constraint);
    return anchor.clone().add(constrainedVec);
}


export function normalizeAngle(angle: number): number {
    return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
}

export function ConstrainAngle(curAngle: number, prevAngle: number, maxDelta: number): number {
    let delta = normalizeAngle(curAngle - prevAngle);
    if (delta > Math.PI) delta -= Math.PI * 2;
    delta = Math.max(-maxDelta, Math.min(maxDelta, delta));
    return normalizeAngle(prevAngle + delta);
}

export function complexCurve(context: CanvasRenderingContext2D, tension: number, numOfSegments: number = 12) {
    let points: Vector2D[] = [];
    function draw() {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        const getPoint = (i: number) =>
            i < 0 ? points[0] : i > points.length - 1 ? points[points.length - 1] : points[i];
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = getPoint(i - 1);
            const p1 = getPoint(i);
            const p2 = getPoint(i + 1);
            const p3 = getPoint(i + 2);
            for (let t = 0; t <= numOfSegments; t++) {
                const t1 = t / numOfSegments;
                const t2 = t1 * t1;
                const t3 = t2 * t1;
                const x =
                    0.5 *
                    (2 * p1.x +
                        (-p0.x + p2.x) * t1 +
                        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
                const y =
                    0.5 *
                    (2 * p1.y +
                        (-p0.y + p2.y) * t1 +
                        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
                context.lineTo(x, y);
            }
        }
        context.stroke();
    }
    const vertex = (v: Vector2D) => {
        points.push(v);
    };
    return (fn: (v: (v: Vector2D) => void) => void) => {
        fn(vertex);
        draw();
    };
}