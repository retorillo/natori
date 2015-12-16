# Natori

Customizable random name generator. Try from [here](http://retorillo.github.io/natori)

## Node.js

```javascript
const natori = require('natori');
var testDate = new Date('2015-12-16');
var nameGen = new natori.Expander('{year:2}{month:2}{day:2}', testDate);
var passGen = new natori.Expander('{rcase:{rand:12}}');
console.log(nameGen.expand());
console.log(passGen.expand());
```

## Natori Syntax 

Syntax       | Description
-------------|--------------------------------------------------------------------------------------------
{lcase: ...} | Changes to lower case. For example, `{lcase:{randa:4}}`
{ucase: ...} | Changes to upper case. For example, `{ucase:{randa:4}}`
{rcase: ...} | Changes to lower or upper case randomly. For example, {rcase:{randa:4}}
{rand:n}     | Randomly outputs n-length text that is composed of a-z and 0-9. By default, `n` is 3.
{randn:n}    | Randomly outputs n-length text that is composed of 0-9. By default, `n` is 3.
{randa:n}    | Randomly outputs n-length text that is composed of a-z. By default, `n` is 3.
{year:n}     | Outputs digits of year. Retrieve lower 2 digits of year to specify 2 for `n`. By default, `n` is 4.
{month:n}    | Outputs digits of month(1-12). `n` is 'padleft'. By default, `n` is 2.
{day:n}      | Outputs digits of days(1-31). Same as the above.
{hour:n}     | Outputs digits of hours(1-24). Same as the above.
{min:n}      | Outputs digits of minutes(0-59). Same as the above.
{sec:n}      | Outputs digits of seconds(0-59). Same as the above.
{msec:n}     | Outputs digits of milliseconds(0-999). Same as the above excluding `n` is 3 by default.
{week}       | Outputs short week name (sun-sat)

# The MIT Liscense

natori.js is distributed on The MIT Liscense.
