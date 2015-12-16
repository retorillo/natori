/*! natori.js / The MIT Lisence (MIT) / Copyright (c) 2015 Retorill */
module.exports = {
	Expander: getExpander(),
}
function getExpander(undefined) {
	var max_depth = 1024;
	var wlist = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var alist = "abcdefghijklmnopqrstuvwxyz";
	var nlist = "0123456789"
	function randkey(clist, length) {
		var k = "";
		for (var n = 0; n < length; n++)
			k += clist[Math.round(Math.random() * (clist.length - 1))];
		return k;
	}
	function padleft(val, length) {
		return length >= val.toString().length ? (function (c, l) {
			for (var n = 0; n < l; n++) c += c[0];
			return c;
		}('0', length) + val).slice(-length) : val;
	}
	function safen(n, def, min, max) {
		if (n == null) return def;
		if (min != null && n < min) return min;
		if (max != null && n > max) return max;
		return n;
	}
	function rcase(g2) {
		var v = ""
		for (var c = 0; c < g2.length; c++)
			v += Math.round(Math.random() * 10) % 2 == 0 ? g2[c].toLowerCase() : g2[c].toUpperCase();
		return v;
	}
	function Expander(format, now) {
		var _self = this;
		_self.value = format;
		_self.depth = 0;
		_self.expand_s = function() {
			var affected = 0;
			_self.value = _self.value.replace(/{([a-z]+)(?::([^{}]+))?}/ig, function (m, g1, g2) {
				var n = g2 != null ? parseInt(g2) : null;
				affected++;
				switch (g1.toLowerCase()) {
					case "rcase":
						return rcase(g2);
					case "ucase":
						return g2.toUpperCase();
					case "lcase":
						return g2.toLowerCase();
					case "week":
						return wlist[now.getDay()];
					case "randn":
						return randkey(nlist, safen(n, 3));
					case "randa":
						return randkey(alist, safen(n, 3));
					case "rand":
						return randkey(alist + nlist, safen(n, 3));
					case "hour":
						return padleft(now.getHours(), safen(n, 2, 1));
					case "min":
						return padleft(now.getMinutes(), safen(n, 2, 1));
					case "sec":
						return padleft(now.getSeconds(), safen(n, 2, 1));
					case "msec":
						return padleft(now.getMilliseconds(), safen(n, 3, 1));
					case "year":
						var y = now.getFullYear().toString();
						if (n == 2) return y.substr(2, 2);
						else return y;
					case "day":
						return padleft(now.getDate(), safen(n, 2, 1));
					case "month":
						return padleft(now.getMonth() + 1, safen(n, 2, 1));
				}
				affected--;
				return m;
			});
			_self.depth++;
			return affected;
		}
		_self.expand = function () {
			for (var c = 0; c < max_depth; c++)
				if (_self.expand_s() == 0)
					break;
			return _self.value;
		}
	}
	return Expander;
}
