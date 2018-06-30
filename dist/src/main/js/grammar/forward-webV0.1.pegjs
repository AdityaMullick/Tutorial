start = template_directive


template_directive =
	_? "<%" _? "template" _ template_name: template_name _? "%>" _? template_body:template_body _? end_template_directive? _?
	{
    	return {
        	directive_type : "TemplateDirective",
            directive_name : template_name,
            children : template_body
        }
    }





end_template_directive = "<%" _? "end" _? "template" _? "%>" 
    
template_body = init_or_refresh_sequence:(refresh_directive _? / init_directive _?)* unit_template:unit_template
	{	
    	var result = [];
    	for (var i = 0; i< init_or_refresh_sequence.length; i++) {
        	result.push(init_or_refresh_sequence[i][0])
        }
        
        result.push(unit_template)
    	return result
    }
    
unit_template = "<%" _? "html" _? "%>" _? html:html_content _? "<%" _? "end" _? "html" _? "%>" 
	{
		return {directive_type : "HtmlUnitDirective", children: html}
	}
    
refresh_directive = "<%" _? "refresh" _? var_name:var_name _? "=" expression:expression _? "%>" {
	return {
    	directive_type : "RefreshDirective",
    	variable_name :  var_name,
        expression : expression
    }
}

init_directive = "<%" _? "init" _? var_name:var_name _? "=" expression:expression _? "%>" {
	return {
    	directive_type : "InitDirective",
    	variable_name :  var_name,
        expression : expression
    }
}

var_name = name

name = step

template_name = name

expression = pe:path_expression {return {type: "PathExpression", paths:pe}}

path_expression = path

path = 
	_ ? head: step array_step: (array_step)* tail:("." step (array_step)*)* _ ?{
      var result = [{step:head, type: 'PathStep'}]
      
       for (var i = 0; i<array_step.length ; i++) {
          result.push({step:array_step[i], type: 'ArrayNav'})
      }
      for (var i = 0; i<tail.length ; i++) {
          result.push({step:tail[i][1], type: 'PathStep'})
          for (var j = 0 ; j< tail[i][2].length ; j++) {
          		result.push({step:tail[i][2][j], type: 'ArrayNav'})
          }
      }
      return result}


array_step =
	"[" d:digit "]" {return "["+d.join("")+"]"}

digit = [0-9]+

step = c:char+ {return c.join("")}

char = [a-zA-Z_]

_ "whitespace"
  = [ \t\n\r]+
  
  
html_content = (comment / balanced_tag / self_closing_tag / text / print_directive / html_for_directive)*

html_for_directive = "<%" _? "for" _? v:var_name _? "in" _? e:expression "%>" _? html:html_content end_html_for_directive 
	{
    	return {directive_type: "ForDirective", for_loop_variable: v, expression:e, children: html}
    }

end_html_for_directive = "<%" _? "end" _? "for" _? "%>" 

print_directive = "<%=" e:expression "%>" {return {directive_type: "PrintDirective", expression: e}}

comment = "<!--" c:(!"-->" c:. {return c})* "-->" {
    return {
        type: 'Comment',
        content: c.join('')
    };
}
 
balanced_tag = startTag:start_tag content:html_content endTag:end_tag {
    if (startTag.name != endTag) {
        throw new Error("Expected </" + startTag.name + "> but </" + endTag + "> found.");
    }
 
    return {
      type: 'BalancedTag',
      name: startTag.name,
      attributes: startTag.attributes,
      content: content
    };
  }

self_closing_tag = "<" name:tag_name attributes:attributes* "/>" {
    return {
      type: 'SelfClosingTag',
      name: name,
      attributes: attributes
    };
  }
 
start_tag = "<" name:tag_name attributes:attributes* ">" {
  return { 
    name: name,
    attributes: attributes
  }
}
 
end_tag = "</" name:tag_name ">" { return name; }

attributes = " " attributes:attribute* { return attributes; }

attribute = (valued_attribute / valueless_attribute)

valued_attribute = name:attribute_name "=" value:attribute_value {
  return {
    name: name,
    value: value
  };
}

valueless_attribute = name:attribute_name {
  return {
    name: name,
    value: null
  };
}

attribute_name = chars:[a-zA-Z0-9\-]+ { return chars.join(""); }
attribute_value = (quoted_attribute_value / unquoted_attribute_value)

quoted_attribute_value = value:quoted_string { return value; }

unquoted_attribute_value = value:decimal_digit* { return value.join(''); }
 
tag_name = chars:[a-zA-Z0-9]+ { return chars.join(""); }

text = chars:[^]+ {
  return {
    type: 'ValueDirective',
    content: chars.join("")
  };
}

decimal_digit = [0-9]

quoted_string
  = "\"\"\"" d:(string_data / "'" / $("\"" "\""? !"\""))+ "\"\"\"" {
      return d.join('');
    }
  / "'''" d:(string_data / "\"" / "#" / $("'" "'"? !"'"))+ "'''" {
      return d.join('');
    }
  / "\"" d:(string_data / "'")* "\"" { return d.join(''); }
  / "'" d:(string_data / "\"" / "#")* "'" { return d.join(''); }
string_data
    = [^"'\\#]
    / "\\0" !decimal_digit { '\0' }
    / "\\0" &decimal_digit { throw new SyntaxError ['string data'], 'octal escape sequence', offset(), line(), column() }
    / "\\b" { '\b' }
    / "\\t" { '\t' }
    / "\\n" { '\n' }
    / "\\v" { '\v' }
    / "\\f" { '\f' }
    / "\\r" { '\r' }
    / "\\" c:. { c }
    / c:"#" !"{" { c }