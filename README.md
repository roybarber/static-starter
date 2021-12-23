## Static Starter 2021
Tailwind 3 + Gulp 4 + Webpack 4 + Handlebars + Babel + BrowserSync + Netlify CLI + Netlify Functions + i18n Language Support

Speed up your development with a complete and scalable gulpjs based build system that scaffolds the project for you. Just focus on your code. Provides a consumable mock API to build real world front ends pre-integration.

## Getting Started

### Requirements
1. [NodeJS](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com/get-npm)
3. [Netlify CLI](https://www.npmjs.com/package/jquery)


### Install

1. Clone this repository
2. Run `npm install`

### Run the project

|                | Task Name                                    | Description                                               | Environment |
| -------------- | :------------------------------------------- | :-------------------------------------------------------- | :---------- |
| :construction: | `npm run dev`                     | Compile dev build, start the server and fake API and watch for changes | Development |
| :factory:      | `npm run build` | Compile production build                                  | Production  |



### How to use SVG sprite?

##### Add images

1. `optional` Change color values (`fill` or `stroke`) in your SVG file to `currentColor` to support dynamic color changes.
2. Put SVG file in `src/img/svg-sprite` directory.
3. The code from your SVG file will be included in one svg-sprite and placed in `dist/img/svg-sprite/sprite.svg`

##### SVG tag

```html
<svg viewBox="x0 y0 x1 y1">
  <use href="assets/img/svg-sprite/sprite.svg#YOUR_SVG_FILE_NAME"></use>
</svg>
```

You can get viewBox value from your SVG file or using devTools on the page after including sprite.svg

##### IMG tag

```html
<img src="assets/img/svg-sprite/sprite.svg#YOUR_SVG_FILE_NAME" alt="">
```

In this case, the image does not respond to color changes.


### MOre documentation to follow
