path_signature=
	_ ? head: root? tuple_nav:(tuple_navigation_or_tuple_star)* array_nav:(array_navigation_or_array_star)* tail:("." tuple_navigation_or_tuple_star (array_navigation_or_array_star)*)* _ ?{


      var result = []
      if (head !== null) {
        result.push(head);
      }

      for (var i = 0; i<tuple_nav.length ; i++) {
          result.push(tuple_nav[i]);
      }
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


root = "^" {return new Root();}


tuple_navigation_or_tuple_star = tuple_star / tuple_navigation

tuple_star = "*" {return new TupleStar();}

array_navigation_or_array_star= array_navigation / array_star

array_star = "[*]" {return new ArrayStar()};

array_navigation =
	"[" d:digit "]" {return new ArrayNav(parseInt(d.join(""), 10)); }

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



