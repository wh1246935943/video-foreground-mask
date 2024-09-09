import * as bodySegmentation from '@tensorflow-models/body-segmentation';

const canvas = document.createElement('canvas');
const canvasCtx = canvas.getContext('2d');
const danmuEle = document.querySelector('.danmu')

const segmenterConfig = {
  runtime: 'mediapipe', // or 'tfjs'
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
  modelType: 'general'
}

let segmenter = null;

async function setMask() {

  const videoEle = document.querySelector('#video');

  if (videoEle.readyState < 4) return;

  canvas.width = videoEle.clientWidth;
  canvas.height = videoEle.clientHeight;
  canvasCtx.clearRect(0, 0, videoEle.clientWidth, videoEle.clientHeight);
  canvasCtx.drawImage(videoEle, 0, 0, videoEle.clientWidth, videoEle.clientHeight)

  if (!segmenter) {
    segmenter = await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, segmenterConfig);
  };
  
  const segmentation = await segmenter.segmentPeople(canvas);
  const coloredPartImage = await bodySegmentation.toBinaryMask(segmentation);

  canvasCtx.clearRect(0, 0, videoEle.clientWidth, videoEle.clientHeight);
  canvasCtx.putImageData(coloredPartImage, 0, 0);

  const base64Data = canvas.toDataURL('image/png');

  danmuEle.style.maskImage = `url(${base64Data})`;

}

function loop() {
  requestAnimationFrame(() => {
    setMask();
    loop();

    console.log(1)
  })
}
loop()