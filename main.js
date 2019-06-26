var orig = $context.link || $context.text || $context.image || $clipboard.link || $clipboard.text || $clipboard.image
if (orig == undefined) {
  orig = "未获取到输入内容"
}
var trans = require('scripts/translate')
if (typeof (orig) === "string") {
  var reg = /https?:\/\/.*?\.(gif|png|jpg)/gi
  if (orig.match(reg)) {
    $ui.alert("暂时不支持图片链接，敬请期待！")
  } else {
    trans.translateView(orig)
  }
} else {
  $ui.alert("input: " + orig + ";\ntype: " + typeof (orig))
  $ui.alert("暂时不支持此格式，敬请期待！")
}
