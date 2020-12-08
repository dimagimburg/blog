---
title: How to use ResizeObserver with React
description: A simple use-case where I had to use ResizeObserver to detect a Mapbox GL JS wrapper element resize.
date: 2020-12-08T09:00:00.000+02:00
---

Hi folks, this post is about solving a problem I had with very simple (yet beautiful) browser API.
Combined with React hooks, it provided a very neat, self contained and small solution.
But before that lets first of all introduce the problem.

I work with maps often, and while the most familiar maps SDK for browser is probably Google Maps, I use Mapbox.
I don't have a bit of complaint about their API, most of the times I find it really easy and intuitive.
But one thing that was always annoying for me is that they use canvas as the map holder, and canvas doesn't go well with resizes.

Here is a demonstration of the problem:
![Map And Container Full Width](resize-observer/1.png)

Let's say that the size of the container of the map is `width: 848px; height: 293px`,
this is how the piece of DOM looks like:

![Map In DOM](resize-observer/2.png)

Believe me that the container (`class="mapWrapper_16cvk ...`) is also with same dimensions.
We can easily see that the canvas width and height are derived from the container dimensions.
We would expect that the dimensions of the canvas would change in a reaction to the container dimensions change
(for example expand/collapse of other part of the page), and it does!

...

Well... sometimes. This is what happens after other part of the page toggles twice expand/collapse action
that also changes the map wrapper dimensions.

![Map After Container Resize](resize-observer/3.png)

![Devtools After Resize](resize-observer/4.png)

The dimensions of the container are back to normal but canvas is left in "un-synced" state.
Not to mention that I also have some css transition of 250ms, this adds some complexity to the challenge.
I would expect Mapbox SDK to detect such changes but they didn't. So I had to come up with a custom solution.

There were 2 simple "goto" solutions I could think of before ResizeObserver.
1. Some interval that checks for updates in the DOM once in a while and resizes the map 
(the api to resize the canvase is `map.resize()`). 
I though that this is a messy solution, I want to minimize DOM access as possible, and also I didn't know what to check, is it width/height? getBoundingClientRect?

2. Control from outside - store in the state some flag that invalidates the maps dimensions 
every time something is changed in the structure of the other page parts. 
This leads to a complex solution with holding state for something the DOM should do for me.
What would have happen if I added another part that should invalidate the map dimensions?
not the greatest solution.

The third solution seems much cleaner. Why not use ResizeObserver on the wrapper element to get a callback whenever the dimensions change.
The [API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) seems to be really easy. This is my solutions:

```typescript jsx
const CustomMap = () => {
    ...
    const mapElementRef = useRef(null);
    const mapRef = useRef<mapboxgl.Map>(null); // <- this reference holds the mapboxgl map instance
    
    ...

    useEffect(() => {
        let timeout;
        const resizeObserver = new ResizeObserver(() => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                mapRef.current.resize();
            }, 100);
        });

        resizeObserver.observe(mapElementRef.current);

        return () => {
            resizeObserver.disconnect();
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);

    return <div ref={mapElementRef} />

};
```

So inside the effect I initialize the resize observer and provide it the callback that's called whenever resize occurs.
I manage a timeout reference in order to be able to clear it. This is what solves the transition challenge for me - because there is a transition,
the resize observer callback gets called few times before the transition finished.
Cool fact - for 250ms transition it got called about 15 times, so every 16.67ms in average,
and `1000ms / 16.67ms = 60 fps` so it seems that it is called 60 times a second, which makes sense as browser draw indeed works in 60hz.
Anyway, I clear the timeout every 100ms so it won't call the `map.resize` too often,
and I can live with it being called only 100ms after transition ended, almost not visible.
Calling `resizeObserver.observe(mapElementRef.current);` just activates the resize observer on my wrapper element.
And of course we should provide some cleanup function to the cleanup callback of the effect so when the component unmounts we don't leave foot prints.

That's it. This is how and why I used ResizeObserver with my react component.

Cheers 🍻
