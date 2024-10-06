<script lang="ts">
    import { onMount, onDestroy, setContext } from "svelte";

    import { key, canvas as canvasStore, context as contextStore, pixelRatio, props, time } from "./game.js";
    import { writable } from "svelte/store";

    export let killLoopOnError = true;
    export let attributes = {};

    let listeners: any[] = [];
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let frame: any;
    const width = writable(0);
    const height = writable(0);

    function resize() {
        const parent = canvas.parentElement as any;
        width.set(parent.getBoundingClientRect().width);
        height.set(parent.getBoundingClientRect().height);
        pixelRatio.set(window.devicePixelRatio);
    }
    onMount(() => {
        const resize_observer = new ResizeObserver((entries) => resize());
        resize_observer.observe(canvas.parentElement!);
        resize();
        context = canvas.getContext("2d", attributes)! as any;
        canvasStore.set(canvas);
        contextStore.set(context);

        // setup entities
        listeners.forEach(async (entity) => {
            entity.ready = true;
        });

        // start game loop
        return createLoop((elapsed: any, dt: any) => {
            time.set(elapsed);
            render(dt);
        });
    });

    setContext(key, {
        width,
        height,
        add(fn: any) {
            this.remove(fn);
            listeners.push(fn);
            if (fn.setup) {
                fn.setup($props);
            }
            fn.ready = true;
        },
        remove(fn: any) {
            const idx = listeners.indexOf(fn);
            if (idx >= 0) listeners.splice(idx, 1);
        },
    });

    function render(dt: any) {
        context.save();
        context.scale($pixelRatio, $pixelRatio);
        listeners.forEach((entity) => {
            try {
                if (entity.mounted && entity.ready && entity.render) {
                    //@ts-ignore
                    entity.render({ ...$props, width: $width, height: $height }, dt);
                }
            } catch (err) {
                console.error(err);
                if (killLoopOnError) {
                    cancelAnimationFrame(frame);
                    console.warn("Animation loop stopped due to an error");
                }
            }
        });
        context.restore();
    }

    function createLoop(fn: any) {
        let elapsed = 0;
        let lastTime = performance.now();
        (function loop() {
            frame = requestAnimationFrame(loop);
            const beginTime = performance.now();
            const dt = (beginTime - lastTime) / 1000;
            lastTime = beginTime;
            elapsed += dt;
            fn(elapsed, dt + 0.00001);
        })();
        return () => {
            cancelAnimationFrame(frame);
        };
    }
</script>

<canvas
    bind:this={canvas}
    width={$width * $pixelRatio}
    height={$height * $pixelRatio}
    style="width: {$width}px; height: {$height}px;"
/>

<div class="absolute w-full h-full top-0 left-0">
    <slot></slot>
</div>
