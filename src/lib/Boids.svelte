<script lang="ts">
    import type { CubicBezierValue } from "svelte-tweakpane-ui";
    import { Boid } from "./boids";
    import Fish from "./Fish.svelte";
    import { renderable } from "./game";
    import type { SecoundOrderSystemSemiImplicitEulerSolver } from "./utils";
    import Point from "./Point.svelte";

    export let fill: string;
    export let fillFin: string;
    export let eyesSize = 2;
    export let eyes = -10;
    export let bone: boolean;
    export let body: boolean;
    export let mouse_x = 20;
    export let mouse_y = 20;
    export let link = 20;
    export let size = 20;
    export let value: CubicBezierValue;
    export let solver: SecoundOrderSystemSemiImplicitEulerSolver;
    export let solver2: SecoundOrderSystemSemiImplicitEulerSolver;
    let boids: Boid[] = new Array(30).fill("").map((a) => {
        return new Boid(solver, solver2);
    });

    renderable({
        setup: () => {},
        render: (props) => {
            const { context, width, height } = props;
            for (let boid of boids) {
                boid.edges(width, height);
                boid.flock(boids);
                boid.avoidMouse(mouse_x, mouse_y);
                boid.update();
            }
            boids = boids;
        },
    });
</script>

<Point x={mouse_x} y={mouse_y}></Point>
{#each boids as boid}
    <Fish
        mouse_x={boid.position.x}
        mouse_y={boid.position.y}
        {size}
        {body}
        {eyesSize}
        {fillFin}
        {eyes}
        {link}
        {fill}
        solver={boid.solver}
        solver2={boid.solver2}
        {value}
        {bone}
    ></Fish>
{/each}
