
path =
	_ ? head: tuple_navigation_or_root array_nav:(array_navigation)* tail:("." tuple_navigation (array_navigation)*)* _ ?{
      var result = [head];

       for (var i = 0; i<array_nav.length ; i++) {
          result.push(array_nav[i]);
      }
      for (var i = 0; i<tail.length ; i++) {
          result.push(tail[i][1]);
          for (var j = 0 ; j< tail[i][2].length ; j++) {
          		result.push(tail[i][2][j]);
          }
      }
      return result}


tuple_navigation_or_root = tuple_navigation / root

root = "^" {return new Root();}

array_navigation =
	"[" d:digit "]" {return new ArrayNav(parseInt(d.join(""), 10));}

digit = [0-9]+

tuple_navigation = c:char+ d:digit? cl:char? {
  if (d & cl) {
   	return new TupleNav(c.join("")+d.join()+cl.join(""));
  }
  else if (d) {
  	return new TupleNav(c.join("")+d.join());
  }
  else {
  	return new TupleNav(c.join(""));
  }
}

char = [a-zA-Z_]

_ "whitespace"
  = [ \t\n\r]+
