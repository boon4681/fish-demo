<script lang="ts">
    import { renderable } from "./game";
    import type { Vector2D } from "./vector";

    export let v: Vector2D;
    export let start: Vector2D;
    export let size: number = 10;

    renderable(({ context }) => {
        let end_x = v.x + start.x;
        let end_y = v.y + start.y;
        context.save();
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(start.x, start.y);
        context.lineTo(end_x, end_y);
        context.stroke();
        context.closePath();
        context.translate(start.x, start.y);
        context.translate(v.x, v.y);
        // context.translate(v.x / 2, v.y / 2);
        context.rotate(v.heading());
        context.fillStyle = "red";
        context.beginPath();
        context.moveTo(0, size / 2); 
        context.lineTo(0, -size / 2); 
        context.lineTo(size, 0); 
        context.fill();
        context.closePath();
        context.restore();
    });
</script>
