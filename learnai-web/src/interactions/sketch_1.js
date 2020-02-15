function mouseClicked() {
  if (mouseX >= 25 && mouseX <= 105 && mouseY >= 50 && mouseY <= 130) {
    const obj = new Block("rectangle", 25, 50, 80, 80, 6);
    obj.propContent(["enter the name"]);
    resultArray.push(obj);
  } else if (mouseX >= 25 && mouseX <= 85 && mouseY >= 150 && mouseY <= 210) {
    const obj = new Block("rectangle", 25, 150, 80, 80, 6);
    obj.propContent(["enter the name", "suck it"]);
    resultArray.push(obj);
  }
}
