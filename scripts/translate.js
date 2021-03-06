var colorData = [
  [$color("#fd354a"), $color("#da0a6f")],
  [$color("#f97227"), $color("#f52156")],
  [$color("#edb319"), $color("#e47b18")],
  [$color("#eecb01"), $color("#e8a400")],
  [$color("#7ace1e"), $color("#5aba23")],
  [$color("#25c578"), $color("#3ab523")],
  [$color("#24d59a"), $color("#24bb9d")],
  [$color("#00c0c8"), $color("#00a0ca")],
  [$color("#12b7de"), $color("#2193e6")],
  [$color("#2f74e0"), $color("#5d44e0")],
  [$color("#825af6"), $color("#6251f5")],
  [$color("#cc3ec8"), $color("#9f0cdd")]
]
var dt = [
  'at', // 替代翻译
  'bd', // 字典，以防源文本是一个单词（您可以获得文章翻译，反向翻译等）
  'ex', // 例句
  'ld', // 
  'md', // 源文本的定义，如果它是一个单词
  'qca', //
  'rw', // 另见清单
  // 'rm', // 源和翻译文本的转录/音译
  'ss', // 源文本的同义词，如果它是一个单词
  't' // 源文本的翻译
]
var homeURL = "https://translate.google.cn"
var tkkRegex = /tkk:'(\d+\.\d+)'/gi;

function randomColor(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range);
  return num;
}

function translateView(orig) {
  // $ui.push({
  $ui.render({
    props: {
      title: "CrazyTranslate"
    },
    views: [{
      type: "gradient",
      props: {
        locations: [0.0, 1.0],
        startPoint: $point(0, 0),
        endPoint: $point(1, 1),
        colors: colorData[randomColor(0, 11)]
      },
      views: [{
        type: "text",
        props: {
          id: "textBg",
          bgcolor: $color("clear"),
          textColor: $color("white"),
          text: orig,
        },
        layout: function (make, view) {
          make.edges.insets($insets(40, 10, 10, 10))
        },
        events: {
          didChange: function (sender) {
            orig = $("textBg").text
          }
        }
      }, {
        type: "button",
        props: {
          id: "copyBt",
          icon: $icon("019", $color("white")),
          bgcolor: $color("clear"),
        },
        layout: function (make, view) {
          make.top.inset(10)
          make.right.inset(10)
        },
        events: {
          tapped: function (sender) {
            $clipboard.text = $("textBg").text
            $ui.alert("文本已复制")
          }
        }
      }, {
        type: "button",
        props: {
          id: "origBt",
          icon: $icon("021", $color("white")),
          bgcolor: $color("clear"),
          hidden: true
        },
        layout: function (make, view) {
          make.top.inset(10)
          make.right.equalTo($("copyBt").right).inset(35)
        },
        events: {
          tapped: function (sender) {
            $("textBg").text = orig
            $("transBt").hidden = false
            $("origBt").hidden = true
          }
        }
      }],
      layout: $layout.fill,
      events: {
        ready: function (sender) {
          translate(haveToGetTK())
        }
      }
    }]
  })
}

module.exports = {
  translateView: translateView
}

function translate(isGetTK) {
  $ui.loading("Translating...")
  if (isGetTK) {
    var transWord = $("textBg").text
    simpleTranslation()
    translateByTK(transWord)
  } else {
    simpleTranslation()
  }
}

function simpleTranslation() {
  var transLg = cnTest()
  $http.request({
    method: "POST",
    url: "https://translate.google.cn/translate_a/single",
    header: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      "dt": "t",
      "q": $("textBg").text,
      "tl": transLg,
      "ie": "UTF-8",
      "sl": "auto",
      "client": "ia",
      "dj": "1"
    },
    handler: function (resp) {
      $ui.loading(false)
      var data = resp.data.sentences
      var trans = ""
      for (var i in data) {
        trans = trans + data[i].trans + "\n"
      }
      $("textBg").text = trans
    }
  })
}

function detailedTranslation(tk, transWord) {
  var dtQueryString = ""
  for (var i = 0; i < dt.length; i++) {
    dtQueryString += "&dt="
    dtQueryString += dt[i]
  }
  $http.request({
    method: "POST",
    url: "https://translate.google.cn/translate_a/single?client=webapp&sl=auto&tl=zh-CN&hl=zh-CN" + dtQueryString + "&otf=1&ssel=0&tsel=0&kc=7&tk=" + tk + "&q=" + transWord,
    header: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    handler: function (resp) {
      $ui.loading(false)
      var data = resp.data
      console.log("data: " + data)
      showDetailedResult(data)
    }
  })
}

function showDetailedResult(body) {
  var result = ""
  for (var i = 0; i < body.length; i++) {
    var line = "data[" + i + "]=" + body[i] + "\n"
    console.log(line)
  }
  result += "中文翻译: "

  body[0].forEach(function (obj) {
    if (obj[0]) {
      result += obj[0];
    }
  })
  result += "\n\n"

  if (body[12]) {
    result += "英文释义: \n"
    for (var j = 0; j < body[12].length; j++) {
      var english = body[12][j]
      result += ("\n " + (j + 1) + ". " + english[0] + ": " + english[1][0][0] + "\n")
      result += ("     示例: " + english[1][0][2] + "\n")
    }
  }

  if (body[1]) {
    result += "\n近义词: \n"
    for (var j = 0; j < body[1].length; j++) {
      var jin = body[1][j]
      result += "\n " + (j + 1) + ". " + jin[0] + ": "
      for (var k = 0; k < jin.length; k++) {
        if (jin[1][k])
          result += (k == 0 ? jin[1][k] : (", " + jin[1][k]))
      }
    }
  }

  // console.log("body[2]=" + body[2] + ", body[8][0][0]=" + body[8][0][0])
  if (body[2] === body[8][0][0]) {
    // result.from.language.iso = body[2];
  } else {
    // result.from.language.didYouMean = true;
    // result.from.language.iso = body[8][0][0];
  }

  if (body[7])
    // console.log("body[7]=" + body[7] + ", body[7][0]=" + body[7][0])
    if (body[7] && body[7][0]) {
      var str = body[7][0];
      str = str.replace(/<b><i>/g, '[');
      str = str.replace(/<\/i><\/b>/g, ']');
      result.from.text.value = str;
      if (body[7][5] === true) {
        // result.from.text.autoCorrected = true;
      } else {
        // result.from.text.didYouMean = true;
      }
    }

  $("textBg").text = result
}

function translateByTK(transWord) {
  $http.get({
    url: homeURL,
    handler: function (resp) {
      var data = resp.data;
      var tkk = tkkRegex.exec(data)[1]
      // console.log("tkk=" + tkk)
      var tk = getTK(transWord, tkk)
      // console.log("tk=" + tk)
      detailedTranslation(tk, transWord)
    }
  });
}

function cnTest() {
  return hasCN() ? "en-US" : "zh-CN"
}

function hasCN() {
  var cn = new RegExp("[\u4e00-\u9fa5]+")
  var slang = cn.test($("textBg").text)
  return slang != 0
}

function isOneWord() {
  var notWord = /\W/gi
  var oneWord = notWord.test($("textBg").text)
  return oneWord == 0
}

function haveToGetTK() {
  if (hasCN()) return false
  return isOneWord()
}

function getTK(s, tkk) {
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
  for (f = 0; f < e.length; f++) {
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
