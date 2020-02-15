export default function(sketch) {
  return function Block(type, x, y, sizex, sizey) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.sizex = sizex;
    this.sizey = sizey;

    this.propContent = function(ar) {
      for (var i = 0; i < ar.length; i++) {
        const a = prompt(ar[i]);
      }
    };

    this.display = function() {
      if (type == "ellipse") {
        sketch.fill(250, 200, 200, 50);
        sketch.ellipse(this.x, this.y, sizex, sizey);
      } else if (type == "rectangle") {
        sketch.fill(250, 200, 200, 50);
        sketch.rect(this.x, this.y, sizex, sizey);
      }
    };
  };
}
