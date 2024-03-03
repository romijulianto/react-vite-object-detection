import { type DetectedObject } from '@tensorflow-models/coco-ssd';

function drawRect(
  detections: DetectedObject[],
  context: CanvasRenderingContext2D,
) {
  detections.forEach(predication => {
    const [x, y, width, height] = predication.bbox;
    const score = (predication.score * 100).toFixed(2) + '%';
    const label = predication.class.toUpperCase() + ' - ' + score;
    context.font = '16px Inter';
    context.strokeStyle = 'tomato';
    context.lineWidth = 3;
    context.strokeRect(x, y, width, height);
    context.fillStyle = 'tomato';
    const textW = context.measureText(label).width + 10;
    context.fillRect(x, y, textW, -16);
    context.fillStyle = '#000000';
    context.fillText(label, x, y);
  });
}

export { drawRect };
