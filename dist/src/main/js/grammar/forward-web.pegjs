{

  // When true, the parser will output information about the execution of rules
  var debug = false;
}


start = template_directive:template_directive { return new Template(template_directive)}

/*
template_directive =
	_? "<%" _? "template" _ template_name: template_name _? "%>" _? template_body:template_body _? end_template_directive? _?
	{
    	return {
        	directive_type : "TemplateDirective",
            directive_name : template_name,
            children : template_body
        }
    }
*/

template_directive =
	_? "<%" _? "template" _ template_name: template_name _? "%>" _? template_body:template_body _? end_template_directive? _?
	{
    	return new TemplateDirective(template_name, template_body);
    }


end_template_directive = "<%" _? "end" _? "template" _? "%>"
    
/*
template_body = init_or_refresh_sequence:(refresh_directive _? / init_directive _?)* unit_template:unit_template
	{	
    	var result = [];
    	for (var i = 0; i< init_or_refresh_sequence.length; i++) {
        	result.push(init_or_refresh_sequence[i][0])
        }
        
        result.push(unit_template)
    	return result
    }
*/

template_body = init_or_refresh_sequence:(refresh_directive _? / init_directive _?)* unit_template:unit_template
   	{
        var result;
        var current = null;
        if ( init_or_refresh_sequence.length > 0 ) {
            current = init_or_refresh_sequence[0][0];
            result = [current];
        }
        for (var i = 1; i< init_or_refresh_sequence.length; i++) {
            //result.push(init_or_refresh_sequence[i][0]);
            var temporary_var = init_or_refresh_sequence[i][0];
            current.addChild(temporary_var);
            current = temporary_var;
        }
        if (current === null) {
            result = [unit_template]
        }
        else {
            current.addChild(unit_template);
        }
        return result;
    }
unit_template =
    "<%" _? "html" _? attributes:json_content? _? "%>" _? html:html_content _? "<%" _? "end" _? "html" _? "%>"
        {
            return new HtmlUnitDirective(html, attributes);
        }
    /
	"<%" _? "unit" _? unit:unit_name _? attributes:json_content? _? "%>" _? json:json_content _? "<%" _? "end" _? "unit" _? "%>"
        {
            if (debug) {
                console.log("unit_template", location());
            }

            return new JsonUnitDirective(unit, json, attributes);
        }
    
/*
refresh_directive = "<%" _? "refresh" _? var_name:var_name _? "=" expression:expression _? "%>" {
	return {
    	directive_type : "RefreshDirective",
    	variable_name :  var_name,
        expression : expression
    }
}
*/

refresh_directive = "<%" _? "refresh" _? var_name:var_name _? "=" expression:expression _? "%>" {
	return new RefreshDirective(var_name, new ExpressionDirective(expression));
}
    / "<%" _? "let" _? var_name:var_name _? "=" expression:expression _? "%>" {
    return new RefreshDirective(var_name, new ExpressionDirective(expression));
 }

// TODO: fix init_directive (similarly to refresh_directive)
init_directive = "<%" _? "init" _? var_name:var_name _? "=" expression:expression _? "%>" {
	return {
    	directive_type : "InitDirective",
    	variable_name :  var_name,
        expression : expression
    }
}

var_name = n:name d:digit? { return d===null? n : n+String(d); }

name = step

template_name = name

expression = plain_function / pe:path_expression {return new Path(pe)}


plain_function = _ ? function_name :step "(" args: plain_function_arg* ")" _? ";"? _ ?
        {
            var path_list = []
            for (var i=0; i < args.length; i++) {
                path_list.push(args[i]);
            }
           return  new PlainFunction(function_name, path_list);
        }
plain_function_arg = arg:(parsed_path / attribute_value) {

    console.log(arg);
    return arg;
}

parsed_path = p: path {
    return new Path(p);
}

path_expression = path

path = 
	_ ? head: step array_step: (array_step)* tail:("." step (array_step)*)* _ ?{


      var result = [new TupleNav(head)];
      
       for (var i = 0; i<array_step.length ; i++) {
          result.push(new ArrayNav(array_step[i]));
      }
      for (var i = 0; i<tail.length ; i++) {
          result.push(new TupleNav(tail[i][1]));
          for (var j = 0 ; j< tail[i][2].length ; j++) {
          		result.push(new ArrayNav(tail[i][2][j]))
          }
      }
      return result
    }


array_step =
	"[" d:digit "]" {return parseInt(d.join(""), 10);}

digit = [0-9]+

step = c:char+ {return c.join("")}

char = [a-zA-Z_]
dash = "-"

_ "whitespace"
  = [ \t\n\r]+

start_brace = "{"
end_brace = "}"
start_array_block = "["
end_array_block = "]"

unit_name = name_arr:(char / dash)+
{
    return name_arr.join("");
}
  
html_content = (comment / balanced_tag / self_closing_tag / text / print_directive / bind_directive/ html_for_directive / unit_template)*

// START JSON -----------------------------------------------------------------
json_content = _? start_brace _? elements:json_elements _? end_brace _?
    {
        return new JsonObjectDirective(elements);
    }

json_elements = _? parsed_elements:(json_element_with_comma)* _?
    {
        var json_elements = []
        var i = 0;
        for (i = 0; i < parsed_elements.length; i++) {
            json_elements.push(parsed_elements[i][1]);
            if (parsed_elements[i][0]) {
                i++;
                break;
            }
        }
        if (i != parsed_elements.length) {
            throw "ERROR, JSON elements are not separated with comma: ";
        }
        return json_elements;
    }

json_element_with_comma = _? element:json_element _? delimiter:(",")? _?
	{
    	var missingDelimiter = (delimiter == null);
    	var isIfStatementDirectives = element["key"] == "if_statement_directive";
    	var isIfStatementDirectiveValue = element["value"] instanceof IfStatementDirective;

    	return [(missingDelimiter && !isIfStatementDirectives && !isIfStatementDirectiveValue), element];
    }

json_value =
    print_value:print_directive
        {
            return print_value;
        }
    /
    bind_directive:bind_directive
    {
        return bind_directive;
    }
    /
    action_directive:action_directive
    {

        return action_directive;
    }
    /
    value:json_content
        {
            return value;
        }
    /
    if_statement:json_value_if_statement_directive
        {
            return if_statement;
        }
    /
    list:json_list
        {
            return new JsonListDirective(list);
        }
    /
    value:attribute_value
        {
            return new ValueDirective(value);
        }
    /
    nested_unit:unit_template
        {
            return nested_unit;
        }

json_list_element_with_comma = _? list_element:json_value _? delimiter:(",")? _?
	{
    	return [delimiter == null, list_element];
    }

json_list = start_array_block _? parsed_list:(json_list_element_with_comma)* _? end_array_block
    {
        var list_values = [];
        var i = 0;
        for (i = 0; i < parsed_list.length; i++) {
            list_values.push(parsed_list[i][1]);
            if (parsed_list[i][0]) {
                i++;
                break;
            }
        }
        if (i != parsed_list.length) {
            throw "ERROR, LIST ELEMENTS ARE NOT SEPARATED WITH COMMA: ";
        }
        return list_values;
    }

json_element =
    _? key:attribute_name _? ":" _? value:json_content _?
        {
            return {"key": key, "value": value};
        }
    /
    _? key:attribute_name _? ":" _? value:"false" _?
            {
                return {"key": key, "value": new ValueDirective(value)};
            }
    /
    _? key:attribute_name _? ":" _? value:"true" _?
                {
                    return {"key": key, "value": new ValueDirective(value)};
                }
    /
    _? key:attribute_name _? ":" _? print_value:print_directive _?
        {
            return {"key": key, "value": print_value};
        }
    /
    _? key:attribute_name _? ":" _? bind_directive:bind_directive _?
        {
            return {"key": key, "value": bind_directive};
        }
    /

   _? key:attribute_name _? ":" _? action_directive:action_directive _?
       {
           return {"key": key, "value": action_directive};
       }

    /
    _? key:attribute_name _? ":" _? start_array_block _? for_directive:json_for_directive _? end_array_block _?
        {

            return {"key": key, "value": new JsonListDirective([for_directive])};
        }
    /
    _? key:attribute_name _? ":" _? list:json_list _?
        {
            return {"key": key, "value": new JsonListDirective(list)};
        }
    /
    _? key:attribute_name _? ":" _? value:attribute_value _?
        {
            return {"key": key, "value": new ValueDirective(value)};
        }
    /
    _? key:attribute_name _? ":" _? if_statement:json_value_if_statement_directive _?
        {
            // this is a single json key:value pair with key:if_statement
            // e.g.
            //      { ...,
            //        myKey: <% if cond %> 'val1' <% else %> 'val2' <% endif %>,
            //        ...
            //      }
            return {"key": key, "value": if_statement};
        }
    /
     _? key:attribute_name _? ":" _? nested_unit:unit_template _?
            {
                // this is a single json key:value pair with key:if_statement
                // e.g.
                //      { ...,
                //        myKey: <% if cond %> 'val1' <% else %> 'val2' <% endif %>,
                //        ...
                //      }

                return {"key": key, "value": nested_unit};
            }
    /
    _? if_statement:json_if_statement_directive _?
        {
            // this is (potentially) multiple json key:value pairs separated by if/elif/else statements
            // e.g.
            //      { ...,
            //        <% if cond %>
            //          key1: 'val1'
            //        <% else %>
            //          key2: 'val2'
            //        <% endif %>,
            //        ...
            //      }
            // NOTE: combining of these if-statements in the case where there are multiple on the same level is performed
            //       in the constructor for JsonObjectDirective constructor.
            return {"key": "if_statement_directive", "value": if_statement};
        }

json_for_directive = "<%" _? "for" _? v:var_name _? "in" _? e:expression "%>" _? json:json_content _? end_json_for_directive
    {
        return new ForDirective(v, new ExpressionDirective(e), [json]);
    }

end_json_for_directive = "<%" _? "end" _? "for" _? "%>"


json_if_statement_directive = if_directive:json_if_directive _? elif_directives:json_elif_directive* _? else_directive:json_else_directive? _? end_if_directive
    {
        var statements = []
        statements.push(if_directive);
        for (var i = 0; i < elif_directives.length; i++) {
            statements.push(elif_directives[i]);
        }
        if (else_directive != null) {
            statements.push(else_directive);
        }
        return new IfStatementDirective(statements);
    }

json_if_directive = "<%" _? "if" _? condition:condition _? "%>" _? elements:json_elements
    {
        return new IfDirective(condition, new JsonObjectDirective(elements));
    }

json_elif_directive = "<%" _? "elif" _? condition:condition _? "%>" _? elements:json_elements
    {
        return new ElifDirective(condition, new JsonObjectDirective(elements));
    }

json_else_directive = "<%" _? "else" _? "%>" _? elements:json_elements
    {
        return new ElseDirective(new JsonObjectDirective(elements));
    }

json_value_if_statement_directive = if_directive:json_value_if_directive _? elif_directives:json_value_elif_directive* _?
                                    else_directive:json_value_else_directive? _? end_if_directive
    {
        var statements = []
        statements.push(if_directive);
        for (var i = 0; i < elif_directives.length; i++) {
            statements.push(elif_directives[i]);
        }
        if (else_directive != null) {
            statements.push(else_directive);
        }
        return new IfStatementDirective(statements);
    }

json_value_if_directive = "<%" _? "if" _? condition:condition _? "%>" _? value:json_value
    {
        return new IfDirective(condition, value);
    }

json_value_elif_directive = "<%" _? "elif" _? condition:condition _? "%>" _? value:json_value
    {
        return new ElifDirective(condition, value);
    }

json_value_else_directive = "<%" _? "else" _? "%>" _? value:json_value
    {
        return new ElseDirective(value);
    }

end_if_directive = "<%" _? "end" _? "if" _? "%>"

condition =
    _? operand1:condition_operand _? operator:binary_condition_operator _? operand2:condition_operand _?
    {
        return new ConditionDirective(operand1, operator, operand2);
    }
    /
    _? operator:unary_condition_operator _? operand:condition_operand _?
    {
        return new ConditionDirective(operand, operator);
    }
    /
    operand:condition_operand
    {
        return new ConditionDirective(operand);
    }

condition_operand =
    boolean_constant:("true" / "false")
    {
        return boolean_constant === "true" ? true : false;
    }
    /
    string_constant:quoted_attribute_value
    {
        return string_constant;
    }
    /
    number_constant:unquoted_attribute_value
    {
        // parseFloat will return an integer if the number string represents an integer.
        return parseFloat(number_constant);
    }
    /
    e:expression
    {
        return new ExpressionDirective(e);
    }

unary_condition_operator = "!"

// NOTE: order of declaration is important here (e.g. == before === will always match == before === even if === is seen)
binary_condition_operator = "<=" / "<" / ">=" / ">" / "===" / "==" / "!==" / "!="


// END JSON ------------------------------------------------------------------------------------------------------------------------------

html_for_directive = "<%" _? "for" _? v:var_name _? "in" _? e:expression "%>" _? html:html_content end_html_for_directive 
	{
    	return new ForDirective(v, new ExpressionDirective(e), html);
    }

end_html_for_directive = "<%" _? "end" _? "for" _? "%>"

print_directive =
    "<%=" e:expression "%>"
    {
        return new PrintDirective(new ExpressionDirective(e));
    }
    /
    "<%" _? "print" _? e:expression _? "%>"
    {
        return new PrintDirective(new ExpressionDirective(e));
    }

bind_directive =
     "<%" _? "bind" _? e:expression _? "%>"
     {
         return new BindDirective(new ExpressionDirective(e));
     }

action_directive =
    "<%" _? "action" _? e:expression _? "%>"
    {
        return new ActionDirective(new ExpressionDirective(e));
    }

comment = "<!--" c:(!"-->" c:. {return c})* "-->" {
    return {
        type: 'Comment',
        content: c.join('')
    };
}

balanced_tag = _? startTag:start_tag content:html_content endTag:end_tag _? {
    if (debug) {
        console.log('balanced',  location(), content);
    }
    if (startTag.name != endTag) {
        throw new Error("Expected </" + startTag.name + "> but </" + endTag + "> found.");
    }
 
    return new HtmlBalancedTagElement(startTag.name, content, startTag.attributes);
  }

self_closing_tag = "<" name:tag_name attributes:attributes* "/>" {


    var attributes_dict = {};
    for (var i = 0; i< attributes.length; i++) {
        attributes_dict[attributes[i][0].name] = attributes[i][0].value;
    }
    return new HtmlSelfTagClosingElement(name, attributes_dict);
  }
 
start_tag = "<" name:tag_name attributes:attributes* ">" {

    if (debug) {
        console.log('start_tag', location());
    }
    var attributes_dict = {};
    for (var i = 0; i< attributes.length; i++) {
        attributes_dict[attributes[i][0].name] = attributes[i][0].value;
    }

    return {
        name: name,
        attributes: attributes_dict
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

attribute_name = chars:[a-zA-Z0-9\-\_]+ {

    if (debug) {
        console.log('attribute_name', location());
    }
    return chars.join("");
}

attribute_value = (quoted_attribute_value / unquoted_attribute_value)

quoted_attribute_value = value:quoted_string { return value; }

unquoted_attribute_value =
    negative:negative_sign? float_value:float_value
    {
        if (negative != null) {
            float_value = "".concat(negative, float_value);
        }
        return Number(float_value);
    }
    /
    negative:negative_sign? integer_value:integer_value
    {
        if (negative != null) {
            integer_value = "".concat(negative, integer_value);
        }
        return Number(integer_value);
    }

float_value = integer_digits:decimal_digit* "." float_digits:decimal_digit*
    {
        return integer_digits.join("").concat(".").concat(float_digits.join(""));
    }
integer_value = integer_digits:decimal_digit+
    {
        return integer_digits.join("");
    }

tag_name = chars:[a-zA-Z0-9]+ {

    if (debug) {
        console.log('tag_name', location());
    }
    return chars.join(""); }


text = chars:[^<]+ {
    var cs =  chars.join("").trim();
    if (debug) {
        console.log('text', cs , location());
    }
    if (cs !== "") {
        return new ValueDirective(cs);
    }
}

negative_sign = "-"

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
