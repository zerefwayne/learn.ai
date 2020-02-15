export default function(sketch) {
  return function FlattenLayer(type, x, y, sizex, sizey) {
    this.type = type;

    this.x = x;
    this.y = y;
    this.sizex = sizex;
    this.sizey = sizey;
    this.radius = 4;
    this.button;

    this.returnData = function() {
      return {
        type: this.type,
      };
    };

    this.propContent = function(ar) {
      const result = [];

      for (var i = 0; i < ar.length; i++) {
        const a = prompt(ar[i]);
        result.push({ [ar[i]]: a });
      }

      this.params = result;
    };

    this.rem = function() {
      if (this.button) {
        this.button.remove();
      }
    };

    this.display = function() {
      sketch.noStroke();

      sketch.fill(255, 255, 255);
      sketch.rect(this.x, this.y, this.sizex, this.sizey, this.radius);
      // sketch.rect(
      //   this.x + this.sizex + 5,
      //   this.y + this.sizey / 4,
      //   this.sizex / 2,
      //   this.sizey / 2,
      //   this.radius
      // );

      sketch.textSize(14);
      sketch.fill(255, 255, 255);
      sketch.text(
        this.type,
        this.x + this.sizex / 4,
        this.y - 2
      );
      // sketch.text(
      //   this.params[2]["Activation Type"],
      //   this.x + this.sizex + this.sizex / 2,
      //   this.y - 2
      // );
      this.button = sketch.createButton("edit");
      this.button.position(
        this.x + this.sizex / 2 + this.sizex / 3,
        this.y + this.sizey
      );
      this.button.mousePressed(changeBG);
    };

    function changeBG() {
      const a = prompt("hello");
    }
  };
}
