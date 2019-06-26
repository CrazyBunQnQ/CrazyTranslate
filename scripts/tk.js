var homeURL = "https://translate.google.cn"
var regex = /tkk:'(\d+\.\d+)'/gi;

function getTK() {
    console.log(homeURL)
    $http.get({
        url: homeURL,
        handler: function (resp) {
            var data = resp.data;
            // console.log(data)
            var tkk = regex.exec(data)
            console.log(tkk[1])
            getTK2("hello", tkk)
        }
    });
}

function getTK2(s, tkk) {
    var a = ascii(s)
    var e = new Array()
    for (let f, g = 0; g < a.length; g++) {
        var m = a[g]
        if (128 > m) {
            var ff = f
            f ++
            e = fill(e, ff, m)
        } else {
            
        }
    }
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
        console.log("v: " + v + "; i64: " + i64)
        ints[i] = i64
    }
    return ints
}

module.exports = {
    getTK: getTK
}