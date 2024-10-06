<script lang="ts">
    import { renderable } from "./game.js";

    export let x: number = 0;
    export let y: number = 0;
    export let radius: number = 20;
    export let fill: string = "";
    renderable((props) => {
        const { context } = props;
        context.beginPath();
        context.strokeStyle = "white";
        context.arc(x, y, radius, 0, 2 * Math.PI);
        if (fill.length) {
            context.fillStyle = fill;
            context.fill();
        }
        context.stroke();
    });
</script>

<slot></slot>