<script lang="ts">
    import { renderable } from "./game";
    import Point from "./Point.svelte";
    import { Vector2D } from "./vector";

    function ConstrainDistance(point: Vector2D, anchor: Vector2D, distance: number) {
        return point.subtract(anchor).normalize().multiply(distance).add(anchor);
    }

    let x = 0;
    let y = 0;
    let down = false;
    const ropes: Vector2D[] = new Array(20).fill("").map((a) => new Vector2D(0, 0));

    renderable((props) => {
        const { context } = props;
        ropes[0].x = x;
        ropes[0].y = y;
        context.beginPath();
        context.strokeStyle = "white";
        for (let i = 0; i < ropes.length - 1; i++) {
            const rope = ropes[i];
            const ropeNext = ropes[i + 1];
            context.moveTo(rope.x, rope.y);
            context.lineTo(ropeNext.x, ropeNext.y);
        }
        context.stroke();
        context.closePath();

        for (let i = 1; i < ropes.length; i++) {
            ropes[i] = ConstrainDistance(ropes[i], ropes[i - 1], 40);
        }
    });

    function handleMouseMove({ clientX, clientY }: any) {
        x = clientX;
        y = clientY;
    }
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mousedown={() => {
        down = true;
    }}
    on:mouseup={() => {
        down = false;
    }}
/>

{#each ropes as rope}
    {#if down}
        <Point x={rope.x} y={rope.y}>e</Point>
    {/if}
    <Point x={rope.x} y={rope.y} radius={5} fill="white"></Point>
{/each}

<slot></slot>
