class PFac {
  // Using object destructuring in static methods

  static vpts({ x = 0, n = 20 } = {}) {
    let rs = [];
    for (let i = 0; i < n; i++) {
      let _x = x;
      let _y = (i * height) / n;
      rs.push({ x: _x, y: _y });
    }
    return rs;
  }

  static path_pts({x=0,y=0,t=0,step=10,n=20} = {}) {
    let rs = [];
    let _x = x, _y = y
    for(let i=0;i<n;i++) {
      let ang = noise(_x,_y,t) * TWO_PI
      _x += cos(ang)*step
      _y += sin(ang)*step
      rs.push(createVector(_x,_y))
      //t += 0.1
    }
    return rs;
  }

  static random_around({ x=0, y=0, r = 50, randomness = 0.25, n = 40 } = {}) {
    let points = [];
    for (let i = 0; i < n; i++) {
      let angle = (i * TWO_PI) / n; // Increment angle systematically
      let adjustedDistance = r * random(1 - randomness, 1 + randomness);
      let _x = x + adjustedDistance * cos(angle);
      let _y = y + adjustedDistance * sin(angle);
      points.push({ x: _x, y: _y });
    }
    return points;
  }

  static random_ring({
    x,
    y,
    r1 = 50,
    r2 = 100,
    randomness = 0.25,
    n = 8,
  } = {}) {
    let points = [];
    for (let i = 0; i < n; i++) {
      let angle = (i * TWO_PI) / n;
      let adjustedDistance = r1 + (r2 - r1) * random(-randomness, randomness);
      let _x = x + adjustedDistance * cos(angle);
      let _y = y + adjustedDistance * sin(angle);
      points.push({ x: _x, y: _y });
    }
    return points;
  }
}
