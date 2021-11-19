export default function getZoomMinScale(configuration, defaultViewportScale) {
  return configuration.useMinDefaultCornerstoneViewportScaleIfAvailable
    ? defaultViewportScale || configuration.minScale
    : configuration.minScale;
}
