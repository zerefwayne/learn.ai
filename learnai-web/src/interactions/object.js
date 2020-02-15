export default function(sketch) {
  return function Block(type, x, y, sizex, sizey, radius) {
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
      sketch.noStroke();
      if (this.type == "ellipse") {
        sketch.fill(255, 255, 255);
        sketch.ellipse(this.x, this.y, this.sizex, this.sizey);
      } else if (this.type == "rectangle") {
        sketch.fill(255, 255, 255);
        sketch.rect(this.x, this.y, this.sizex, this.sizey, this.radius);
      }
      sketch.textSize(16);
      sketch.fill(255, 255, 255);
      sketch.text(
        this.params[0]["enter the name"],
        this.x + this.sizex / 4,
        this.y - 2
      );
      
      this.button = sketch.createButton("edit");
      this.button.position(this.x + this.sizex / 4, this.y + this.sizey);
      this.button.mousePressed(changeBG);
    };
    function changeBG() {
      const a = prompt("hello");
    }
  };
}
