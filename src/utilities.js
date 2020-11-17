// Main drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) =>{

  // Loop through each prediction
  for(let i=0; i <= boxes.length; i++){
    // Check if prediction is valid
    if(boxes[i] && classes[i] && scores[i]>threshold){
     
      // Exrtract boxes and classes
      const [x, y, width, height] = boxes[i]; 
      const text = classes[i];
      
      // Setup canvas styles
      const color = Math.floor(Math.random()*16777215).toString(16);
      ctx.beginPath();
      ctx.strokeStyle = '#' + color
      ctx.font = '18px Arial';
      ctx.fillStyle = '#' + color

      // Draw text and rectangle 
      ctx.fillText(text, x*imgWidth, y*imgHeight);
      ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth, height*imgHeight);    
      ctx.stroke();  
  }
  }
}

