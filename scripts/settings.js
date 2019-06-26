var setData = [
  ["General Text", ["Baidu", "Tencent", "Sogou", "Youdao"]],
  ["Handwriting",["Tencent"]],
  ["ID Card", ["Baidu", "Tencent"]],
  ["Business Card", ["Tencent"]],
  ["Bank Card", ["Baidu", "Tencent"]],
  ["Plate Number", ["Baidu", "Tencent"]],
  ["Driving License", ["Baidu", "Tencent"]],
  ["Vehicle License", ["Baidu", "Tencent"]],
  ["Business License", ["Baidu", "Tencent"]],
  ["Invoice",["Baidu"]],
  ["Passport",["Baidu"]]
]



function setServer(){
  console.log("settings.setServer")
  return JSON.parse($file.read("assets/settings.json").string)
}
var setServers = setServer()

function listData() {
  console.log("settings.listData")
  var data = []
  for (var i in setData) {
    var server = []
    for (var k in setData[i][1]) {
      if( k == setServers[i]){
        var cSName = "√"
      }else{
        var cSName = ""
      }
      server.push({
        serverName: {
          text: setData[i][1][k]
        },
        cServer: {text: cSName
        }
      })
    }
    data.push({
      title: setData[i][0],
      rows: server
    })
  }
  return data
}

var lData = listData()


function settings() {
  console.log("settings.settings")
  $ui.push({
    props: {
      title: "Settings"
    },
    views: [{
      type: "list",
      props: {
        id: "",
        data: lData,
        template: [{
            type: "label",
            props: {
              id: "serverName",
              textColor: $color("black"),
              align: $align.center,
              font: $font(12)
            },
            layout: function(make, view) {
              make.centerY.equalTo(view.super.centerY)
              make.left.inset(15)
            }
          },{
            type: "label",
            props: {
              id: "cServer",
              textColor: $color("black"),
              align: $align.center,
              font: $font(12)
            },
            layout: function(make, view) {
              make.centerY.equalTo(view.super.centerY)
              make.right.inset(15)
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          setServers[indexPath.section] = indexPath.row
          $file.write({
            data: $data({string: JSON.stringify(setServers)}),
            path: "assets/settings.json"
          })
          $("list").data = listData()
          lData = $("list").data
          var ocr = require('scripts/ocr')
          ocr.setUpdate()
        }
      }
    }]
  })
}

module.exports = {
  settings: settings
}
