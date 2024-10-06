<script lang="ts">
    import { renderable } from "./game";
    import Point from "./Point.svelte";
    import { complexCurve, ConstrainAngle, SecoundOrderSystemSemiImplicitEulerSolver } from "./utils";
    import { Vector2D } from "./vector";
    import { CubicBezier, type CubicBezierValue, RadioGrid, Slider, Utils } from "svelte-tweakpane-ui";
    import Arrow from "./Arrow.svelte";
    import { onMount } from "svelte";

    export let eyesSize = 2;
    export let fill: string;
    export let fillFin: string;
    export let eyes = -10;
    export let x = 0;
    export let y = 0;
    export let bone: boolean;
    export let body: boolean;
    export let link = 20;
    export let mouse_x: number;
    export let mouse_y: number;
    export let size: number = 20;
    export let solver: SecoundOrderSystemSemiImplicitEulerSolver;
    export let solver2: SecoundOrderSystemSemiImplicitEulerSolver;
    export let value: CubicBezierValue;
    const calc_r = (i: number, max: number) => {
        return size * Utils.cubicBezierToEaseFunction(value)((max - i) * (1 / max)) + 5;
    };
    let count = 10;
    type Joint = { p: Vector2D; r: number; a: number };
    let ropes: Joint[] = [
        {
            p: new Vector2D(x, y),
            r: size * calc_r(0, count),
            a: 0,
        },
    ];
    function getPosX(j: Joint, angleOffset: number, lengthOffset: number) {
        return j.p.x + Math.cos(j.a + angleOffset) * (j.r + lengthOffset);
    }

    function getPosY(j: Joint, angleOffset: number, lengthOffset: number) {
        return j.p.y + Math.sin(j.a + angleOffset) * (j.r + lengthOffset);
    }

    function getSide(j: Joint, angleOffset: number, lengthOffset: number) {
        return new Vector2D(getPosX(j, angleOffset, lengthOffset), getPosY(j, angleOffset, lengthOffset));
    }
    function solve(dt: number) {
        const f = new Vector2D(mouse_x, mouse_y).subtract(ropes[0].p).multiply(0.6);
        const target = ropes[0].p.clone().add(f);
        if (target.distanceTo(ropes[0].p) > 5) {
            const v = solver.update(dt, target);
            x = v.x;
            y = v.y;
            const k = solver2.update(dt, target.clone().subtract(ropes[0].p));
            ropes[0].a = k.heading();
        }
        ropes[0].p.x = x;
        ropes[0].p.y = y;
        for (let i = 1; i < ropes.length; i++) {
            let curAngle = ropes[i - 1].p.clone().subtract(ropes[i].p).heading();
            ropes[i].a = ConstrainAngle(curAngle, ropes[i - 1].a, Math.PI / 8);
            ropes[i].p = ropes[i - 1].p.clone().subtract(Vector2D.fromAngle(ropes[i].a).multiply(link));
        }
    }

    renderable({
        setup: () => {
            for (let i = 1; i < count; i++) {
                ropes.push({
                    p: ropes[i - 1].p.clone().subtract(new Vector2D(20, 0)),
                    r: size * calc_r(i, count),
                    a: 0,
                });
            }
        },
        render: (props, dt) => {
            const { context } = props;
            solve(dt);
            if (!body) {
                return;
            }
            complexCurve(
                context,
                0.4,
                20,
            )((vertex) => {
                vertex(ropes[9].p);
                vertex(ropes[9].p.add(Vector2D.fromAngle(ropes[8].a + Math.PI).multiply(link)));
                vertex(ropes[9].p.add(Vector2D.fromAngle(ropes[8].a + Math.PI).multiply(link * 2.4)));
                vertex(ropes[9].p.add(Vector2D.fromAngle(ropes[9].a + Math.PI).multiply(link * 2.4)));
                vertex(ropes[9].p.add(Vector2D.fromAngle(ropes[9].a + Math.PI).multiply(link)));
                vertex(ropes[8].p);
            });
            context.strokeStyle = "white";
            context.fillStyle = fillFin;
            context.fill();
            context.stroke();
            context.closePath();
            context.strokeStyle = "white";
            {
                context.save();
                context.beginPath();
                context.strokeStyle = "white";
                const v = getSide(ropes[2], Math.PI / 2, 0);
                context.translate(v.x, v.y);
                context.rotate(ropes[1].a);
                context.ellipse(0, 0, size / 2, size, Math.PI / 4, 0, 2 * Math.PI);
                context.fillStyle = fillFin;
                context.fill();
                context.stroke();
                context.closePath();
                context.restore();
            }
            {
                context.save();
                context.beginPath();
                context.strokeStyle = "white";
                const v = getSide(ropes[2], -Math.PI / 2, 0);
                context.translate(v.x, v.y);
                context.rotate(ropes[1].a);
                context.ellipse(0, 0, size / 2, size, -Math.PI / 4, 0, 2 * Math.PI);
                context.fillStyle = fillFin;
                context.fill();
                context.stroke();
                context.closePath();
                context.restore();
            }
            {
                context.save();
                context.beginPath();
                context.strokeStyle = "white";
                const v = getSide(ropes[count - 3], Math.PI / 2, 0);
                context.translate(v.x, v.y);
                context.rotate(ropes[count - 3].a);
                context.ellipse(0, 0, size * 0.4, size * 0.7, Math.PI / 4, 0, 2 * Math.PI);
                context.fillStyle = fillFin;
                context.fill();
                context.stroke();
                context.closePath();
                context.restore();
            }
            {
                context.save();
                context.beginPath();
                context.strokeStyle = "white";
                const v = getSide(ropes[count - 3], -Math.PI / 2, 0);
                context.translate(v.x, v.y);
                context.rotate(ropes[count - 3].a);
                context.ellipse(0, 0, size * 0.4, size * 0.7, -Math.PI / 4, 0, 2 * Math.PI);
                context.fillStyle = fillFin;
                context.fill();
                context.stroke();
                context.closePath();
                context.restore();
            }
            context.beginPath();
            complexCurve(
                context,
                0.4,
                20,
            )((vertex) => {
                for (let i = 1; i < ropes.length - 1; i++) {
                    vertex(getSide(ropes[i], Math.PI / 2, 0));
                }
                vertex(getSide(ropes[count - 1], Math.PI, 0));
                for (let i = ropes.length - 1; i > 0; i--) {
                    vertex(getSide(ropes[i], -Math.PI / 2, 0));
                }
                vertex(getSide(ropes[0], -Math.PI / 4, 0));
                vertex(getSide(ropes[0], 0, size * 0.2));
                vertex(getSide(ropes[0], Math.PI / 4, 0));
                vertex(getSide(ropes[0], Math.PI / 2, 0));
                vertex(getSide(ropes[1], Math.PI / 2, 0));
            });
            context.fillStyle = fill;
            context.fill();

            complexCurve(
                context,
                0.4,
                20,
            )((vertex) => {
                vertex(ropes[3].p);
                vertex(ropes[2].p);
                vertex(ropes[4].p);
                vertex(ropes[2].p);
                vertex(ropes[5].p);
                vertex(ropes[4].p.add(Vector2D.fromAngle(ropes[4].a + Math.PI).multiply(16)));
                vertex(ropes[3].p.add(Vector2D.fromAngle(ropes[3].a + Math.PI).multiply(16)));
                vertex(ropes[2].p);
            });
            context.fillStyle = fill;
            context.fill();
            context.stroke();
            context.closePath();
        },
    });

    $: {
        ropes = ropes.map((a, i, v) => {
            return {
                ...a,
                r: Math.max(0, size * Utils.cubicBezierToEaseFunction(value)((v.length - i) * (1 / v.length)) + 5),
            };
        });
    }
</script>

<Point x={getPosX(ropes[0], Math.PI / 2, eyes)} y={getPosY(ropes[0], Math.PI / 2, eyes)} radius={eyesSize} fill="white"
></Point>
<Point
    x={getPosX(ropes[0], -Math.PI / 2, eyes)}
    y={getPosY(ropes[0], -Math.PI / 2, eyes)}
    radius={eyesSize}
    fill="white"
></Point>
{#if bone}
    <!-- <Arrow start={ropes[0].p} v={Vector2D.fromAngle(ropes[0].a).multiply(40)}></Arrow> -->
    {#each ropes as rope}
        <Point x={rope.p.x} y={rope.p.y} radius={rope.r}></Point>
        <!-- <Point x={rope.p.x} y={rope.p.y} radius={4}></Point> -->
        <Point x={rope.p.x} y={rope.p.y} radius={5} fill="red"></Point>
        <Point x={getPosX(rope, Math.PI / 2, 0)} y={getPosY(rope, Math.PI / 2, 0)} radius={2} fill="red"></Point>
        <!-- <Point x={getPosX(rope, -Math.PI / 2, 0)} y={getPosY(rope, -Math.PI / 2, 0)} radius={2} fill="red"></Point> -->
    {/each}
{/if}
<slot></slot>
