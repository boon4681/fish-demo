<script lang="ts">
    import Text from "./Text.svelte";
    import { time, renderable } from "./game.js";

    let text = "";

    let elapsed = 0;
    let frames = 0;
    let prevTime = performance.now();
    renderable((state, dt) => {
        let time = performance.now();
        frames++;
        if (time >= prevTime + 1000) {
            const fps = (frames * 1000) / (time - prevTime);
            text = `${fps.toFixed(1)} FPS`;
            prevTime = time;
            frames = 0;
        }
    });
</script>

<Text {text} fontSize={12} fontFamily="Courier New" align="left" baseline="top" x={20} y={20} />

<slot></slot>
