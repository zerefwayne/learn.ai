function Block(type, x, y, sizex, sizey, radius) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.sizex = sizex;
  this.sizey = sizey;
  this.radius = radius;
  this.button;

  this.propContent = function(ar) {
    const result = [];
    for (var i = 0; i < ar.length; i++) {
      const a = prompt(ar[i]);
      result.push({ [ar[i]]: a });
    }
    this.params = result;
    console.log(this.params);
  };

  this.rem = function() {
    if (this.button) {
      this.button.remove();
    }
  };
  this.display = function() {
    noStroke();
    if (this.type == "ellipse") {
      fill(255, 255, 255);
      ellipse(this.x, this.y, this.sizex, this.sizey);
    } else if (this.type == "rectangle") {
      fill(255, 255, 255);
      rect(this.x, this.y, this.sizex, this.sizey, this.radius);
      rect(
        this.x + this.sizex + 5,
        this.y + this.sizey / 4,
        this.sizex / 2,
        this.sizey / 2,
        this.radius
      );
    }
    textSize(16);
    fill(255, 255, 255);
    text(this.params[0]["Layer Type"], this.x + this.sizex / 4, this.y - 2);
    text(
      this.params[2]["Activation Type"],
      this.x + this.sizex + this.sizex / 2,
      this.y - 2
    );
    this.button = createButton("edit");
    this.button.position(
      this.x + this.sizex / 2 + this.sizex / 3,
      this.y + this.sizey
    );
    this.button.mousePressed(changeBG);
  };
  function changeBG() {
    const a = prompt("hello");
  }
}