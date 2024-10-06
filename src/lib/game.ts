import { getContext, onMount, onDestroy } from 'svelte';
import { writable, derived } from 'svelte/store';

export const pixelRatio = writable(window.devicePixelRatio);
export const context = writable();
export const canvas = writable();
export const time = writable(0);

// A more convenient store for grabbing all game props
export const props = deriveObject({
    context,
    canvas,
    // width,
    // height,
    pixelRatio,
    time
});

export const key = Symbol();

export const getState = () => {
    const api = getContext(key) as any;
    return api.getState();
};

type render = (props: { context: CanvasRenderingContext2D, width: number, height: number }, dt: number) => void
type renderable = render | { render: render, setup: () => void }

export const renderable = (render: renderable) => {
    const api = getContext(key) as any;
    const element = {
        ready: false,
        mounted: false
    } as any;
    if (typeof render === 'function') element.render = render;
    else if (render) {
        if (render.render) element.render = render.render;
        if (render.setup) element.setup = render.setup;
    }
    api.add(element);
    onMount(() => {
        element.mounted = true;
        return () => {
            api.remove(element);
            element.mounted = false;
        };
    });
}

function deriveObject(obj: any) {
    const keys = Object.keys(obj);
    const list = keys.map(key => {
        return obj[key];
    });
    return derived(list, (array) => {
        return array.reduce((dict: any, value, i) => {
            dict[keys[i]] = value;
            return dict;
        }, {});
    });
}