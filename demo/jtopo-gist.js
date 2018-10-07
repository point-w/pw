(function () {
  const JTopo = {
    SceneMode: {
      normal: "normal"
    },
    MouseCursor: {}
  }

  JTopo.util = {
    getEventPosition(e) {
      return e = this.mouseCoords(e)
    },
    mouseCoords(e) {
      return e = this.cloneEvent(e),
      e.pageX || (
        e.pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft,
          e.pageY = e.clientY + document.body.scrollTop - document.body.clientTop
      ),
        e
    },
    MessageBus: function (name) {
      const self = this

      this.name = name
      this.messageMap = {}
      this.messageCount = 0

      this.subscribe = function (eName, fn) {
        const fnArr = self.messageMap[eName]

        !fnArr && (self.messageMap[eName] = [])

        self.messageMap[eName].push(fn)
        self.messageCount++
      }
      this.unsubscribe = function (eName) {
        const fnArr = self.messageMap[eName]

        fnArr && (
          self.messageMap[eName] = null,
            delete self.messageMap[eName],
            self.messageCount--
        )
      }
      this.publish = function (eName, eObj, d) {
        const fnArr = self.messageMap[eName]

        if (fnArr) {
          for (let i = 0; i < fnArr.length; i++) {
            d
              ? !function (fn, eObj) {
                setTimeout(function () {
                  fn(eObj)
                }, 10)
              }(fnArr[i], eObj)
              : fnArr[i](eObj)
          }
        }
      }
    },
    clone(jsonObj) {
      const copyJsonObj = {}

      for (let key in jsonObj) {
        copyJsonObj[key] = jsonObj[key]
      }

      return copyJsonObj
    },
    cloneEvent(e) {
      const copyEventObj = {}

      for (let key in e) {
        // 不拷贝 "returnValue" 和 "keyLocation"
        "returnValue" != key && "keyLocation" != key && (copyEventObj[key] = e[key])
      }

      return copyEventObj
    },
    getElementsBound() {
      return eleBoundaryObj.width = eleBoundaryObj.right - eleBoundaryObj.left,
        eleBoundaryObj.height = eleBoundaryObj.bottom - eleBoundaryObj.top,
        eleBoundaryObj
    },
    getOffsetPosition(ele) {
      if (!ele) {
        return {
          left: 0,
          top: 0,
        }
      }

      var b = 0
      var c = 0

      // IE
      if ("getBoundingClientRect" in document.documentElement) {
        var d = ele.getBoundingClientRect()
        var e = ele.ownerDocument
        var f = e.body
        var g = e.documentElement
        var h = g.clientTop || f.clientTop || 0
        var i = g.clientLeft || f.clientLeft || 0
        var b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h
        var c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i
      } else {
        do {
          b += ele.offsetTop || 0,
            c += ele.offsetLeft || 0,
            ele = ele.offsetParent;
        }

        while (ele)
      }

      return {
        left: c,
        top: b,
      }
    },
    creatId() {
      return "front" + (new Date).getTime() + Math.round(Math.random() * 1000000)
    }
  }
  JTopo.flag = {
    graphics: document.createElement("canvas").getContext("2d"),
    nodeConfigure: {
      hoverBg: "rgba(168, 202, 255, 0.5)",
    },
  }

  window.JTopo = JTopo

  JTopo.Element = function () {
    this.initialize = function () {
      this.elementType = "element"
      this.serializedProperties = ["elementType"]
      this._id = JTopo.util.creatId()
    }
  }

  JTopo.Stage = function (c) {
    function d(e) {
      const eventObj = JTopo.util.getEventPosition(e)
      const offsetPosObj = JTopo.util.getOffsetPosition(n.canvas)

      eventObj.offsetLeft = eventObj.pageX - offsetPosObj.left
      eventObj.offsetTop = eventObj.pageY - offsetPosObj.top
      eventObj.x = eventObj.offsetLeft
      eventObj.y = eventObj.offsetTop
      eventObj.target = null

      return eventObj
    }

    function mousedown(e) {
      const b = d(e);

      n.mouseDown = !0,
        n.mouseDownX = b.x,
        n.mouseDownY = b.y,
        n.dispatchEventToScenes("mousedown", b),
        n.dispatchEvent("mousedown", b)
    }

    function mouseup(e) {
      const b = d(e);

      n.dispatchEventToScenes("mouseup", b),
        n.dispatchEvent("mouseup", b),
        n.mouseDown = !1,
        n.needRepaint = 0 == n.animate ? !1 : !0
    }

    function mousemove(e) {
      p && (
        window.clearTimeout(p),
          p = null
      ),
        o = !1;

      const b = d(e);

      n.mouseDown ? 0 == e.button && (b.dx = b.x - n.mouseDownX,
        b.dy = b.y - n.mouseDownY,
        n.dispatchEventToScenes("mousedrag", b),
        n.dispatchEvent("mousedrag", b))
        : (n.dispatchEventToScenes("mousemove", b),
          n.dispatchEvent("mousemove", b))
    }

    function click(e) {
      const b = d(e);
      n.dispatchEventToScenes("click", b),
        n.dispatchEvent("click", b)
    }

    function m(ele) {
      ele.addEventListener("mousedown", mousedown)
      ele.addEventListener("mouseup", mouseup)
      ele.addEventListener("mousemove", mousemove)
      ele.addEventListener("click", click)
    }

    var n = this

    this.initialize = function (canvas) {
      m(canvas)
      this.canvas = canvas
      this.graphics = canvas.getContext("2d")
      this.childs = []
      this.frames = 24
      this.messageBus = new JTopo.util.MessageBus
      this.wheelZoom = null
      this.mouseDownX = 0
      this.mouseDownY = 0
      this.mouseDown = !1
      this.needRepaint = !0
      this.mode = ''
    }

    c && this.initialize(c)

    var o = !0
    var p = null

    this.dispatchEventToScenes = function (eName, eObj) {
      this.childs.forEach(function (scene) {
        if (1 == scene.visible) {
          const eHandler = scene[eName + "Handler"]

          if (null == eHandler) {
            throw new Error("Function not found:" + eName + "Handler")
          }

          eHandler.call(scene, eObj)
        }
      })
    }

    this.add = function (scene) {
      for (let i = 0; i < this.childs.length; i++) {
        if (this.childs[i] === scene) {
          return
        }
      }

      scene.addTo(this),
        this.childs.push(scene)
    }

    this.addEventListener = function (eName, cb) {
      const self = this
      const fn = function (eObj) {
        cb.call(self, eObj)
      }

      return this.messageBus.subscribe(eName, fn),
        this
    }

    this.removeAllEventListener = function () {
      this.messageBus = new JTopo.util.MessageBus
    }

    this.dispatchEvent = function (eName, eObj) {
      return this.messageBus.publish(eName, eObj),
        this
    }

    this.paint = function () {
      if (this.canvas) {
        this.graphics.save()
        this.graphics.clearRect(0, 0, this.width, this.height)

        this.childs.forEach(function (scene) {
          scene.visible && scene.repaint(n.graphics)
        })

        this.graphics.restore()
      }
    }

    this.repaint = function () {
      if (this.frames) {
        if (
          this.frames >= 0
          || this.needRepaint
        ) {
          this.paint()
        }
      }
    }

    !function hahaha() {
      if (!n.frames) {
        setTimeout(hahaha, 100)
      } else {
        if (n.frames < 0) {
          n.repaint()
          setTimeout(hahaha, 1e3 / -n.frames)
        } else {
          n.repaint()
          setTimeout(hahaha, 1e3 / n.frames)
        }
      }
    }()

    setTimeout(function () {
      n.paint()
    }, 1e3)
  }
  JTopo.Stage.prototype = {
    get width() {
      return this.canvas.width
    },
    get height() {
      return this.canvas.height
    }
  }

  JTopo.Scene = function (c) {
    var e = this

    JTopo.flag.curScene = this

    this.initialize = function () {
      JTopo.Scene.prototype.initialize.apply(this, arguments)
      this.messageBus = new JTopo.util.MessageBus
      this.elementType = "scene"
      this.childs = []
      this.zIndexMap = {}
      this.zIndexArray = []
      this.backgroundColor = "255, 255, 255"
      this.visible = !0
      this.alpha = 0
      this.scaleX = 1
      this.scaleY = 1
      this.mode = JTopo.SceneMode.normal
      this.translate = !0
      this.translateX = 0
      this.translateY = 0
      this.lastTranslateX = 0
      this.lastTranslateY = 0
      this.mouseDown = !1
      this.mouseDownX = null
      this.mouseDownY = null
      this.mouseDownEvent = null
      this.areaSelect = !0
      this.operations = []
      this.selectedElements = []
      this.paintAll = !1
    }

    this.initialize()

    this.addTo = function (stage) {
      this.stage !== stage
      && stage
      && (this.stage = stage)
    }

    if (c) {
      c.add(this)
      this.addTo(c)
    }

    this.paint = function (ctx) {
      ctx.save()
      ctx.restore()
      ctx.save()
      ctx.scale(this.scaleX, this.scaleY)

      const b = this.getOffsetTranslate(ctx)
      ctx.translate(b.translateX, b.translateY)

      this.paintChilds(ctx)
      ctx.restore()
    }

    this.repaint = function (ctx, mapTag) {
      this.visible && this.paint(ctx, mapTag)
    }

    this.getDisplayedElements = function () {
      for (var displayedEleArr = [], i = 0; i < this.zIndexArray.length; i++) {
        const c = this.zIndexArray[i]
        const eleArr = this.zIndexMap[c]

        let j = 0

        for (; j < eleArr.length; j++) {
          const ele = eleArr[j]

          this.isVisiable(ele) && displayedEleArr.push(ele)
        }
      }
      return displayedEleArr
    }

    this.getDisplayedNodes = function () {
      for (var displayedNodeArr = [], i = 0; i < this.childs.length; i++) {
        const ele = this.childs[i]

        ele instanceof JTopo.Node
        && this.isVisiable(ele)
        && displayedNodeArr.push(ele)
      }
      return displayedNodeArr
    }

    this.paintChilds = function (ctx) {
      for (let i = 0; i < this.zIndexArray.length; i++) {
        const d = this.zIndexArray[i]
        const eleArr = this.zIndexMap[d]

        let j = 0

        for (; j < eleArr.length; j++) {
          const ele = eleArr[j]

          if (1 == this.paintAll || this.isVisiable(ele)) {
            if (
              ctx.save(),
              1 == ele.transformAble
            ) {
              const h = ele.getCenterLocation()

              ctx.translate(h.x, h.y),
              ele.rotate && ctx.rotate(ele.rotate),
                ele.scaleX && ele.scaleY
                  ? ctx.scale(ele.scaleX, ele.scaleY)
                  : ele.scaleX ? ctx.scale(ele.scaleX, 1) : ele.scaleY && ctx.scale(1, ele.scaleY)
            }
            1 == ele.shadow && (
              ctx.shadowBlur = ele.shadowBlur,
                ctx.shadowColor = ele.shadowColor,
                ctx.shadowOffsetX = ele.shadowOffsetX,
                ctx.shadowOffsetY = ele.shadowOffsetY
            ),
            ele instanceof JTopo.InteractiveElement && (
              ele.selected && 1 == ele.showSelected && ele.paintSelected(ctx),
              1 == ele.isMouseOver && ele.paintMouseover(ctx)
            ),
              ele.paint(ctx),
              ctx.restore()
          }
        }
      }
    }

    this.getOffsetTranslate = function (a) {
      let b = this.stage.canvas.width
        , c = this.stage.canvas.height;
      null != a && "move" != a && (b = a.canvas.width, c = a.canvas.height);
      const d = b / this.scaleX / 2
        , e = c / this.scaleY / 2
        , f = {
        translateX: this.translateX + (d - d * this.scaleX),
        translateY: this.translateY + (e - e * this.scaleY)
      };
      return f
    }

    this.isVisiable = function (ele) {
      if (1 != ele.visible)
        return !1;
      const c = this.getOffsetTranslate()
      ;let d = ele.x + c.translateX
        , e = ele.y + c.translateY;
      d *= this.scaleX,
        e *= this.scaleY;
      const f = d + ele.width * this.scaleX
        , g = e + ele.height * this.scaleY;
      return d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0
    }

    this.paintOperations = function (a, b) {
      for (let c = 0; c < b.length; c++)
        b[c](a)
    }

    this.addOperation = function (a) {
      return this.operations.push(a),
        this
    }

    this.clearOperations = function () {
      return this.operations = [],
        this
    }

    this.getElementByXY = function (b, c) {
      for (var d = null, e = this.zIndexArray.length - 1; e >= 0; e--) {
        const f = this.zIndexArray[e], g = this.zIndexMap[f];
        let h = g.length - 1;
        for (; h >= 0; h--) {
          const i = g[h];
          if (i instanceof JTopo.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c)) {
            return d = i
          }

        }
      }
      return d
    }

    this.add = function (a) {
      this.childs.push(a),
      null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [],
        this.zIndexArray.push(a.zIndex),
        this.zIndexArray.sort(function (a, b) {
          return a - b
        })),
        this.zIndexMap["" + a.zIndex].push(a);
      const thisObj = this;
    }

    this.remove = function (b) {
      this.childs = JTopo.util.removeFromArray(this.childs, b);
      const c = this.zIndexMap[b.zIndex];
      c && (this.zIndexMap[b.zIndex] = JTopo.util.removeFromArray(c, b)),
        b.removeHandler(this);
      const thisObj = this;
    }

    this.addToSelected = function (a) {

      this.selectedElements.push(a)
    }

    this.cancelAllSelected = function (a) {
      for (let b = 0; b < this.selectedElements.length; b++)
        this.selectedElements[b].unselectedHandler(a);
      this.selectedElements = []
    }

    this.notInSelectedNodes = function (a) {
      for (let b = 0; b < this.selectedElements.length; b++)
        if (a === this.selectedElements[b])
          return !1;
      return !0
    }

    this.removeFromSelected = function (a) {
      for (let b = 0; b < this.selectedElements.length; b++) {
        const c = this.selectedElements[b];
        a === c && (this.selectedElements = this.selectedElements.del(b))
      }
    }

    this.toSceneEvent = function (b) {
      const c = JTopo.util.clone(b);
      if (c.x /= this.scaleX,
          c.y /= this.scaleY,
        1 == this.translate) {
        const d = this.getOffsetTranslate();
        c.x -= d.translateX,
          c.y -= d.translateY
      }
      return null != c.dx && (c.dx /= this.scaleX,
        c.dy /= this.scaleY),
      null != this.currentElement && (c.target = this.currentElement),
        c.scene = this,
        c
    }

    this.selectElement = function (a) {
      const b = e.getElementByXY(a.x, a.y);

      if (null != b)
        if (a.target = b,
            b.mousedownHander(a),
            b.selectedHandler(a),
            e.notInSelectedNodes(b))
          a.ctrlKey || e.cancelAllSelected(),
            e.addToSelected(b);
        else {
          1 == a.ctrlKey && (b.unselectedHandler(),
            this.removeFromSelected(b));
          for (let c = 0; c < this.selectedElements.length; c++) {
            const d = this.selectedElements[c];
            d.selectedHandler(a)
          }
        }
      else
        a.ctrlKey || e.cancelAllSelected();
      this.currentElement = b
    }

    this.mousedownHandler = function (b) {
      const c = this.toSceneEvent(b);

      if (this.mouseDown = !0,
          this.mouseDownX = c.x,
          this.mouseDownY = c.y,
          this.mouseDownEvent = c,
        this.mode === JTopo.SceneMode.normal)
        this.selectElement(c);

      e.dispatchEvent("mousedown", c)
    }

    this.mouseupHandler = function (b) {
      this.stage.cursor != JTopo.MouseCursor.normal && (this.stage.cursor = JTopo.MouseCursor.normal),
        e.clearOperations();
      const c = this.toSceneEvent(b);
      null != this.currentElement && (c.target = e.currentElement,
        this.currentElement.mouseupHandler(c)),
        this.dispatchEvent("mouseup", c),
        this.mouseDown = !1
    }

    this.dragElements = function (b) {
      if (null != this.currentElement && 1 == this.currentElement.dragable)
        for (let c = 0; c < this.selectedElements.length; c++) {
          const d = this.selectedElements[c];
          if (0 != d.dragable) {
            const e = JTopo.util.clone(b);
            e.target = d,
              d.mousedragHandler(e)
          }
        }
    }

    this.mousedragHandler = function (b) {
      const c = this.toSceneEvent(b);

      this.dragElements(c)
      this.dispatchEvent("mousedrag", c)
    }

    this.mousemoveHandler = function (b) {
      this.toSceneEvent(b)
      this.stage.cursor = JTopo.MouseCursor.normal
    }

    this.clickHandler = function (a) {
      const b = this.toSceneEvent(a)

      if (this.currentElement) {
        b.target = this.currentElement
        this.currentElement.clickHandler(b)
      }

      this.dispatchEvent("click", b)
    }

    this.dbclickHandler = function (a) {
      const b = this.toSceneEvent(a)

      if (this.currentElement) {
        b.target = this.currentElement
        this.currentElement.dbclickHandler(b)
      } else {
        e.cancelAllSelected()
      }

      this.dispatchEvent("dbclick", b)
    }

    this.addEventListener = function (a, b) {
      const c = this
        , d = function (a) {
        b.call(c, a)
      };
      return this.messageBus.subscribe(a, d),
        this
    }

    this.dispatchEvent = function (a, b) {
      return this.messageBus.publish(a, b),
        this
    }

    return e
  }
  JTopo.Scene.prototype = new JTopo.Element

  JTopo.DisplayElement = function () {
    this.initialize = function () {
      JTopo.DisplayElement.prototype.initialize.apply(this, arguments)
      this.elementType = "displayElement"
      this.x = 0
      this.y = 0
      this.width = 32
      this.height = 32
      this.visible = !0
      this.alpha = 1
      this.rotate = 0
      this.scaleX = 1
      this.scaleY = 1
      this.fillColor = "255, 255, 255"
      this.transformAble = !1
      this.zIndex = 0
    }
    this.initialize()

    this.paint = function (ctx) {
      ctx.beginPath()
      ctx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"
      ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }

    this.getLocation = function () {
      return {
        x: this.x,
        y: this.y
      }
    }

    this.setLocation = function (x, y) {
      // 画布上鼠标移动时激活
      return this.x = x,
        this.y = y,
        this
    }

    this.getCenterLocation = function () {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      }
    }

    this.setCenterLocation = function (x, y) {
      return this.x = x - this.width / 2,
        this.y = y - this.height / 2,
        this
    }
  }
  JTopo.DisplayElement.prototype = new JTopo.Element

  JTopo.InteractiveElement = function () {
    this.initialize = function () {
      JTopo.InteractiveElement.prototype.initialize.apply(this, arguments)
      this.elementType = "interactiveElement"
      this.dragable = !1
      this.selected = !1
      this.showSelected = !0
      this.selectedLocation = null
      this.isMouseOver = !1
    }
    this.initialize()
    this.paintSelected = function (a) {
      0 != this.showSelected && (a.save(),
        a.beginPath(),
        a.strokeStyle = "rgba(168,202,255, 0.5)",
        a.fillStyle = JTopo.flag.nodeConfigure.hoverBg,//节点背景颜色
        a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6),
        a.fill(),
        a.stroke(),
        a.closePath(),
        a.restore())
    }
    this.paintMouseover = function (a) {
      return this.paintSelected(a)
    }
    this.isInBound = function (a, b) {
      return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
    }
    this.selectedHandler = function () {
      this.selected = !0
      this.selectedLocation = {
        x: this.x,
        y: this.y
      }
    }
    this.unselectedHandler = function () {
      this.selected = !1
      this.selectedLocation = null
    }
    this.dbclickHandler = function (a) {
      this.dispatchEvent("dbclick", a)
    }
    this.clickHandler = function (a) {
      this.dispatchEvent("click", a)
    }
    this.mousedownHander = function (a) {
      this.dispatchEvent("mousedown", a)
    }
    this.mouseupHandler = function (a) {
      this.dispatchEvent("mouseup", a)
    }
    this.mouseoverHandler = function (a) {
      this.isMouseOver = !0,
        this.dispatchEvent("mouseover", a)
    }
    this.mousemoveHandler = function (a) {
      this.dispatchEvent("mousemove", a)
    }
    this.mouseoutHandler = function (a) {
      this.isMouseOver = !1,
        this.dispatchEvent("mouseout", a)
    }
    this.mousedragHandler = function (a) {
      const b = this.selectedLocation.x + a.dx
        , c = this.selectedLocation.y + a.dy;
      this.setLocation(b, c),
        this.dispatchEvent("mousedrag", a)
    }
    this.addEventListener = function (b, c) {
      const d = this
        , e = function (a) {
        c.call(d, a)
      };
      return this.messageBus || (this.messageBus = new JTopo.util.MessageBus),
        this.messageBus.subscribe(b, e),
        this
    }
    this.dispatchEvent = function (a, b) {
      return this.messageBus ? (this.messageBus.publish(a, b),
        this) : null
    }
    this.removeAllEventListener = function () {
      this.messageBus = new JTopo.util.MessageBus
    }
  }
  JTopo.InteractiveElement.prototype = new JTopo.DisplayElement

  JTopo.Node = function () {
    JTopo.Node.prototype.initialize.apply(this, arguments)
    this.elementType = "node"
    this.zIndex = JTopo.zIndex_Node
    this.dragable = true
    this.transformAble = true

    this.paint = function (a) {
      a.beginPath()
      a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"
      a.rect(-this.width / 2, -this.height / 2, this.width, this.height)
      a.fill()
      a.closePath()
    }
  }
  JTopo.Node.prototype = new JTopo.InteractiveElement

  return JTopo
})();
