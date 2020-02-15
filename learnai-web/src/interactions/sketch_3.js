const resultArray = [];
let active = null;

function setup() {
  // put setup code here
  createCanvas(600, 400);
  // background(250, 250, 100);
}
function renameBG() {
  resultArray.sort((a, b) => {
    return a.x - b.x;
  });
  for (var i = 0; i < resultArray.length; i++) {
    if (i == 0) {
      resultArray[i].x = resultArray[i].sizex + 30;
    }
    if (i > 0) {
      resultArray[i].x = resultArray[i - 1].x + 100 + resultArray[i - 1].sizex;
      line;
    }
    resultArray[i].y = height / 2 - resultArray[i].sizey / 2;
  }

  for (var i = 0; i < resultArray.length; i++) {
    stroke(0);
    strokeWeight(5);
    if (i > 0) {
      // line(
      //   resultArray[i - 1].x +size/2 +sizex / 2,
      //   resultArray[i - 1].y +sizey/2+ sizey / 2,
      //   resultArray[i].x,
      //   resultArray[i].y + sizey / 2
      // );

      line(50, 0, 200, 400);
    }
  }
}
function draw() {
  background(250, 250, 100);
  const button = createButton("Arrange");
  button.position(0, 0);
  button.mousePressed(renameBG);

  fill(250, 200, 200, 50);
  // ellipse(40, 20, 30, 30);
  rect(25, 50, 80, 80, 6);

  fill(250, 200, 200, 50);
  rect(25, 150, 80, 80, 6);
  // if (active) {
  //   resultArray[active].rem();
  // }
  for (var i = 0; i < resultArray.length; i++) {
    resultArray[i].rem();
    resultArray[i].display();
  }
}

function mousePressed() {
  // console.log(resultArray);
  for (var i = 0; i < resultArray.length; i++) {
    // resultArray[i].onPress()
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
  // resultArray[active].rem();
  // console.log(resultArray[active]);
}
function mouseDragged() {
  if (resultArray[active].type == "ellipse") {
    resultArray[active].x = mouseX;
    resultArray[active].y = mouseY;
    resultArray[active].rem();
  }
  if (resultArray[active].type == "rectangle") {
    resultArray[active].x = mouseX - resultArray[active].sizex / 2;
    resultArray[active].y = mouseY - resultArray[active].sizey / 2;
    resultArray[active].rem();
  }
  // console.log(resultArray[resultArray[active]]);
}
function mouseReleased() {
  active = null;
}
function mouseClicked() {
  if (mouseX >= 25 && mouseX <= 105 && mouseY >= 50 && mouseY <= 130) {
    const obj = new Block("rectangle", 25, 50, 80, 80, 6);
    obj.propContent(["Layer Type", "Number of Nodes","Activation Type"]);
    resultArray.push(obj);
  } else if (mouseX >= 25 && mouseX <= 85 && mouseY >= 150 && mouseY <= 210) {
    const obj = new Block("rectangle", 25, 150, 80, 80, 6);
    obj.propContent(["Layer Type", "Number of Nodes","Activation Type"]);
    resultArray.push(obj);
  }
}
