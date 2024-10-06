<script lang="ts">
  import { CubicBezier } from "svelte-tweakpane-ui";
  import Background from "./lib/Background.svelte";
  import Canvas from "./lib/Canvas.svelte";
  import Chain from "./lib/Chain.svelte";
  import Fish from "./lib/Fish.svelte";
  import FPS from "./lib/FPS.svelte";
  import Point from "./lib/Point.svelte";
  import type { CubicBezierValue } from "svelte-tweakpane-ui";
  import { Slider, Checkbox } from "svelte-tweakpane-ui";
  import { SecoundOrderSystemSemiImplicitEulerSolver } from "./lib/utils";
  import { Vector2D } from "./lib/vector";
  import { Color } from "svelte-tweakpane-ui";
  import Boids from "./lib/Boids.svelte";
  let filledColor = "#289cff";
  let filledFinColor = "#5e96d5";
  let f = 1;
  let z = 1;
  let r = 0;
  let f2 = 1;
  let z2 = 1;
  let r2 = 0;
  let x = 500;
  let y = 500;
  let link = 5;
  let eyes = -16;
  let eyesSize = 0.82;
  let bone = false;
  let body = true;
  let size = 5;
  let solver = new SecoundOrderSystemSemiImplicitEulerSolver(f, z, r, new Vector2D(x, y));
  let solver2 = new SecoundOrderSystemSemiImplicitEulerSolver(f2, z2, r2, new Vector2D(x, y));
  let value: CubicBezierValue = {
    x1: 0.67,
    y1: 0.38,
    x2: 0.42,
    y2: 1.52,
  };

  let mouse_x = 500;
  let mouse_y = 500;
  let down = false;
  function handleMouseMove({ clientX, clientY }: any) {
    if (down) {
      mouse_x = clientX;
      mouse_y = clientY;
    }
  }
</script>

<div class="flex w-full h-full">
  <div class="flex relative overflow-hidden w-full h-full">
    <Canvas>
      <Background></Background>
      <!-- <Chain></Chain> -->
      <Boids
        {mouse_x}
        {mouse_y}
        {size}
        {body}
        {eyesSize}
        fillFin={filledFinColor}
        {eyes}
        {link}
        fill={filledColor}
        {solver}
        {solver2}
        {value}
        {bone}
      ></Boids>
      <!-- <Fish
        {mouse_x}
        {mouse_y}
        {body}
        {eyesSize}
        fillFin={filledFinColor}
        {eyes}
        {link}
        fill={filledColor}
        bind:x
        bind:y
        {solver}
        {solver2}
        {value}
        {bone}
      ></Fish> -->
      <FPS />
    </Canvas>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="absolute top-0 left-0 w-full h-full"
      on:mousemove={handleMouseMove}
      on:mousedown={(e) => {
        down = true;
        handleMouseMove(e);
      }}
      on:mouseup={(e) => {
        handleMouseMove(e);
        down = false;
      }}
    />
  </div>
  <div class="flex flex-shrink-0 flex-col w-[320px] border-l">
    <CubicBezier bind:value expanded={true} picker="inline" />

    <Slider bind:value={size} min={2} max={40} format={(v) => v.toFixed(2)} label="Body Size" />
    <Slider bind:value={link} min={5} max={40} format={(v) => v.toFixed(2)} label="Spine lenght" />
    <Slider bind:value={eyes} min={-40} max={40} format={(v) => v.toFixed(2)} label="Eyes offset" />
    <Slider bind:value={eyesSize} min={0.1} max={10} format={(v) => v.toFixed(2)} label="Eyes size" />
    <Slider
      bind:value={f}
      on:change={() => {
        solver.change(f, z, r);
      }}
      min={-3}
      max={3}
      format={(v) => v.toFixed(2)}
      label="f"
    />
    <Slider
      bind:value={z}
      on:change={() => {
        solver.change(f, z, r);
      }}
      min={0}
      max={10}
      format={(v) => v.toFixed(2)}
      label="z"
    />
    <Slider
      bind:value={r}
      on:change={() => {
        solver.change(f, z, r);
      }}
      min={-3}
      max={3}
      format={(v) => v.toFixed(2)}
      label="r"
    />
    <Slider
      bind:value={f2}
      on:change={() => {
        solver2.change(f2, z2, r2);
      }}
      min={-3}
      max={3}
      format={(v) => v.toFixed(2)}
      label="f2"
    />
    <Slider
      bind:value={z2}
      on:change={() => {
        solver2.change(f2, z2, r2);
      }}
      min={0}
      max={10}
      format={(v) => v.toFixed(2)}
      label="z2"
    />
    <Slider
      bind:value={r2}
      on:change={() => {
        solver2.change(f2, z2, r2);
      }}
      min={-3}
      max={3}
      format={(v) => v.toFixed(2)}
      label="r2"
    />
    <Color bind:value={filledColor} label="Fill Color" />
    <Color bind:value={filledFinColor} label="Fill Fins Color" />
    <Checkbox bind:value={bone} label="Bone" />
    <Checkbox bind:value={body} label="Body" />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
