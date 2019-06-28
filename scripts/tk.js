var homeURL = "https://translate.google.cn"
var regex = /tkk:'(\d+\.\d+)'/gi;

function getTK() {
    $http.get({
        url: homeURL,
        handler: function (resp) {
            var data = resp.data;
            var tkk = regex.exec(data)[1]
            console.log("tkk=" + tkk)
            var tk = getTK2("hello", tkk)
            console.log("tk=" + tk)
        }
    });
}

function getTK2(s, tkk) {
    var a = ascii(s)
    var e = new Array()
    for (var f = 0, g = 0; g < a.length; g++) {
        var m = a[g]
        var ff
        if (128 > m) {
            ff = f
            f++
            e = fill(e, ff, m)
        } else {
            if (2048 > m) {
                ff = f
                f++
                e = fill(e, ff, m >> 6 | 192)
            } else {
                if (55296 == (m & 64512) && g + 1 < a.length && 56320 == parseInt(a[g + 1]) & 64512) {
                    g++
                    m = 65536 + ((m & 1023) << 10) + (parseInt(a[g]) & 1023)
                    ff = f
                    f++
                    e = fill(e, ff, m >> 18 | 240)
                    ff = f
                    f++
                    e = fill(e, ff, m >> 12 & 63 | 128)
                } else {
                    ff = f
                    f++
                    e = fill(e, ff, m >> 12 | 224)
                    ff = f
                    f++
                    e = fill(e, ff, m >> 6 & 63 | 128)
                    ff = f
                    f++
                    e = fill(e, ff, m & 63 | 128)
                }
            }
        }
    }

    var ka = suint32(tkk.split('.')[0])
    var kb = suint32(tkk.split(".")[1])
    var Sb = "+-a^+6"
    var Zb = "+-3^+b+-f"

    var aa = ka
    for (var f = 0; f < e.length; f++) {
        aa += e[f]
        aa = r(aa, Sb)
    }
    aa = r(aa, Zb)
    aa = (aa ^ kb) >>> 0
    aa = aa % 1E6
    return aa + "." + ((aa ^ ka) >>> 0)
}

function r(a, b) {
    var t = "a"
    var Yb = "+"
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b[c + 2] + ""
        var dd
        if (d >= t) {
            dd = d[0].charCodeAt(0) - 87
        } else {
            dd = suint32(d)
        }
        if ((b[c + 1] + "") == Yb) {
            dd = (a >>> dd) >>> 0
        } else {
            dd = (a << dd) >>> 0
        }
        if ((b[c] + "") == Yb) {
            a = a + (dd & 4294967295) >>> 0
        } else {
            a = (a ^ dd) >>> 0
        }
    }
    return a
}

function suint32(s) {
    return uint32(parseInt(s))
}

function uint32(a) {
    return a
}

function int(a) {
    return a
}

function fill(slice, index, value) {
    while (slice.length <= index) {
        slice[slice.length] = 0
    }
    slice[index] = value
    return slice
}

function ascii(s) {
    var ints = new Array()
    for (let i = 0; i < s.length; i++) {
        var v = s.charAt(i)
        var i64 = v.charCodeAt(0);
        ints[i] = i64
    }
    return ints
}

module.exports = {
    getTK: getTK
}
