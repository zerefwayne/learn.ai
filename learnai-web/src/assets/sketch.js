const resultArray = [];
let active = null;

function setup() {
  // put setup code here
  createCanvas(600, 400);
  // background(250, 250, 100);
}
let x = 25;
function draw() {
  background(250, 250, 100);
  fill(250, 200, 200, 50);
  ellipse(40, 20, 30, 30);

  fill(250, 200, 200, 50);
  rect(25, 50, 30, 30);

  for (var i = 0; i < resultArray.length; i++) {
    resultArray[i].display();
  }
}

function mousePressed() {
  // console.log(resultArray);
  for (var i = 0; i < resultArray.length; i++) {
    if (
      resultArray[i].type == "rectangle" &&
      mouseX >= resultArray[i].x &&
      mouseX <= resultArray[i].x + resultArray[i].sizex &&
      mouseY >= resultArray[i].y &&
      mouseY <= resultArray[i].y + resultArray[i].sizey
    ) {
      active = i;
      break;
    }
    if (
      resultArray[i].type == "ellipse" &&
      mouseX >= resultArray[i].x - resultArray[i].sizex / 2 &&
      mouseX <= resultArray[i].x + resultArray[i].sizex / 2 &&
      mouseY >= resultArray[i].y - resultArray[i].sizey / 2 &&
      mouseY <= resultArray[i].y + resultArray[i].sizey / 2
    ) {
      active = i;
      break;
    }
  }
  // console.log(resultArray[active]);
}
function mouseDragged() {
  if (resultArray[active].type == "ellipse") {
    resultArray[active].x = mouseX;
    resultArray[active].y = mouseY;
  }
  if (resultArray[active].type == "rectangle") {
    resultArray[active].x = mouseX - resultArray[active].sizex / 2;
    resultArray[active].y = mouseY - resultArray[active].sizey / 2;
  }
  // console.log(resultArray[resultArray[active]]);
}
function mouseReleased() {
  active = null;
}
function mouseClicked() {
  if (mouseX >= 25 && mouseX <= 55 && mouseY >= 5 && mouseY <= 35) {
    resultArray.push(new Block("ellipse", 100, 20, 30, 30));
  } else if (mouseX >= 25 && mouseX <= 55 && mouseY >= 50 && mouseY <= 80) {
    resultArray.push(new Block("rectangle", 85, 50, 30, 30));
  }
}
