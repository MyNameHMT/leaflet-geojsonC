import * as L from 'leaflet'
import './L.canvasLayer'
L.GeojsonLayer = (L.Layer ? L.Layer : L.Class).extend({
  options: {
    color: '#65f1be',
    data: []
  },
  map: null,
  canvasLayer: null,
  ctx: null,
  bezierArr: [],
  linarr: [],
  initialize: function (options) {
    L.setOptions(this, options)
  },
  setData: function (data) {
    this.options.data = data || []
    this.needRedraw()
  },
  onAdd: function onAdd(map) {
    this.canvasLayer = L.canvasLayer().delegate(this)
    this.canvasLayer.addTo(map)
    this.map = map
    this.ctx = this.canvasLayer._canvas.getContext('2d')
    // let canvas = this.canvasLayer._canvas
    this.data = this.options.data
  },
  onDrawLayer: function (info) {
    var data = this.options.data
    var canvas = this.canvas = info.canvas
    var ctx = this.ctx = info.canvas.getContext('2d')
    var map = this.map = info.layer._map
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(data) {
      for (const item of data) {
        const { geometry: {type: types, coordinates} } = item
        if (types === "LineString") {
          let arr = []
          for (const iterator of coordinates) {
           arr.push(map.latLngToContainerPoint(iterator)) 
          }
          this.linarr = arr
          this.drawBezier(ctx, arr)
        }
        break
      }
    }
  },
  bezier: function(t) {
    var x = 0,
        y = 0,
        self = this,
        data = this.linarr,
        n = data.length - 1
    data.forEach(function(item, index) {
      if(!index) {
        x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
      } else {
          x += self.factorial(n) / self.factorial(index) / self.factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
          y += self.factorial(n) / self.factorial(index) / self.factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
      }
    })
    return {
      x: x,
      y: y
    }
  },
  drawBezier: function(ctx, data) { //通过控制点算出实时xy值渲染到canvas
    var nodeArr = data
    if(nodeArr.length === 2) {
        var startNode = nodeArr[0],
            endNode = nodeArr[1]
        ctx.moveTo(startNode.x, startNode.y)
        ctx.lineTo(endNode.x, endNode.y)
        ctx.strokeStyle = this.options.color
        ctx.stroke()
    } else if(nodeArr.length === 3) {
        var startNode = nodeArr[0],
            ctrlNode = nodeArr[1],
            endNode = nodeArr[2]
        ctx.beginPath()
        ctx.moveTo(startNode.x, startNode.y)
        ctx.quadraticCurveTo(ctrlNode.x, ctrlNode.y, endNode.x, endNode.y)
        ctx.strokeStyle = this.options.color
        ctx.stroke()
    } else if(nodeArr.length === 4) {
        var startNode = nodeArr[0],
            ctrlNodeA = nodeArr[1],
            ctrlNodeB = nodeArr[2],
            endNode = nodeArr[3]
        ctx.beginPath()
        ctx.moveTo(startNode.x, startNode.y)
        ctx.bezierCurveTo(ctrlNodeA.x, ctrlNodeA.y, ctrlNodeB.x, ctrlNodeB.y, endNode.x, endNode.y)
        ctx.strokeStyle = this.options.color
        ctx.stroke()
    } else {
      var ctx = ctx,
          self = this
      for(var i = 0; i < 1; i+=0.1) {
          this.bezierArr.push(this.bezier(i))
      }
      this.bezierArr.forEach(function(obj, index) {
        if (index) {
          var startX = self.bezierArr[index - 1].x,
              startY = self.bezierArr[index - 1].y,
              x = obj.x,
              y = obj.y
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = self.color
          ctx.stroke()
        }
      })
    }   
  },
  factorial: function(num) {
    if (num <= 1) {
      return 1;
    } else {
        return num * this.factorial(num - 1)
    }
  }
})

export var GeojsonLayer = function (options) {
  return new L.GeojsonLayer(options)
}