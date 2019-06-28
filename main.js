var orig = $context.link || $context.text || $context.image || $clipboard.link || $clipboard.text || $clipboard.image
if (orig == undefined) {
  orig = "Failed to get input"
}
var trans = require('scripts/translate')
if (typeof (orig) === "string") {
  var reg = /https?:\/\/.*?\.(gif|png|jpg)/gi
  if (orig.match(reg)) {
    $ui.alert("Please do not support image links for the time being, so stay tuned!")
  } else {
    trans.translateView(orig)
  }
} else {
  $ui.alert("input: " + orig + ";\ntype: " + typeof (orig))
  $ui.alert("Please do not support this format for the time being, so stay tuned!")
}