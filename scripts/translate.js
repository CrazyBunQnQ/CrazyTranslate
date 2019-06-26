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

function randomColor(Min,Max){
  console.log("translate.randomColor")
 var Range = Max - Min;
 var Rand = Math.random();
 var num = Min + Math.round(Rand * Range);
 return num;
}

function translateView(orig) {
  console.log("translate.translateView")
// $ui.push({
 $ui.render({
   props: {
     title: "翻译结果"
   },
   views: [{
     type: "gradient",
     props: {
       locations: [0.0, 1.0],
       startPoint: $point(0, 0),
       endPoint: $point(1, 1),
       colors: colorData[randomColor(0,11)]
     },
     views:[{
       type:"text",
     props:{
       id:"textBg",
       bgcolor:$color("clear"),
       textColor:$color("white"),
       text: orig,
     },
     layout: function(make, view){
       make.edges.insets($insets(40,10,10,10))
     },
     events: {
       didChange: function(sender){
         orig = $("textBg").text
       }
     }
     },{
       type:"button",
       props:{
         id:"copyBt",
         icon: $icon("019",$color("white")),
         bgcolor: $color("clear"),
       },
       layout: function(make, view){
         make.top.inset(10)
         make.right.inset(10)
       },
       events:{
         tapped: function(sender){
           $clipboard.text = $("textBg").text
           $ui.alert("文本已复制")
         }
       }
     },{
       type:"button",
       props:{
         id:"origBt",
         icon: $icon("021",$color("white")),
         bgcolor: $color("clear"),
         hidden: true
       },
       layout: function(make, view){
         make.top.inset(10)
         make.right.equalTo($("copyBt").right).inset(35)
       },
       events:{
         tapped: function(sender){
           $("textBg").text = orig
           $("transBt").hidden = false
           $("origBt").hidden = true
         }
       }
     }],
     layout: $layout.fill,
     events: {
       ready: function(sender) {
         translate()
       }
     }
   }]
 })
}


module.exports = {
 translateView: translateView
}

function translate() {
  console.log("translate.translate")
 $ui.loading("Translating...")
 var transLg = cnTest()
 $http.request({
   method: "POST",
   url: "http://translate.google.cn/translate_a/single",
   header: {
     "User-Agent": "iOSTranslate",
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
   handler: function(resp) {
     $ui.loading(false)
     var data = resp.data.sentences
     var trans = ""
     for (var i in data) {
       var trans = trans + data[i].trans + "\n"
     }
     $("textBg").text = trans
   }
 })
}

function cnTest() {
  console.log("translate.cnTest")
 var cn = new RegExp("[\u4e00-\u9fa5]+")
 var slang = cn.test($("textBg").text)
 if (slang == 0) {
   translang = "zh-CN"
 } else {
   translang = "en-US"
 }
 return translang
}
