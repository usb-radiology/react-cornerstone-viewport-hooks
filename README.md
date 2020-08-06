# react-cornerstone-viewport-hooks

> react cornerstone viewport component (with hooks)

[![NPM](https://img.shields.io/npm/v/react-cornerstone-viewport-hooks.svg)](https://www.npmjs.com/package/react-cornerstone-viewport-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This repository is functionally equivalent to [https://github.com/cornerstonejs/react-cornerstone-viewport](https://github.com/cornerstonejs/react-cornerstone-viewport) with the major differences being that this component uses react hooks under the hood and does not support all the features that the original component does at the moment.

Feature parity is planned and the props should be API compatible as much as possible.

Please check the source for more information.

## Install

```bash
npm install --save react-cornerstone-viewport-hooks
```

## Usage

```jsx
import {
  ReactCornerstoneViewportHooks,
  ReactCornerstoneViewportHooksHelpers,
  RectangleRoiUniqueTool,
} from "react-cornerstone-viewport-hooks";

import "react-cornerstone-viewport-hooks/dist/index.css";

const {
  TOOL_NAMES,
  getToolState,
  setInitialToolState,
} = ReactCornerstoneViewportHooksHelpers;
```

## Development

Bootstrapped via `create-react-library`.

### Publish

All you need to do is to update the code and push commits to master. Thereafter create a version via npm and publish. The publish command will take care of updating the `dist` folder and uploading it.

```bash
npm version <patch, minor, major> # creates git tag
npm publish
git push
git push --tags
```

## License

MIT © [wheresvic](https://github.com/wheresvic)
