let JTopo = {}

function MessageBus(name) {
  this.name = name
  this.messageMap = {}
  this.messageCount = 0
}

MessageBus.prototype.subscribe = function (eName, fn) {
  const fnArr = this.messageMap[eName]

  fnArr && (this.messageMap[eName] = [])

  this.messageMap[eName].push(fn)
  this.messageCount++
}
MessageBus.prototype.unsubscribe = function (eName) {
  const fnArr = this.messageMap[eName]

  if (fnArr) {
    this.messageMap[eName] = null

    delete this.messageMap[eName]

    this.messageCount--
  }
}
MessageBus.prototype.publish = function (eName, eObj, sign) {
  const fnArr = this.messageMap[eName]

  if (fnArr) {
    for (let i = 0; i < fnArr.length; i++) {
      sign
        ? !function (fn, eObj) {
          setTimeout(function () {
            fn(eObj)
          }, 10)
        }(fnArr[i], eObj)
        : fnArr[i](eObj)
    }
  }
}

extendWindow()

function extendWindow() {
  window.$for = function (a, b, fn, t) {
    function wrapper(i) {
      if (i !== b) {
        fn(b)
        setTimeout(function () {
          wrapper(++i)
        }, t)
      }
    }

    if (!(a > b)) {
      const start = 0

      wrapper(start)
    }
  }
  window.$foreach = function (arr, fn, t) {
    function wrapper(i) {

      if (i != arr.length) {
        fn(arr[i])
        setTimeout(function () {
          wrapper(++i)
        }, t)
      }
    }

    if (0 != arr.length) {
      let start = 0

      wrapper(start)
    }
  }
}

extendCanvasPrototype()

function extendCanvasPrototype() {
  CanvasRenderingContext2D.prototype.JTopoRoundRect = function (x, y, w, h, borderRadius, borderDashed) {
    !borderRadius && (borderRadius = 5)

    if (borderDashed) {
      this.beginPath()

      this.JTopoDashedLineTo(x + borderRadius, y, x + w - borderRadius, y)
      this.quadraticCurveTo(x + w, y, x + w, y + borderRadius)

      this.JTopoDashedLineTo(x + w, y + borderRadius, x + w, y + h - borderRadius)
      this.quadraticCurveTo(x + w, y + h, x + w - borderRadius, y + h)

      this.JTopoDashedLineTo(x + w - borderRadius, y + h, x + borderRadius, y + h)
      this.quadraticCurveTo(x, y + h, x, y + h - borderRadius)

      this.JTopoDashedLineTo(x, y + h - borderRadius, x, y + borderRadius)
      this.quadraticCurveTo(x, y, x + borderRadius, y)
      this.JTopoDashedLineTo(x, y, x + borderRadius, y)

      this.closePath()
    }
    else {
      this.beginPath()
      this.moveTo(x + borderRadius, y)
      this.lineTo(x + w - borderRadius, y)
      this.quadraticCurveTo(x + w, y, x + w, y + borderRadius)
      this.lineTo(x + w, y + h - borderRadius)
      this.quadraticCurveTo(x + w, y + h, x + w - borderRadius, y + h)
      this.lineTo(x + borderRadius, y + h)
      this.quadraticCurveTo(x, y + h, x, y + h - borderRadius)
      this.lineTo(x, y + borderRadius)
      this.quadraticCurveTo(x, y, x + borderRadius, y)
      this.closePath()
    }
  }
  CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (x1, y1, x2, y2, dashedLineSpacing) {
    !dashedLineSpacing && (dashedLineSpacing = 5)

    const w = x2 - x1
    const h = y2 - y1

    const len = Math.floor(Math.sqrt(w * w + h * h))
    const dashedLineSpacingAmount = 0 >= dashedLineSpacing
      ? len
      : len / dashedLineSpacing

    const dashedLineSpacingH = h / len * dashedLineSpacing
    const dashedLineSpacingW = w / len * dashedLineSpacing

    this.beginPath()

    for (
      let stepAmount = 0;
      dashedLineSpacingAmount > stepAmount;
      stepAmount++
    ) {
      stepAmount % 2
        ? this.lineTo(x1 + stepAmount * dashedLineSpacingW, y1 + stepAmount * dashedLineSpacingH)
        : this.moveTo(x1 + stepAmount * dashedLineSpacingW, y1 + stepAmount * dashedLineSpacingH)
    }

    this.stroke()
  }
  CanvasRenderingContext2D.prototype.JTopoDrawPointPath = function (x1, y1, x2, y2, strokeStyle, PointPathColor) {
    const animSpeed = (new Date()) / 10

    const w = x2 - x1
    const h = y2 - y1

    const l = Math.floor(Math.sqrt(w * w + h * h))
    const pointPathLen = 50

    let wLen
    let hLen

    if (l === 0) {
      wLen = 0
      hLen = 0
    } else {
      wLen = w / l
      hLen = h / l
    }

    const colorpoint = animSpeed % (l + pointPathLen) - pointPathLen

    for (let i = 0; i < l; i++) {
      if (
        i > colorpoint
        && i < (colorpoint + pointPathLen)
      ) {
        this.beginPath()
        this.strokeStyle = strokeStyle
        this.moveTo(x1 + (i - 1) * wLen, y1 + (i - 1) * hLen)
        this.lineTo(x1 + i * wLen, y1 + i * hLen)
        this.stroke()
      }
      else {
        this.beginPath()
        this.strokeStyle = PointPathColor
        this.moveTo(x1 + (i - 1) * wLen, y1 + (i - 1) * hLen)
        this.lineTo(x1 + i * wLen, y1 + i * hLen)
        this.stroke()
      }
    }
  }
}

extendOthers()

function extendOthers() {
  String.prototype.getChineseNum = function () {
    let len = 0

    for (let i = 0; i < this.length; i++) {
      if (
        this.charCodeAt(i) > 127
        || this.charCodeAt(i) === 94
      ) {
        len += 1
      }
    }

    return len
  }
  Array.prototype.del = function (indexOrValue) {
    if ("number" !== typeof indexOrValue) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === indexOrValue) {
          return this
            .slice(0, i)
            .concat(this.slice(i + 1, this.length))
        }
      }

      return this
    }

    return 0 > indexOrValue
      ? this
      : this
        .slice(0, indexOrValue)
        .concat(this.slice(indexOrValue + 1, this.length))
  }
  Array.prototype.unique = function () {
    this.sort()

    const res = [this[0]]

    for (let i = 1; i < this.length; i++) {
      if (this[i] !== res[res.length - 1]) {
        res.push(this[i])
      }
    }

    return res
  }
}

initGlobal(window)

function initGlobal(window) {
  const canvas = document.createElement("canvas")

  JTopo = {
    version: "0.4.8",
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {
      // default: node can be selected (multi-select by press Ctrl), drag the scene by clicking blank area
      normal: "normal",
      // node can't be selected, just drag the scene
      drag: "drag",
      // default + adjust width or height of node by 6 control points
      edit: "edit",
      // multi-node can be selected by a box, also can click one node
      select: "select",
    },
    MouseCursor: {
      normal: "default",
      pointer: "pointer",
      top_left: "nw-resize",
      top_center: "n-resize",
      top_right: "ne-resize",
      middle_left: "e-resize",
      middle_right: "e-resize",
      bottom_left: "ne-resize",
      bottom_center: "n-resize",
      bottom_top: "n-resize",
      bottom_right: "nw-resize",
      move: "move",
    },
    createStageFromJson(jsonStr, canvas) {
      let jsonObj = JSON.parse(jsonStr)

      const stage = new JTopo.Stage(canvas)

      for (let key in jsonObj) {
        "childs" !== key
        && (stage[key] = jsonObj[key])
      }

      const scenes = jsonObj.childs

      scenes.forEach(function (scene) {
        const sceneInstance = new JTopo.Scene(stage)

        for (let key1 in scene) {
          "childs" !== key1
          && (sceneInstance[key1] = scene[key1])

          "background" === key1
          && (sceneInstance.background = scene[key1])
        }

        const nodes = scene.childs

        nodes.forEach(function (node) {
          let newNode = null
          const elementType = node.elementType

          "node" === elementType
            ? newNode = new JTopo.Node
            : "CircleNode" === elementType && (newNode = new JTopo.CircleNode)

          for (let i in node) {
            newNode[i] = node[i]
          }

          sceneInstance.add(newNode)
        })
      })

      return stage
    },
  }

  JTopo.util = {
    rotatePoint(x1, y1, x2, y2, rad) {
      const w = x2 - x1
      const h = y2 - y1
      const l = Math.sqrt(w * w + h * h)
      const tarRad = Math.atan2(h, w) + rad

      return {
        x: x1 + Math.cos(tarRad) * l,
        y: y1 + Math.sin(tarRad) * l,
      }
    },
    rotatePoints(p1, pointsArr, rad) {
      const self = this
      const tarCoordArr = []

      for (let i = 0; i < pointsArr.length; i++) {
        const tarRotatePointCoord = self.rotatePoint(
          p1.x,
          p1.y,
          pointsArr[i].x,
          pointsArr[i].y,
          rad
        )

        tarCoordArr.push(tarRotatePointCoord)
      }

      return tarCoordArr
    },
    getDistance(p1, p2, c, d) {
      let w
      let h

      if (!c && !d) {
        w = p2.x - p1.x
        h = p2.y - p1.y
      }
      else {
        w = c - p1
        h = d - p2
      }

      return Math.sqrt(w * w + h * h)
    },
    getElementsBound(nodesArr) {
      let ebObj = {
        left: Number.MAX_VALUE,
        right: Number.MIN_VALUE,
        top: Number.MAX_VALUE,
        bottom: Number.MIN_VALUE,
      }

      for (let i = 0; i < nodesArr.length; i++) {
        const node = nodesArr[i]

        if (!(node instanceof JTopo.Link)) {
          if (ebObj.left > node.x) {
            ebObj.left = node.x
            ebObj.leftNode = node
          }

          if (ebObj.right < node.x + node.width) {
            ebObj.right = node.x + node.width
            ebObj.rightNode = node
          }

          if (ebObj.top > node.y) {
            ebObj.top = node.y
            ebObj.topNode = node
          }

          if (ebObj.bottom < node.y + node.height) {
            ebObj.bottom = node.y + node.height
            ebObj.bottomNode = node
          }
        }
      }

      ebObj.width = ebObj.right - ebObj.left
      ebObj.height = ebObj.bottom - ebObj.top

      return ebObj
    },
    getEventPosition(e) {
      return this.mouseCoords(e)
    },
    mouseCoords(e) {
      const eObj = this.cloneEvent(e)

      if (!eObj.pageX) {
        eObj.pageX = eObj.clientX + document.body.scrollLeft - document.body.clientLeft
        eObj.pageY = eObj.clientY + document.body.scrollTop - document.body.clientTop
      }

      return eObj
    },
    cloneEvent(e) {
      const eObj = {}

      for (let key in e) {
        "returnValue" !== key
        && "keyLocation" !== key
        && (eObj[key] = e[key])
      }

      return eObj
    },
    MessageBus,
    clone(jsonObj) {
      const copyJsonObj = {}

      for (let key in jsonObj) {
        copyJsonObj[key] = jsonObj[key]
      }

      return copyJsonObj
    },
    isPointInRect(point, rect) {
      return point.x > rect.x
        && point.x < rect.x + rect.width
        && point.y > rect.y
        && point.y < rect.y + rect.height
    },
    isRectOverlapRect(rect1, rect2) {
      function sugar(rect1, rect2) {
        const rect = rect1

        const leftTop = {
          x: rect.x,
          y: rect.y,
        }
        const leftBottom = {
          x: rect.x,
          y: rect.y + rect.height,
        }
        const rightTop = {
          x: rect.x + rect.width,
          y: rect.y,
        }
        const rightBottom = {
          x: rect.x + rect.width,
          y: rect.y + rect.height,
        }

        return this.isPointInRect(leftTop, rect2)
          || this.isPointInRect(leftBottom, rect2)
          || this.isPointInRect(rightTop, rect2)
          || this.isPointInRect(rightBottom, rect2)
      }

      return sugar(rect1, rect2)
        || sugar(rect2, rect1)
    },
    isPointInLine(p1, p2, p3) {

      const d1 = this.getDistance(p2, p3)
      const d2 = this.getDistance(p2, p1)
      const d3 = this.getDistance(p3, p1)

      return Math.abs(d2 + d3 - d1) <= .5
    },
    removeFromArray(arr, tarEle) {
      for (let i = 0; i < arr.length; i++) {
        const curEle = arr[i]

        if (curEle === tarEle) {
          arr = arr.del(i)

          break
        }
      }

      return arr
    },
    randomColor() {
      return Math.floor(255 * Math.random())
        + ","
        + Math.floor(255 * Math.random())
        + ","
        + Math.floor(255 * Math.random())
    },
    getProperties(obj, keys) {
      let propertiesJson = ""

      for (let i = 0; i < keys.length; i++) {
        i > 0 && (propertiesJson += ",")

        let value = obj[keys[i]]

        "string" == typeof value
          ? value = '"' + value + '"'
          : !value && (value = null)

        propertiesJson += keys[i] + ":" + value
      }

      return propertiesJson
    },
    changeColor(ctx, imgEle, tarR, tarG, tarB, oriR, oriG, oriB) {
      const cW = canvas.width = imgEle.width
      const cH = canvas.height = imgEle.height

      ctx.clearRect(0, 0, cW, cH)
      ctx.drawImage(imgEle, 0, 0)

      const imgData = ctx.getImageData(0, 0, cW, cH)
      const imgInnerData = imgData.data

      for (let i = 0; i < cW; i++) {
        for (let j = 0; j < cH; j++) {
          const n = 4 * (i + j * cW)

          if (
            (oriR || oriG || oriB)
            && (
              imgInnerData[n] === oriR
              && imgInnerData[n + 1] === oriG
              && imgInnerData[n + 2] === oriB
            )
          ) {
            imgInnerData[n] = tarR
            imgInnerData[n + 1] = tarG
            imgInnerData[n + 2] = tarB
          }
        }

        ctx.putImageData(imgData, 0, 0, 0, 0, imgEle.width, imgEle.height)
      }

      const url = canvas.toDataURL()

      if (
        oriR !== undefined
        || oriG !== undefined
        || oriB !== undefined
      ) {
        JTopo.flag.alarmImageCache[imgEle.src + 'tag' + tarR + tarG + tarB] = url
      }

      return url
    },
    toJson(stage) {
      const scenePropertiesArr = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(",")
      const nodePropertiesArr = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(",")

      let stageJson = "{"

      stageJson += "frames:" + stage.frames
      stageJson += ", scenes:["

      for (let i = 0; i < stage.childs.length; i++) {
        const scene = stage.childs[i]

        stageJson += "{"
        stageJson += this.getProperties(scene, scenePropertiesArr)
        stageJson += ", elements:["

        for (let j = 0; j < scene.childs.length; j++) {
          const node = scene.childs[j]

          j > 0 && (stageJson += ",")
          stageJson += "{"
          stageJson += this.getProperties(node, nodePropertiesArr)
          stageJson += "}"
        }

        stageJson += "]}"
      }

      stageJson += "]"
      stageJson += "}"

      return stageJson
    },
    loadStageFromJson(json, canvas) {
      const obj = JSON.parse(json)
      const stage = new JTopo.Stage(canvas)

      for (let k in obj) {
        if ("scenes" !== k) {
          stage[k] = obj[k]
        } else {
          const scenes = obj.scenes

          for (let i = 0; i < scenes.length; i++) {
            const sceneObj = scenes[i]
            const scene = new JTopo.Scene(stage)

            for (let p in sceneObj) {
              if ("elements" !== p) {
                scene[p] = sceneObj[p]
              } else {
                const nodeMap = {}
                const elements = sceneObj.elements

                for (let m = 0; m < elements.length; m++) {
                  const elementObj = elements[m]
                  const type = elementObj.elementType
                  let element

                  "Node" === type && (element = new JTopo.Node)

                  for (let mk in elementObj) {
                    element[mk] = elementObj[mk]
                  }

                  nodeMap[element.text] = element
                  scene.add(element)
                }
              }
            }
          }
        }
      }

      return stage
    },
    getImageAlarm(imgEle, b, tarColor, oriColor) {
      !b && (b = 255)

      try {
        const image = new Image
        const alarmImage = JTopo.flag.alarmImageCache[imgEle.src + 'tag' + tarColor[0] + tarColor[1] + tarColor[2]]

        if (alarmImage) {
          image.src = alarmImage

          return image
        }

        if (tarColor && oriColor) {
          image.src = this.changeColor(
            graphics,
            imgEle,
            tarColor[0],
            tarColor[1],
            tarColor[2],
            oriColor[0],
            oriColor[1],
            oriColor[2]
          )
        }
        else {
          image.src = this.changeColor(graphics, imgEle, b)
        }

        return image
      } catch (e) {
      }

      return null
    },
    getOffsetPosition(ele) {
      if (!ele) {
        return {
          left: 0,
          top: 0,
        }
      }

      let top = 0
      let left = 0

      do {
        top += ele.offsetTop || 0
        left += ele.offsetLeft || 0
        ele = ele.offsetParent
      }
      while (ele)

      return {
        top: top,
        left: left,
      }
    },
    lineFn(x1, y1, x2, y2) {
      let k = (y2 - y1) / (x2 - x1)
      let b = y1 - x1 * k

      function lineFn(x) {
        // y = kx + b
        return k * x + b
      }

      lineFn.k = k
      lineFn.b = b
      lineFn.x1 = x1
      lineFn.x2 = x2
      lineFn.y1 = y1
      lineFn.y2 = y2

      return lineFn
    },
    inRange(testVal, val1, val2) {
      const d1 = Math.abs(val1 - val2)
      const d2 = Math.abs(val1 - testVal)
      const d3 = Math.abs(val2 - testVal)
      const sign = Math.abs(d1 - (d2 + d3))

      return 1e-6 > sign ? !0 : !1
    },
    isPointInLineSeg(x, y, lineFn) {
      return this.inRange(x, lineFn.x1, lineFn.x2)
        && this.inRange(y, lineFn.y1, lineFn.y2)
    },
    intersection(lineFn1, lineFn2) {
      let x
      let y

      if (lineFn1.k === lineFn2.k) {
        return null
      }
      else {
        if (
          1 / 0 === lineFn1.k
          || -1 / 0 === lineFn1.k
        ) {
          x = lineFn1.x1
          y = lineFn2(lineFn1.x1)

          return {x, y}
        }
        else {
          if (
            1 / 0 === lineFn2.k
            || -1 / 0 === lineFn2.k
          ) {
            x = lineFn2.x1
            y = lineFn1(lineFn2.x1)

            return {x, y}
          }
          else {
            x = (lineFn2.b - lineFn1.b) / (lineFn1.k - lineFn2.k)
            y = lineFn1(x)

            if (!this.isPointInLineSeg(x, y, lineFn1)) {
              return null
            }
            else {
              if (this.isPointInLineSeg(x, y, lineFn2)) {
                return null
              }
              else {
                return {x, y}
              }
            }
          }
        }
      }
    },
    /**
     * returns intersection point object
     * @param {Object} lineFn1
     * @param {Object} bObj - boundaryObj
     * @returns ipObj - intersection point object
     */
    intersectionLineBound(lineFn1, bObj) {
      let lineFn2 = this.lineFn(bObj.left, bObj.top, bObj.left, bObj.bottom)
      let ipObj = this.intersection(lineFn1, lineFn2)

      if (!ipObj) {
        lineFn2 = this.lineFn(bObj.left, bObj.top, bObj.right, bObj.top)
        ipObj = this.intersection(lineFn1, lineFn2)

        if (!ipObj) {
          lineFn2 = this.lineFn(bObj.right, bObj.top, bObj.right, bObj.bottom)
          ipObj = this.intersection(lineFn1, lineFn2)

          if (!ipObj) {
            lineFn2 = this.lineFn(bObj.left, bObj.bottom, bObj.right, bObj.bottom)
            ipObj = this.intersection(lineFn1, lineFn2)
          }
        }
      }

      return ipObj
    },
    copy(jsonObj) {
      return JSON.parse(JSON.stringify(jsonObj))
    },
    getUrlParam(key) {
      const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
      const r = window.location.search.substr(1).match(reg)

      if (r) {
        return decodeURIComponent(r[2])
      }

      return null
    },
    creatId() {
      return "front" + (new Date).getTime() + Math.round(Math.random() * 1000000)
    },
    setImageUrl(url) {
      JTopo.flag.imageUrl = url

      if (JTopo.flag.topoImgMap) {
        JTopo.MouseCursor.open_hand = "default"
        JTopo.MouseCursor.closed_hand = "default"
      } else {
        JTopo.MouseCursor.open_hand = "url(" + url + "openhand.cur) 8 8, default"
        JTopo.MouseCursor.closed_hand = "url(" + url + "closedhand.cur) 8 8, default"
      }
    },
    nodeFlash(node, isChangeColor, isFlash, oriColor, changeColor) {
      node.nodeOriginColor = oriColor
      node.alarm = isChangeColor ? "true" : null
      node.fillAlarmNode = changeColor
      node.setImage('changeColor')

      node.flashT && clearInterval(node.flashT)

      if (isChangeColor && isFlash) {
        let i = 1
        let tag = null

        node.flashT = setInterval(function () {
          tag = ++i % 2

          node.alarm = tag ? "true" : null

          if (JTopo.flag.clearAllAnimateT) {
            clearInterval(node.flashT)
          }
        }, 1000)
      }
    },
    smallNodeFlash(node, isChangeColor, isFlash, oriColor, changeColor) {
      node.smallImageOriginColor = oriColor
      node.smallImageChangeColor = changeColor
      node.smallAlarmImageTag = isChangeColor ? "true" : null

      node.setImage('changeSmallImageColor')

      node.samllflashT && clearInterval(node.samllflashT)

      if (isChangeColor && isFlash) {
        let i = 1
        let tag = null

        node.samllflashT = setInterval(function () {
          tag = ++i % 2
          node.smallAlarmImageTag = tag ? "true" : null

          if (JTopo.flag.clearAllAnimateT) {
            clearInterval(node.samllflashT)
          }
        }, 1000)
      }
    },
    getRotateAng(nodeA, nodeZ) {
      const x = nodeA.x - nodeZ.x
      const y = nodeA.y - nodeZ.y

      return Math.atan(y / x)
    },
    findAllPrevNodesAndLinks(id, linksArr, saveObj) {
      let _saveObj = saveObj

      if (!saveObj) {
        _saveObj = {
          prevNodesId: [],
          prevLinksId: [],
        }
      }

      for (let i = 0; i < linksArr.length; i++) {
        const linkObj = linksArr[i]

        if (linkObj.nodeZ.id === id) {
          _saveObj.prevNodesId.push(linkObj.nodeA.id)
          _saveObj.prevLinksId.push(linkObj.id)

          this.findAllPrevNodesAndLinks(linkObj.nodeA.id, linksArr, _saveObj)
        }
      }

      return _saveObj
    },
    findAllNextNodesAndLinks(id, linksArr, saveObj) {
      let _saveObj = saveObj

      if (!saveObj) {
        _saveObj = {
          nextNodesId: [],
          nextLinksId: [],
        }
      }

      for (let i = 0; i < linksArr.length; i++) {
        const linkObj = linksArr[i]

        if (linkObj.nodeA.id == id) {
          _saveObj.nextNodesId.push(linkObj.nodeZ.id)
          _saveObj.nextLinksId.push(linkObj.id)

          this.findAllNextNodesAndLinks(linkObj.nodeZ.id, linksArr, _saveObj)
        }
      }

      return _saveObj
    },
    findEleById(id) {
      const idTypeName = id.indexOf('front') >= 0
        ? '_id'
        : 'id'

      return JTopo.flag.curScene.childs.filter(function (child) {
        return (child[idTypeName] === id)
      })[0]
    },
    findEleByType(type) {
      return JTopo.flag.curScene.childs.filter(function (child) {
        return (child.elementType === type)
      })
    },
    setPopPos($pop, _nodeId, subW, subH, $scroll) {
      // 横坐标微调值
      const _subW = subW || 0
      // 纵坐标微调值
      const _subH = subH || 0
      // 节点 id
      const nodeId = _nodeId

      const canvas = document.getElementById('canvas')
      const left = canvas.offset().left
      const _top = canvas.offset().top

      // 当前 scene 的缩放率
      const curSceneScaleXRate = JTopo.flag.curScene.scaleX
      const canvasW = canvas.width()
      const canvasH = canvas.height()

      // 目标节点
      let targetNode = null

      let px = null
      let py = null

      const scrollTop = $scroll ? $scroll.scrollTop() : 0

      JTopo.flag.curScene.childs.filter(function (child) {
        if (child.id === nodeId) {
          targetNode = child

          if (targetNode.elementType === 'link') {
            px = (targetNode.nodeA.x + targetNode.nodeZ.x) * 0.5
            py = (targetNode.nodeA.y + targetNode.nodeZ.y) * 0.5
          } else {
            px = targetNode.x + targetNode.width
            py = targetNode.y
          }
        }
      })

      //算法
      const popLeft = (1 - curSceneScaleXRate) * canvasW * 0.5
        + (px + JTopo.flag.curScene.translateX) * curSceneScaleXRate
        + left
        + _subW
      const popTop = (1 - curSceneScaleXRate) * canvasH * 0.5
        + (py + JTopo.flag.curScene.translateY) * curSceneScaleXRate
        + _top
        + _subH
        + scrollTop

      $pop.css({
        left: popLeft,
        top: popTop,
      })
    },
    moveElePosByContainerBorder(eleObj, isOpen, callback) {
      JTopo.flag.curScene.childs.forEach(function (p) {
        let subValue = eleObj.width

        // 1.不处理 1, 2, 3 象限
        // 2.处理 4 象限，且右移
        if (!isOpen) {
          eleObj.x += subValue
        }

        if (
          p.elementType === 'node'
          && (p.x >= eleObj.x && p.y >= eleObj.y)
        ) {
          JTopo.Animate
            .stepByStep(p, {x: p.x - subValue}, 300, false)
            .start()
        }
      })

      callback && callback()
    },
  }
  JTopo.flag = {
    graphics: canvas.getContext("2d"),
    clearAllAnimateT: false,
    curScene: null,
    linkConfigure: {
      textIsTilt: false,
      textIsNearToNodeZ: false,
    },
    nodeConfigure: {
      hoverBg: "rgba(168, 202, 255, 0.5)",
    },
    alarmImageCache: {},
    topoImgMap: null,
  }

  window.JTopo = JTopo
}

initElement(JTopo)

function initElement(JTopo) {
  JTopo.Element = function () {
  }

  JTopo.Element.prototype.initialize = function () {
    // element,displayElement,interactiveElement,TextNode,LinkNode,
    // linkAnimateNode,link,node,CirckeNode,container,containerNode,scene,...
    this.elementType = "element"
    // elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,
    // fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex,
    // dragable,selected,showSelected,isMouseOver,text,font,fontColor,textPosition,
    // textOffsetX,textOffsetY,borderRadius,lineWidth,lineJoin,background,
    // backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,
    // lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY,frames,wheelZoom
    this.serializedProperties = ["elementType"]
    this.propertiesStack = []
    this._id = JTopo.util.creatId()
  }
  JTopo.Element.prototype.destory = function () {
  }
  JTopo.Element.prototype.removeHandler = function () {
  }
  /** set or get value of attr */
  JTopo.Element.prototype.attr = function (k, v) {
    if (k && v) {
      this[k] = v
    }
    else if (k) {
      return this[k]
    }

    return this
  }
  /** save the current state of element serializedProperties to propertiesStack */
  JTopo.Element.prototype.save = function () {
    const self = this
    const data = {}

    this.serializedProperties.forEach(function (key) {
      data[key] = self[key]
    })

    this.propertiesStack.push(data)
  }
  /** restore previous data from propertiesStack */
  JTopo.Element.prototype.restore = function () {
    if (
      this.propertiesStack
      && this.propertiesStack.length > 0
    ) {
      const self = this
      const data = this.propertiesStack.pop()

      this.serializedProperties.forEach(function (key) {
        self[key] = data[key]
      })
    }
  }
  /** serialize properties of current element to JSON */
  JTopo.Element.prototype.toJson = function () {
    const self = this
    const len = self.serializedProperties.length
    let dataJsonStr = "{"

    self.serializedProperties.forEach(function (key, i) {
      let val = self[key]

      "string" === typeof val && (val = '"' + val + '"')

      dataJsonStr += '"' + key + '":' + val

      len > i + 1 && (dataJsonStr += ",")
    })

    dataJsonStr += "}"

    return dataJsonStr
  }
}

initDisplayElement(JTopo)

function initDisplayElement(JTopo) {
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
      this.strokeColor = "22, 124, 255"
      this.borderColor = "22, 124, 255"
      this.fillColor = "255, 255, 255"
      this.shadow = !1
      this.shadowBlur = 5
      this.shadowColor = "rgba(0, 0, 0, 0.5)"
      this.shadowOffsetX = 3
      this.shadowOffsetY = 6
      this.transformAble = !1
      this.zIndex = 0

      const propertiesNameArr = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",")

      this.serializedProperties = this.serializedProperties.concat(propertiesNameArr)
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
      this.x = x
      this.y = y

      return this
    }
    this.getCenterLocation = function () {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      }
    }
    this.setCenterLocation = function (x, y) {
      this.x = x - this.width / 2
      this.y = y - this.height / 2

      return this
    }
    /** get size of element: width, height */
    this.getSize = function () {
      return {
        width: this.width,
        height: this.heith
      }
    }
    /** set size of element: width, height */
    this.setSize = function (w, h) {
      this.width = w
      this.height = h

      return this
    }
    this.getBound = function () {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width,
        bottom: this.y + this.height,
        width: this.width,
        height: this.height
      }
    }
    this.setBound = function (x, y, w, h) {
      this.setLocation(x, y)
      this.setSize(w, h)

      return this
    }
    this.getDisplayBound = function () {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width * this.scaleX,
        bottom: this.y + this.height * this.scaleY
      }
    }
    this.getDisplaySize = function () {
      return {
        width: this.width * this.scaleX,
        height: this.height * this.scaleY
      }
    }
    this.getPosition = function (posDesc) {
      let posObj
      const boundObj = this.getBound()

      switch (posDesc) {
        case 'Top_Left':
          posObj = {
            x: boundObj.left,
            y: boundObj.top
          }
          break
        case 'Top_Center':
          posObj = {
            x: this.cx,
            y: boundObj.top
          }
          break
        case 'Top_Right':
          posObj = {
            x: boundObj.right,
            y: boundObj.top
          }
          break
        case 'Middle_Left':
          posObj = {
            x: boundObj.left,
            y: this.cy
          }
          break
        case 'Middle_Center':
          posObj = {
            x: this.cx,
            y: this.cy
          }
          break
        case 'Middle_Right':
          posObj = {
            x: boundObj.right,
            y: this.cy
          }
          break
        case 'Bottom_Left':
          posObj = {
            x: boundObj.left,
            y: boundObj.bottom
          }
          break
        case 'Bottom_Center':
          posObj = {
            x: this.cx,
            y: boundObj.bottom
          }
          break
        case 'Bottom_Right':
          posObj = {
            x: boundObj.right,
            y: boundObj.bottom
          }
          break
      }

      return posObj
    }
  }
  JTopo.DisplayElement.prototype = new JTopo.Element
  Object.defineProperties(JTopo.DisplayElement.prototype, {
    cx: {
      get: function () {
        return this.x + this.width / 2
      },
      set: function (a) {
        this.x = a - this.width / 2
      }
    },
    cy: {
      get: function () {
        return this.y + this.height / 2
      },
      set: function (a) {
        this.y = a - this.height / 2
      }
    }
  })
  JTopo.InteractiveElement = function () {
    this.initialize = function () {
      JTopo.InteractiveElement.prototype.initialize.apply(this, arguments)

      this.elementType = "interactiveElement"
      this.dragable = !1
      this.selected = !1
      this.showSelected = !0
      this.selectedLocation = null
      this.isMouseOver = !1

      const propertiesNameArr = "dragable,selected,showSelected,isMouseOver".split(",")

      this.serializedProperties = this.serializedProperties.concat(propertiesNameArr)
    }
    this.initialize()
    this.paintSelected = function (ctx) {
      if (this.showSelected) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = "rgba(168,202,255,0.5)"
        ctx.fillStyle = JTopo.flag.nodeConfigure.hoverBg
        ctx.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
      }
    }
    this.paintMouseover = function (ctx) {
      return this.paintSelected(ctx)
    }
    this.isInBound = function (x, y) {
      return x > this.x
        && x < this.x + this.width * Math.abs(this.scaleX)
        && y > this.y
        && y < this.y + this.height * Math.abs(this.scaleY)
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
    this.clickHandler = function (eObj) {
      this.dispatchEvent("click", eObj)
    }
    this.dbclickHandler = function (eObj) {
      this.dispatchEvent("dbclick", eObj)
    }
    this.mousedownHander = function (eObj) {
      this.dispatchEvent("mousedown", eObj)
    }
    this.mouseupHandler = function (eObj) {
      this.dispatchEvent("mouseup", eObj)
    }
    this.mouseoverHandler = function (eObj) {
      this.isMouseOver = !0
      this.dispatchEvent("mouseover", eObj)
    }
    this.mousemoveHandler = function (eObj) {
      this.dispatchEvent("mousemove", eObj)
    }
    this.mouseoutHandler = function (eObj) {
      this.isMouseOver = !1
      this.dispatchEvent("mouseout", eObj)
    }
    this.mousedragHandler = function (eObj) {
      const x = this.selectedLocation.x + eObj.dx
      const y = this.selectedLocation.y + eObj.dy

      this.setLocation(x, y)
      this.dispatchEvent("mousedrag", eObj)
    }
    this.addEventListener = function (eName, fn) {
      const self = this
      const cb = function (args) {
        fn.call(self, args)
      }

      this.messageBus || (this.messageBus = new JTopo.util.MessageBus)
      this.messageBus.subscribe(eName, cb)

      return this
    }
    this.dispatchEvent = function (eName, eObj) {
      if (this.messageBus) {
        this.messageBus.publish(eName, eObj)
        return this
      } else {
        return null
      }
    }
    this.removeEventListener = function (eName) {
      this.messageBus.unsubscribe(eName)
    }
    this.removeAllEventListener = function () {
      this.messageBus = new JTopo.util.MessageBus
    }

    let eNameArr = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(",")

    const self = this

    eNameArr.forEach(function (eName) {
      self[eName] = function (cb) {
        cb
          ? self.addEventListener(eName, cb)
          : self.dispatchEvent(eName)
      }
    })
  }
  JTopo.InteractiveElement.prototype = new JTopo.DisplayElement
  JTopo.EditableElement = function () {
    let posArr = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Top", "Bottom_Right"]

    this.initialize = function () {
      JTopo.EditableElement.prototype.initialize.apply(this, arguments)

      this.editAble = !1
      this.selectedPoint = null
    }
    this.getCtrlPosition = function (posDesc) {
      const dx = 5
      const dy = 5
      const posObj = this.getPosition(posDesc)

      return {
        left: posObj.x - dx,
        top: posObj.y - dy,
        right: posObj.x + dx,
        bottom: posObj.y + dy
      }
    }
    this.selectedHandler = function (b) {
      JTopo.EditableElement.prototype.selectedHandler.apply(this, arguments)

      this.selectedSize = {
        width: this.width,
        height: this.height
      }

      b.scene.mode === JTopo.SceneMode.edit
      && (this.editAble = !0)
    }
    this.unselectedHandler = function () {
      JTopo.EditableElement.prototype.unselectedHandler.apply(this, arguments)

      this.selectedSize = null
      this.editAble = !1
    }
    this.paintCtrl = function (ctx) {
      if (this.editAble) {
        ctx.save()

        for (let i = 0; i < posArr.length; i++) {
          const ctrlPosObj = this.getCtrlPosition(posArr[i])

          ctrlPosObj.left -= this.cx
          ctrlPosObj.right -= this.cx
          ctrlPosObj.top -= this.cy
          ctrlPosObj.bottom -= this.cy

          const w = ctrlPosObj.right - ctrlPosObj.left
          const h = ctrlPosObj.bottom - ctrlPosObj.top

          ctx.beginPath()
          ctx.strokeStyle = "rgba(0,0,0,0.8)"
          ctx.rect(ctrlPosObj.left, ctrlPosObj.top, w, h)
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath()
          ctx.strokeStyle = "rgba(255,255,255,0.3)"
          ctx.rect(ctrlPosObj.left + 1, ctrlPosObj.top + 1, w - 2, h - 2)
          ctx.stroke()
          ctx.closePath()
        }

        ctx.restore()
      }
    }
    this.isInBound = function (x, y) {
      this.selectedPoint = null

      if (this.editAble) {
        for (let i = 0; i < posArr.length; i++) {
          const ctrlPosObj = this.getCtrlPosition(posArr[i])

          if (
            x > ctrlPosObj.left
            && x < ctrlPosObj.right
            && y > ctrlPosObj.top
            && y < ctrlPosObj.bottom
          ) {
            this.selectedPoint = posArr[i]
            return !0
          }
        }
      }

      return JTopo.EditableElement.prototype.isInBound.apply(this, arguments)
    }
    this.mousedragHandler = function (eObj) {
      if (!this.selectedPoint) {
        let x = this.selectedLocation.x + eObj.dx
        let y = this.selectedLocation.y + eObj.dy

        this.setLocation(x, y)
        this.dispatchEvent("mousedrag", eObj)
      }
      else {
        let w = this.selectedSize.width - eObj.dx
        let w1 = this.selectedSize.width + eObj.dx
        let h = this.selectedSize.height - eObj.dy
        let h1 = this.selectedSize.height + eObj.dy
        let x = this.selectedLocation.x + eObj.dx
        let y = this.selectedLocation.y + eObj.dy

        switch (this.selectedPoint) {
          case 'Top_Left':
            if (x < this.x + this.width) {
              this.x = x
              this.width = w
            }
            if (y < this.y + this.height) {
              this.y = y
              this.height = h
            }
            break
          case 'Top_Center':
            if (y < this.y + this.height) {
              this.y = y
              this.height = h
            }
            break
          case 'Top_Right':
            if (y < this.y + this.height) {
              this.y = y
              this.height = this.selectedSize.height - eObj.dy
            }
            w1 > 1 && (this.width = w1)
            break
          case 'Middle_Left':
            x < this.x + this.width && (this.x = x)
            w > 1 && (this.width = w)
            break
          case 'Middle_Right':
            w1 > 1 && (this.width = w1)
            break
          case 'Bottom_Left':
            if (w > 1) {
              this.x = x
              this.width = w
            }
            h1 > 1 && (this.height = h1)
            break
          case 'Bottom_Center':
            h1 > 1 && (this.height = h1)
            break
          case 'Bottom_Top':
            h1 > 1 && (this.height = h1)
            break
          case 'Bottom_Right':
            w1 > 1 && (this.width = w1)
            h1 > 1 && (this.height = h1)
            break
        }

        this.dispatchEvent("resize", eObj)
      }
    }
  }
  JTopo.EditableElement.prototype = new JTopo.InteractiveElement
}

initNode(JTopo)

function initNode(JTopo) {
  function _Node(text) {
    this.initialize = function (text) {
      _Node.prototype.initialize.apply(this, arguments)

      this.elementType = "node"
      // index range: [10-999], [1-9] as reserve value
      this.zIndex = JTopo.zIndex_Node
      this.nodeFn = null
      this.text = text
      this.textBreakNumber = 5
      this.textLineHeight = 15
      this.textAlpah = 1
      this.textPosition = "Bottom_Center"
      this.textOffsetX = 0
      this.textOffsetY = 0
      this.font = "12px Consolas"
      this.fontColor = "85, 85, 85"
      this.borderWidth = 0
      this.borderColor = "255, 255, 255"
      this.borderRadius = null
      this.alarmColor = "255, 0, 0"
      this.fillAlarmNode = [255, 0, 0]
      this.nodeOriginColor = null
      this.showAlarmText = false
      this.keepChangeColor = false
      this.dragable = !0
      this.transformAble = !0
      this.inLinks = null
      this.outLinks = null
      this.linearGradient = null
      this.colorStop = null
      this.smallAlarmImage_w = 20
      this.smallAlarmImage_h = 20
      this.smallAlarmImage_x = null
      this.smallAlarmImage_y = null
      this.smallAlarmImageTag = false
      this.smallAlarmImageObj = null
      this.smallAlarmImageChangeObj = null
      this.smallImageOriginColor = [255, 0, 0]
      this.smallImageChangeColor = null
      this.paintCallback = null
      this.beforePaintCallback = null

      const propertiesArr = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",")
      this.serializedProperties = this.serializedProperties.concat(propertiesArr)
    }

    this.initialize(text)

    this.paint = function (ctx) {
      this.beforePaintCallback
      && this.beforePaintCallback(ctx)

      if (this.image) {
        const globalAlpha = ctx.globalAlpha
        ctx.globalAlpha = this.alpha

        if (typeof this.image !== 'string') {
          if (this.keepChangeColor) {
            ctx.drawImage(
              this.image.alarm,
              -this.width / 2,
              -this.height / 2,
              this.width,
              this.height
            )
          }
          else {
            if (
              this.image.alarm
              && this.alarm
            ) {
              ctx.drawImage(
                this.image.alarm,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
              )
            }
            else {
              ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
              )
            }
          }
        }

        ctx.globalAlpha = globalAlpha
      }
      else {
        ctx.beginPath()

        ctx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"

        !this.borderRadius
          ? ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
          : ctx.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius)

        ctx.fill()
      }

      if (this.linearGradient) {
        const kVal = this.kVal

        const grd = ctx.createLinearGradient(
          this.linearGradient[0],
          this.linearGradient[1],
          this.linearGradient[2] * kVal,
          this.linearGradient[3]
        )

        for (
          let grdCount = 0;
          grdCount < this.colorStop.length / 2;
          grdCount++
        ) {
          grd.addColorStop(
            this.colorStop[grdCount * 2],
            this.colorStop[grdCount * 2 + 1]
          )
        }

        ctx.fillStyle = grd

        if (!this.borderRadius) {
          ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width * kVal,
            this.height
          )
        }
        else {
          ctx.JTopoRoundRect(
            -this.width / 2,
            -this.height / 2,
            this.width * kVal,
            this.height,
            kVal < 0.03 ? 0 : this.borderRadius
          )
        }

        ctx.fill()
      }

      ctx.closePath()

      this.paintText(ctx)
      this.paintBorder(ctx)
      this.paintCtrl(ctx)
      this.paintAlarmText(ctx)
      this.paintAlarmImage(ctx)

      this.paintCallback
      && this.paintCallback(ctx)
    }

    this.paintText = function (ctx) {
      const text = this.text

      if (text) {
        ctx.beginPath()
        ctx.font = this.font

        const textW = ctx.measureText(text).width
        const defaultTextW = ctx.measureText("田").width

        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.textAlpah + ")"

        const textPosObj = this.getTextPostion(this.textPosition, textW, defaultTextW)

        draw_long_text(text, ctx, textPosObj.x, textPosObj.y, this, defaultTextW)

        ctx.closePath()

        function draw_long_text(longtext,
                                ctx,
                                x,
                                y,
                                thisObj,
                                textHeight) {
          let lineH = thisObj.textLineHeight

          if (thisObj.nodeFn === 'alarm') {
            const strArr = longtext.split(/\d+/)
            const numStrArr = longtext.match(/\d+/)

            //第一段 non-number string
            const len1 = ctx.measureText(strArr[0]).width
            ctx.fillText(strArr[0], x, y)

            //第二段 number string
            const len2 = ctx.measureText(numStrArr[0]).width
            const startP2 = x + len1
            ctx.fillStyle = parseInt(numStrArr[0]) === 0
              ? 'rgba(149,193,90,1)'
              : 'rgba(249,2,2,1)'
            ctx.fillText(numStrArr[0], startP2, y)

            //第三段
            const startP3 = startP2 + len2
            ctx.fillStyle = 'rgba(43,43,43,1)'
            ctx.fillText(strArr[1], startP3, y)
          }
          else if (longtext.indexOf('$') > 0) {
            let text = ""
            // let count = 0
            let begin_x
            let begin_y = y
            let lineH = lineH || 12
            const textLen = longtext.length
            const textCharArr = longtext.split("")

            ctx.textAlign = thisObj.textAlign

            switch (thisObj.textAlign) {
              case "center":
                begin_x = 0
                break
              case "left":
                begin_x = x + 7
                // line numbers
                const lineNum = (longtext.split('$')).length
                //总高度
                const csh = lineNum * lineH - textHeight
                begin_y = y - csh / 2
                break
              default:
                console.log(thisObj.textAlign)
            }

            for (let i = 0; i <= textLen; i++) {

              if (textCharArr[0] === '$') {
                ctx.fillText(text, begin_x, begin_y)
                begin_y = begin_y + lineH
                text = ""
                textCharArr.shift()
              }

              if (i === textLen) {
                ctx.fillText(text, begin_x, begin_y)
              }

              if (textCharArr[0]) {
                text = text + textCharArr[0]
              }

              // count++

              textCharArr.shift()
            }
          }
          else {
            ctx.fillText(longtext, x, y)
          }
        }
      }
    }

    this.paintBorder = function (ctx) {
      if (this.borderWidth) {
        ctx.beginPath()
        ctx.lineWidth = this.borderWidth
        ctx.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")"

        const halfBW = this.borderWidth / 2

        if (this.borderRadius) {
          ctx.rect(
            -this.width / 2 - halfBW,
            -this.height / 2 - halfBW,
            this.width + this.borderWidth,
            this.height + this.borderWidth
          )
        } else {
          ctx.JTopoRoundRect(
            -this.width / 2 - halfBW,
            -this.height / 2 - halfBW,
            this.width + this.borderWidth,
            this.height + this.borderWidth,
            this.borderRadius
          )
        }

        ctx.stroke()
        ctx.closePath()
      }
    }

    this.paintAlarmText = function (ctx) {
      if (
        this.alarm
        && this.showAlarmText
      ) {
        const alarmColor = this.alarmColor
        const alarmAlpha = this.alarmAlpha || .5
        const alarmTextW = ctx.measureText(this.alarm).width + 6
        const defaultTextW = ctx.measureText("田").width + 6
        const x = this.width / 2 - alarmTextW / 2
        const y = -this.height / 2 - defaultTextW - 8

        ctx.beginPath()
        ctx.font = this.alarmFont || "10px 微软雅黑"
        ctx.strokeStyle = "rgba(" + alarmColor + ", " + alarmAlpha + ")"
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.lineCap = "round"
        ctx.lineWidth = 1
        ctx.moveTo(x, y)
        ctx.lineTo(x + alarmTextW, y)
        ctx.lineTo(x + alarmTextW, y + defaultTextW)
        ctx.lineTo(x + alarmTextW / 2 + 6, y + defaultTextW)
        ctx.lineTo(x + alarmTextW / 2, y + defaultTextW + 8)
        ctx.lineTo(x + alarmTextW / 2 - 6, y + defaultTextW)
        ctx.lineTo(x, y + defaultTextW)
        ctx.lineTo(x, y)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"
        ctx.fillText(this.alarm, x + 16.5, y + defaultTextW - 4)
        ctx.closePath()
      }
    }

    this.paintAlarmImage = function (ctx) {
      let smallAlarmImageObj = this.smallAlarmImageObj
      let smallAlarmImageChangeObj = this.smallAlarmImageChangeObj
      let smallAlarmImageTag = this.smallAlarmImageTag
      let dstX = this.smallAlarmImage_x
      let dstY = this.smallAlarmImage_y
      let dstW = this.smallAlarmImage_w
      let dstH = this.smallAlarmImage_h

      if (smallAlarmImageObj) {
        const globalAlpha = ctx.globalAlpha

        ctx.globalAlpha = this.alpha

        if (smallAlarmImageChangeObj && smallAlarmImageTag) {
          ctx.drawImage(
            smallAlarmImageChangeObj,
            dstX ? dstX : -10 - this.width / 2,
            dstY ? dstY : -this.height / 2,
            dstW,
            dstH
          )
        }
        else {
          ctx.drawImage(
            smallAlarmImageObj,
            dstX ? dstX : -10 - this.width / 2,
            dstY ? dstY : -this.height / 2,
            dstW,
            dstH
          )
        }

        ctx.globalAlpha = globalAlpha
      }
    }

    this.getTextPostion = function (posDesc, w, h) {
      let textPosObj = null

      if (posDesc) {
        switch (posDesc) {
          case 'Bottom_Center':
            textPosObj = {
              x: -this.width / 2 + (this.width - w) / 2,
              y: this.height / 2 + h
            }
            break
          case 'Bottom_Top':
            textPosObj = {
              x: -this.width / 2 + (this.width - w) / 2,
              // y: this.height / 2 + h
              y: h
            }
            break
          case 'Top_Center':
            textPosObj = {
              x: -this.width / 2 + (this.width - w) / 2,
              y: -this.height / 2 - h / 2
            }
            break
          case 'Top_Right':
            textPosObj = {
              x: this.width / 2,
              y: -this.height / 2 - h / 2
            }
            break
          case 'Top_Left':
            textPosObj = {
              x: -this.width / 2 - w,
              y: -this.height / 2 - h / 2
            }
            break
          case 'Bottom_Right':
            textPosObj = {
              x: this.width / 2,
              y: this.height / 2 + h
            }
            break
          case 'Bottom_Left':
            textPosObj = {
              x: -this.width / 2 - w,
              y: this.height / 2 + h
            }
            break
          case 'Middle_Center':
            textPosObj = {
              x: -this.width / 2 + (this.width - w) / 2,
              y: h / 2
            }
            break
          case 'Middle_Right':
            textPosObj = {
              x: this.width / 2,
              y: h / 2
            }
            break
          case 'Middle_Left':
            textPosObj = {
              x: -this.width / 2 - w,
              y: h / 2
            }
            break
        }
      }

      this.textOffsetX && (textPosObj.x += this.textOffsetX)
      this.textOffsetY && (textPosObj.y += this.textOffsetY)

      return textPosObj
    }

    this.setImage = function (img, c) {
      let self = this

      if (!img) {
        throw new Error("Node.setImage(): 参数Image对象为空!")
      }

      if (img === 'changeColor') {
        self.image && (
          self.image.alarm = JTopo.util.getImageAlarm(
            self.image,
            null,
            self.fillAlarmNode,
            self.nodeOriginColor
          )
        )
      }
      else if (img === 'changeSmallImageColor') {
        self.smallAlarmImageObj && (
          self.smallAlarmImageChangeObj = JTopo.util.getImageAlarm(
            self.smallAlarmImageObj,
            null,
            self.smallImageChangeColor,
            self.smallImageOriginColor
          )
        )
      }
      else if ("string" === typeof img && c === 'setSmallImage') {
        let image = new Image

        image.src = img

        image.onload = function () {
          self.smallAlarmImageChangeObj = JTopo.util.getImageAlarm(
            image,
            null,
            self.smallImageChangeColor,
            self.smallImageOriginColor
          )

          self.smallAlarmImageObj = image
        }
      }
      else if (c === 'imageDataFlow') {
        let image = new Image
        image.src = JTopo.flag.topoImgMap[img]

        image.onload = function () {
          const alarm = JTopo.util.getImageAlarm(
            image,
            null,
            self.fillAlarmNode,
            self.nodeOriginColor
          )

          alarm && (image.alarm = alarm)
          self.image = image
        }
      }
      else if ("string" === typeof img) {
        let image = new Image

        image.src = img

        image.onload = function () {
          1 === c && self.setSize(image.width, image.height)

          const alarm = JTopo.util.getImageAlarm(
            image,
            null,
            self.fillAlarmNode,
            self.nodeOriginColor
          )

          alarm && (image.alarm = alarm)
          self.image = image
        }
      }
      else {
        this.image = img
        1 === c && this.setSize(img.width, img.height)
      }
    }

    this.removeHandler = function (node) {
      const self = this

      if (this.outLinks) {
        this.outLinks.forEach(function (outLink) {
          outLink.nodeA === self && node.remove(outLink)
        })

        this.outLinks = null
      }

      if (this.inLinks) {
        this.inLinks.forEach(function (inLink) {
          inLink.nodeZ === self && node.remove(inLink)
        })

        this.inLinks = null
      }

      const pc = this.parentContainer

      if (pc && pc.length > 0) {
        for (let i = 0; i < pc.length; i++) {
          const pcObj = pc[i]

          pcObj.remove(self)

          if (!pcObj.childs.length) {
            JTopo.flag.curScene.remove(pcObj)
          }
        }
      }
    }
  }

  _Node.prototype = new JTopo.EditableElement

  function _Animate1_Node(frameImages, interval, c) {
    let self = this

    self.initialize()

    self.frameImages = frameImages || []
    self.frameIndex = 0
    self.isStop = !0

    const interval = interval || 1e3

    self.repeatPlay = !1

    self.nextFrame = function () {
      if (
        !self.isStop
        && self.frameImages
      ) {
        self.frameIndex++

        if (self.frameIndex >= self.frameImages.length) {
          if (!self.repeatPlay) return

          self.frameIndex = 0
        }

        self.setImage(self.frameImages[self.frameIndex], c)

        setTimeout(self.nextFrame, interval / frameImages.length)
      }
    }
  }

  _Animate1_Node.prototype = new JTopo.Node

  function _Animate2_Node(image, row, col, interval, rowOffset) {
    const self = this

    self.initialize()
    self.setImage(image)
    self.frameIndex = 0
    self.isPause = !0
    self.repeatPlay = !1

    const interval = interval || 1e3
    const rowOffset = rowOffset || 0

    self.paint = function (ctx) {
      if (self.image) {
        let w = self.width
        let h = self.height
        const dstX = Math.floor(self.frameIndex % col) * w
        const dstY = (Math.floor(self.frameIndex / col) + rowOffset) * h

        ctx.save()

        ctx.beginPath()
        ctx.fillStyle = "rgba(" + self.fillColor + "," + self.alpha + ")"
        ctx.drawImage(self.image, dstX, dstY, w, h, -w / 2, -h / 2, w, h)
        ctx.fill()
        ctx.closePath()

        ctx.restore()

        self.paintText(ctx)
        self.paintBorder(ctx)
        self.paintCtrl(ctx)
        self.paintAlarmText(ctx)
      }
    }
    self.nextFrame = function () {
      if (!self.isStop) {
        self.frameIndex++

        if (self.frameIndex >= row * col) {
          if (!self.repeatPlay) return

          self.frameIndex = 0
        }
        setTimeout(function () {
          self.isStop || self.nextFrame()
        }, interval / (row * col))
      }
    }
  }

  _Animate2_Node.prototype = new JTopo.Node

  JTopo.Node = function () {
    JTopo.Node.prototype.initialize.apply(this, arguments)
  }
  JTopo.Node.prototype = new _Node
  JTopo.TextNode = function (text) {
    this.initialize()

    this.text = text
    this.elementType = "TextNode"

    // textnode 放到容器中，容器外再加一个容器，移动容器，textnode 不能触发位移
    this.paint = function (ctx) {
      let self = this

      ctx.beginPath()
      ctx.font = this.font

      self.width = ctx.measureText(self.text).width
      self.height = ctx.measureText("田").width

      ctx.strokeStyle = "rgba(" + self.fontColor + ", " + self.alpha + ")"
      ctx.fillStyle = "rgba(" + self.fontColor + ", " + self.alpha + ")"
      ctx.fillText(self.text, -self.width / 2, self.height / 2)
      ctx.closePath()

      self.paintBorder(ctx)
      self.paintCtrl(ctx)
      self.paintAlarmText(ctx)
    }
  }
  JTopo.TextNode.prototype = new JTopo.Node
  JTopo.LinkNode = function (text, href, target) {
    this.initialize()

    this.text = text
    this.href = href
    this.target = target
    this.elementType = "LinkNode"
    this.isVisited = !1
    this.isStopLinkNodeClick = false
    this.visitedColor = null

    this.paint = function (ctx) {
      ctx.beginPath()
      ctx.font = this.font

      this.width = ctx.measureText(this.text).width
      this.height = ctx.measureText("田").width

      if (
        this.isVisited
        && this.visitedColor
      ) {
        ctx.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")"
        ctx.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")"
      }
      else {
        ctx.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"
      }

      draw_long_text(this.text, ctx, -this.width / 2, this.height / 2, this)

      if (this.isMouseOver) {
        ctx.moveTo(-this.width / 2, this.height)
        ctx.lineTo(this.width / 2, this.height)
        ctx.stroke()
      }

      ctx.closePath()
      this.paintBorder(ctx)
      this.paintCtrl(ctx)
      this.paintAlarmText(ctx)

      /**
       * draw long text
       *
       * @param {String} longtext
       * @param {Object} ctx
       * @param {String} x
       * @param {String} y
       * @param {Object} thisObj - node
       * @returns
       */
      function draw_long_text(longtext,
                              ctx,
                              x,
                              y,
                              thisObj) {
        if (thisObj.nodeFn === 'alarm') {
          const strArr = longtext.split(/\d+/)
          const numStrArr = longtext.match(/\d+/)

          //第一段 non-number string
          const len1 = ctx.measureText(strArr[0]).width
          ctx.fillText(strArr[0], x, y)

          //第二段 number string
          const len2 = ctx.measureText(numStrArr[0]).width
          const startP2 = x + len1
          ctx.fillStyle = parseInt(numStrArr[0]) === 0
            ? 'rgba(149,193,90,1)'
            : 'rgba(249,2,2,1)'
          ctx.fillText(numStrArr[0], startP2, y)

          //第三段
          const startP3 = startP2 + len2
          ctx.fillStyle = 'rgba(43,43,43,1)'
          ctx.fillText(strArr[1], startP3, y)
        }
      }
    }

    this.mousemove(function () {
      const oCanvasArr = document.getElementsByTagName("canvas")

      if (oCanvasArr && oCanvasArr.length) {
        for (let i = 0; i < oCanvasArr.length; i++) {
          oCanvasArr[i].style.cursor = "pointer"
        }
      }
    })

    this.mouseout(function () {
      const oCanvasArr = document.getElementsByTagName("canvas")

      if (oCanvasArr && oCanvasArr.length) {
        for (let i = 0; i < oCanvasArr.length; i++) {
          oCanvasArr[i].style.cursor = "default"
        }
      }
    })

    this.click(function () {
      if (!this.isStopLinkNodeClick) {
        "_blank" === this.target
          ? window.open(this.href)
          : location = this.href

        this.isVisited = !0
      }
    })
  }
  JTopo.LinkNode.prototype = new JTopo.TextNode
  JTopo.CircleNode = function (text) {
    this.initialize(arguments)

    this.text = text
    this._radius = 20
    this.beginDegree = 0
    this.endDegree = 2 * Math.PI

    this.paint = function (ctx) {
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"
      ctx.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0)
      ctx.fill()
      ctx.closePath()
      ctx.restore()

      this.paintText(ctx)
      this.paintBorder(ctx)
      this.paintCtrl(ctx)
      this.paintAlarmText(ctx)
    }

    this.paintSelected = function (ctx) {
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = "rgba(168, 202, 255, 0.9)"
      ctx.fillStyle = "rgba(168, 202, 236, 0.7)"
      ctx.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }
  }
  JTopo.CircleNode.prototype = new JTopo.Node
  Object.defineProperties(JTopo.CircleNode.prototype, {
    radius: {
      get: function () {
        return this._radius
      },
      set: function (r) {
        this._radius = r

        this.width = 2 * this.radius
        this.height = 2 * this.radius
      }
    },
    width: {
      get: function () {
        return this._width
      },
      set: function (w) {
        this._radius = w / 2
        this._width = w
      }
    },
    height: {
      get: function () {
        return this._height
      },
      set: function (h) {
        this._radius = h / 2
        this._height = h
      }
    }
  })
  JTopo.AnimateNode = function () {
    // possible arguments: imageObj or imageUrl, row, col, interval, rowOffset

    const animNode = arguments.length <= 3
      ? new _Animate1_Node(arguments[0], arguments[1], arguments[2])
      : new _Animate2_Node(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])

    animNode.stop = function () {
      animNode.isStop = !0
    }
    animNode.play = function () {
      animNode.isStop = !1
      animNode.frameIndex = 0
      animNode.nextFrame()
    }

    return animNode
  }
  JTopo.AnimateNode.prototype = new JTopo.Node
}

initLink(JTopo)

function initLink(JTopo) {
  function getSharedLinks(nodeA, nodeZ) {
    function sugar(nodeA, nodeZ) {
      const links = []

      if (!nodeA || !nodeZ) return links

      if (nodeA && nodeZ && nodeA.outLinks && nodeZ.inLinks) {
        for (let i = 0; i < nodeA.outLinks.length; i++) {
          const outLink = nodeA.outLinks[i]
          for (let j = 0; j < nodeZ.inLinks.length; j++) {
            const inLink = nodeZ.inLinks[j]
            outLink === inLink && links.push(inLink)
          }
        }
      }

      return links
    }

    const a_zLinks = sugar(nodeA, nodeZ)
    const z_aLinks = sugar(nodeZ, nodeA)

    return a_zLinks.concat(z_aLinks)
  }

  function unsharedLinks(link) {
    let sharedLinks = getSharedLinks(link.nodeA, link.nodeZ)

    return sharedLinks.filter(function (sharedLink) {
      return link !== sharedLink
    })
  }

  function getSharedLinksLen(nodeA, nodeZ) {
    return getSharedLinks(nodeA, nodeZ).length
  }

  JTopo.Link = function (nodeA, nodeZ, text) {
    function getIntersectionPointObj(nodeA, nodeZ) {
      const lineObj = JTopo.util.lineFn(nodeA.cx, nodeA.cy, nodeZ.cx, nodeZ.cy)
      const bObj = nodeA.getBound()

      return JTopo.util.intersectionLineBound(lineObj, bObj)
    }

    this.initialize = function (nodeA, nodeZ, text) {
      JTopo.Link.prototype.initialize.apply(this, arguments)

      this.elementType = "link"
      this.zIndex = JTopo.zIndex_Link

      if (arguments.length) {
        this.text = text
        this.nodeA = nodeA
        this.nodeA && !this.nodeA.inLinks && (this.nodeA.inLinks = [])
        this.nodeA && !this.nodeA.outLinks && (this.nodeA.outLinks = [])
        this.nodeA && this.nodeA.outLinks.push(this)
        this.nodeZ = nodeZ
        this.nodeZ && !this.nodeZ.inLinks && (this.nodeZ.inLinks = [])
        this.nodeZ && !this.nodeZ.outLinks && (this.nodeZ.outLinks = [])
        this.nodeZ && this.nodeZ.inLinks.push(this)
        this.caculateIndex()
        this.font = "12px Consolas"
        this.fontColor = "43, 43, 43"
        this.isShowLinkName = true
        this.lineWidth = 2
        this.lineJoin = "miter"
        // Link,dashed,sArrow,dArrow,curve,flexional,flow,userDefine,...
        this.linkType = null
        this.transformAble = !1
        this.bundleOffset = 20
        // TODO: ?
        this.bundleGap = 12
        this.textOffsetX = 0
        this.textOffsetY = 0
        this.arrowsRadius = null
        this.arrowsOffset = 0
        this.dashedPattern = null
        this.path = []
        this.animateNodePath = null
        this.animateNode = null
        // 连接类型，null 为连接到中心点，toBorder 为连接到边缘
        this.linkConnectType = 'toBorder'
        // 合并出线条，多条线条从节点出去，合并成一根线条
        this.mergeOutLink = true
        // 二次折线的弧度半径
        this.flexionalRadius = null
        this.openStartRadius = true
        this.openEndRadius = true

        const keysArr = "text,font,fontColor,lineWidth,lineJoin".split(",")
        this.serializedProperties = this.serializedProperties.concat(keysArr)
      }
    }
    this.initialize(nodeA, nodeZ, text)

    this.caculateIndex = function () {
      const len = getSharedLinksLen(this.nodeA, this.nodeZ)
      len && (this.nodeIndex = len - 1)
    }
    this.removeHandler = function () {
      const self = this

      if (self.nodeA && self.nodeA.outLinks) {
        self.nodeA.outLinks = self.nodeA.outLinks.filter(function (outLink) {
          return outLink !== self
        })
      }

      if (self.nodeZ && self.nodeZ.inLinks) {
        self.nodeZ.inLinks = self.nodeZ.inLinks.filter(function (inLink) {
          return inLink !== self
        })
      }


      let unsharedLinksArr = unsharedLinks(self)

      unsharedLinksArr.forEach(function (unsharedLink, index) {
        unsharedLink.nodeIndex = index
      })
    }
    this.getStartPosition = function (linksSum, subY, angle) {
      let point = {}
      const PI = Math.PI

      switch (this.linkConnectType) {
        case 'toBorder':
          //链接边框
          point = getIntersectionPointObj(this.nodeA, this.nodeZ)
          !point && (point = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
          })
          break
        default:
          point = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
          }
      }

      if (angle < PI * 30 / 180) {
        point.y += (this.nodeIndex - (linksSum - 1) / 2) * subY
      }
      else {
        point.x += (this.nodeIndex - (linksSum - 1) / 2) * this.bundleGap
      }

      return point
    }
    this.getEndPosition = function (linksSum, subY, angle) {
      let point
      const PI = Math.PI

      switch (this.linkConnectType) {
        case 'toBorder':
          point = getIntersectionPointObj(this.nodeZ, this.nodeA)
          !point && (point = {
            x: this.nodeZ.cx,
            y: this.nodeZ.cy
          })
          break
        default:
          this.arrowsRadius
          && (point = getIntersectionPointObj(this.nodeZ, this.nodeA))
          !point && (point = {
            x: this.nodeZ.cx,
            y: this.nodeZ.cy
          })
      }

      if (angle < PI * 30 / 180) {
        point.y += (this.nodeIndex - (linksSum - 1) / 2) * subY
      }
      else {
        point.x += (this.nodeIndex - (linksSum - 1) / 2) * this.bundleGap
      }

      return point
    }
    this.getPath = function () {
      const len = getSharedLinksLen(this.nodeA, this.nodeZ)
      const angle = Math.atan2(
        Math.abs(this.nodeZ.cy - this.nodeA.cy),
        Math.abs(this.nodeZ.cx - this.nodeA.cx)
      )
      const subY = this.bundleGap / Math.cos(angle)
      const pathArr = []
      const startPos = this.getStartPosition(len, subY, angle)
      const endPos = this.getEndPosition(len, subY, angle)

      if (this.nodeA === this.nodeZ) return [startPos, endPos]

      if (1 === len) return [startPos, endPos]

      pathArr.push({
        x: startPos.x,
        y: startPos.y
      })

      pathArr.push({
        x: endPos.x,
        y: endPos.y
      })

      return pathArr
    }
    this.paintPath = function (ctx, pathArr) {
      switch (this.linkType) {
        case 'flexional':
          if (this.nodeA === this.nodeZ) {
            this.paintLoop(ctx)
            return
          }

          ctx.beginPath()
          ctx.moveTo(pathArr[0].x, pathArr[0].y)

          if (this.flexionalRadius) {
            const b0 = pathArr[0]
            const b1 = pathArr[1]
            const b2 = pathArr[2]
            const b3 = pathArr[3]

            if (this.openStartRadius && this.openEndRadius) {
              ctx.lineTo((b1.x + b0.x) / 2, (b1.y + b0.y) / 2)
              ctx.arcTo(b1.x, b1.y, (b1.x + b2.x) / 2, (b1.y + b2.y) / 2, this.flexionalRadius)
              ctx.lineTo((b1.x + b2.x) / 2, (b1.y + b2.y) / 2)
              ctx.arcTo(b2.x, b2.y, (b3.x + b2.x) / 2, (b3.y + b2.y) / 2, this.flexionalRadius)
              ctx.lineTo(b3.x, b3.y)
            }
            else if (this.openStartRadius && !this.openEndRadius) {
              ctx.lineTo((b1.x + b0.x) / 2, (b1.y + b0.y) / 2)
              ctx.arcTo(b1.x, b1.y, (b1.x + b2.x) / 2, (b1.y + b2.y) / 2, this.flexionalRadius)
              ctx.lineTo((b1.x + b2.x) / 2, (b1.y + b2.y) / 2)
              ctx.lineTo(b2.x, b2.y)
              ctx.lineTo(b3.x, b3.y)
            }
            else if (!this.openStartRadius && this.openEndRadius) {
              ctx.lineTo(b1.x, b1.y)
              ctx.lineTo((b1.x + b2.x) / 2, (b1.y + b2.y) / 2)
              ctx.arcTo(b2.x, b2.y, (b3.x + b2.x) / 2, (b3.y + b2.y) / 2, this.flexionalRadius)
              ctx.lineTo(b3.x, b3.y)
            }
            else {
              for (let i = 1; i < pathArr.length; i++) {
                !this.dashedPattern
                  ? ctx.lineTo(pathArr[i].x, pathArr[i].y)
                  : ctx.JTopoDashedLineTo(
                  pathArr[i - 1].x,
                  pathArr[i - 1].y,
                  pathArr[i].x,
                  pathArr[i].y,
                  this.dashedPattern
                  )
              }
            }
          }
          else {
            for (let i = 1; i < pathArr.length; i++) {
              !this.dashedPattern
                ? ctx.lineTo(pathArr[i].x, pathArr[i].y)
                : ctx.JTopoDashedLineTo(pathArr[i - 1].x, pathArr[i - 1].y, pathArr[i].x, pathArr[i].y, this.dashedPattern)
            }
          }

          ctx.stroke()
          ctx.closePath()

          if (this.arrowsRadius) {
            this.paintArrow(ctx, pathArr[pathArr.length - 2], pathArr[pathArr.length - 1])
          }

          break
        case 'dArrow':
          if (this.nodeA === this.nodeZ) return void this.paintLoop(ctx)

          ctx.beginPath()
          ctx.moveTo(pathArr[0].x, pathArr[0].y)

          for (let i = 1; i < pathArr.length; i++) {
            if (!this.dashedPattern) {
              if (!this.PointPathColor) {
                ctx.lineTo(pathArr[i].x, pathArr[i].y)
              } else {
                ctx.JTopoDrawPointPath(
                  pathArr[i - 1].x,
                  pathArr[i - 1].y,
                  pathArr[i].x,
                  pathArr[i].y,
                  ctx.strokeStyle,
                  this.PointPathColor
                )
              }
            } else {
              ctx.JTopoDashedLineTo(
                pathArr[i - 1].x,
                pathArr[i - 1].y,
                pathArr[i].x,
                pathArr[i].y,
                this.dashedPattern
              )
            }
          }

          ctx.stroke()
          ctx.closePath()

          if (this.arrowsRadius) {
            // 双箭头精髓
            this.paintArrow(ctx, pathArr[pathArr.length - 2], pathArr[pathArr.length - 1])
            this.paintArrow(ctx, pathArr[pathArr.length - 1], pathArr[pathArr.length - 2])
          }
          break
        case 'flow':
          if (this.nodeA === this.nodeZ) return void this.paintLoop(ctx)

          ctx.beginPath()
          ctx.moveTo(pathArr[0].x, pathArr[0].y)

          for (let i = 1; i < pathArr.length; i++) {
            if (!this.dashedPattern) {
              if (!this.PointPathColor) {
                ctx.lineTo(pathArr[i].x, pathArr[i].y)
              } else {
                ctx.JTopoDrawPointPath(
                  pathArr[i - 1].x,
                  pathArr[i - 1].y,
                  pathArr[i].x,
                  pathArr[i].y,
                  ctx.strokeStyle,
                  this.PointPathColor
                )
              }
            } else {
              ctx.JTopoDashedLineTo(
                pathArr[i - 1].x,
                pathArr[i - 1].y,
                pathArr[i].x,
                pathArr[i].y,
                this.dashedPattern
              )
            }
          }

          ctx.stroke()
          ctx.closePath()

          if (this.arrowsRadius) {
            this.paintArrow(ctx, pathArr[pathArr.length - 2], pathArr[pathArr.length - 1])
          }

          break
        default:
          if (this.nodeA === this.nodeZ) return void this.paintLoop(ctx)

          ctx.beginPath()
          ctx.moveTo(pathArr[0].x, pathArr[0].y)

          for (let i = 1; i < pathArr.length; i++) {
            !this.dashedPattern
              ? ctx.lineTo(pathArr[i].x, pathArr[i].y)
              : ctx.JTopoDashedLineTo(pathArr[i - 1].x, pathArr[i - 1].y, pathArr[i].x, pathArr[i].y, this.dashedPattern)
          }

          ctx.stroke()
          ctx.closePath()

          if (this.arrowsRadius) {
            this.paintArrow(ctx, pathArr[pathArr.length - 2], pathArr[pathArr.length - 1])
          }
      }
    }
    this.paintLoop = function (ctx) {
      ctx.beginPath()

      let b = this.bundleGap * (this.nodeIndex + 1) / 2

      ctx.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI)
      ctx.stroke()
      ctx.closePath()
    }
    this.paintArrow = function (ctx, p1, p2) {
      const e = this.arrowsOffset
      const f = this.arrowsRadius / 2
      let i = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const j = JTopo.util.getDistance(p1, p2) - this.arrowsRadius
      const k = p1.x + (j + e) * Math.cos(i)
      const l = p1.y + (j + e) * Math.sin(i)
      const x = p2.x + e * Math.cos(i)
      const y = p2.y + e * Math.sin(i)
      i -= Math.PI / 2
      const o = {
        x: k + f * Math.cos(i),
        y: l + f * Math.sin(i)
      }
      const p = {
        x: k + f * Math.cos(i - Math.PI),
        y: l + f * Math.sin(i - Math.PI)
      }

      ctx.beginPath()
      ctx.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")"
      ctx.moveTo(o.x, o.y)
      ctx.lineTo(x, y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      ctx.closePath()
    }
    this.paint = function (ctx) {
      if (this.nodeA && !this.nodeZ) {
        const path = this.getPath(this.nodeIndex)
        this.path = path
        ctx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")"
        ctx.lineWidth = this.lineWidth
        this.paintPath(ctx, path)
        path && path.length > 0 && this.paintText(ctx, nodeA)
      }
    }

    let i = -(Math.PI / 2 + Math.PI / 4)

    this.paintText = function (ctx) {
      if (!this.isShowLinkName) return

      if (this.text && this.text.length > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.font = this.font

        const g = ctx.measureText(this.text).width
        const h = ctx.measureText("田").widthctx

        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"

        if (this.nodeA === this.nodeZ) {
          let j = this.bundleGap * (this.nodeIndex + 1) / 2

          ctx.fillText(
            this.text,
            this.nodeA.x + j * Math.cos(i),
            this.nodeA.y + j * Math.sin(i)
          )
        }
        else {
          let kh = h / 2

          if (JTopo.flag.linkConfigure.textIsTilt) {
            // todo: 倾斜算法还有点问题
            ctx.translate(e - g / 2, f - h / 2)
            const rotate = JTopo.util.getRotateAng(this.nodeA, this.nodeZ)
            ctx.rotate(rotate)
            ctx.translate(-(e - g / 2), -(f - h / 2))

            const xkh = g / 2
            const r = Math.abs(180 * rotate / Math.PI)

            if (r > 20) {
              kh = rotate > 0 ? 5 : -5
            }
            if (r > 40) {
              kh = rotate > 0 ? 15 : -15
            }
            if (r > 60) {
              kh = rotate > 0 ? 20 : -20
            }
            if (r > 80) {
              kh = rotate > 0 ? 25 : -25
            }

            ctx.fillText(this.text, e - xkh, f - kh)

          }
          else {
            ctx.fillText(this.text, e - g / 2, f - kh)
          }
        }

        ctx.stroke()
        ctx.closePath()
        ctx.restore()
      }
    }
    this.paintSelected = function (ctx) {
      ctx.shadowBlur = 10
      ctx.shadowColor = "rgba(0,0,0,1)"
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }
    this.isInBound = function (x, y) {
      if (this.nodeA === this.nodeZ) {
        const d = this.bundleGap * (this.nodeIndex + 1) / 2
        const lineLength = JTopo.util.getDistance(this.nodeA, {
          x: x,
          y: y
        }) - d

        return Math.abs(lineLength) <= 3
      }

      let sign = !1

      for (let i = 1; i < this.path.length; i++) {
        const p1 = this.path[i - 1]
        const p2 = this.path[i]

        if (JTopo.util.isPointInLine({x: x, y: y}, p1, p2)) {
          sign = !0
          break
        }
      }

      return sign
    }
  }
  JTopo.Link.prototype = new JTopo.InteractiveElement
  /**
   * draw animate picture on link
   * @param {String} imgurl - image url
   * @param {Object} scene - current scene instance
   * @param {Number} rate
   * @param {Number} speed
   * @param {Number} width - image node width
   * @param {Number} height - image node height
   * @param {Number} row
   * @param {Number} col
   * @param {Number} interval
   * @param {Number} offsetRow
   * @returns {Object}
   */
  JTopo.Link.prototype.drawanimepic = function (imgurl, scene, rate, speed, width, height, row, col, interval, offsetRow) {
    const self = this
    const w = width || 16
    const h = height || 16

    const imgnode = new JTopo.AnimateNode(imgurl, row, col, interval, offsetRow)

    imgnode.setSize(w, h)
    imgnode.zIndex = 2.5
    imgnode.isNeedSave = false
    imgnode.repeatPlay = true
    imgnode.elementType = 'linkAnimateNode'
    imgnode.dragable = false
    imgnode.selected = false

    imgnode.paintMouseover = function () {
    }
    imgnode.addEventListener('mouseup', function () {
      imgnode.selected = false
    })
    imgnode.play()
    imgnode.visible = true

    if (self.animateNode) {
      clearInterval(self.animateT)
      JTopo.flag.curScene.remove(self.animateNode)
      delete self.animateNode
    }

    self.animateNode = imgnode

    let timeT = 0

    self.animateT = null
    self.endAnimate = false
    self.animateCallback = null

    let currentPathIndex = 0
    const _rate = rate || 200
    const _speed = speed || 10

    this.isremove = false

    // 返回起始与终止节点（或终止节点与起始节点）中进线和出线相等的所有线条
    function getAllEqualLinks(nodeA, nodeZ) {
      // 返回起始与终止节点中进线和出线相等的线条
      function sugar(nodeA, nodeZ) {
        const equalLinksArr = []

        if (!nodeA || !nodeZ) {
          return equalLinksArr
        }

        if (nodeA && nodeZ && nodeA.outLinks && nodeZ.inLinks) {
          for (let i = 0; i < nodeA.outLinks.length; i++) {

            const nodeAoutLink = nodeA.outLinks[i]

            for (let j = 0; j < nodeZ.inLinks.length; j++) {
              const nodeZinLink = nodeZ.inLinks[j]

              nodeAoutLink === nodeZinLink && equalLinksArr.push(nodeZinLink)
            }
          }
        }

        return equalLinksArr
      }

      const aToZequalLinksArr = sugar(nodeA, nodeZ)
      const zToAequalLinksArr = sugar(nodeZ, nodeA)

      return aToZequalLinksArr.concat(zToAequalLinksArr)
    }

    // 返回与当前连线对象不等的所有相等连线（出线与入线相等）
    function getAllUnequalLinksWithCurLinkInAllEqualLinks(self) {
      let allEqualLinksArr = getAllEqualLinks(self.nodeA, self.nodeZ)

      return allEqualLinksArr.filter(function (equalLink) {
        return self !== equalLink
      })
    }

    // 移除处理器
    self.removeHandler = function () {
      self.isremove = true

      this.nodeA
      && this.nodeA.outLinks
      && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (outLink) {
        return outLink !== self
      }))

      this.nodeZ
      && this.nodeZ.inLinks
      && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (inLink) {
        return inLink !== self
      }))

      // 返回与当前连线对象不等的所有相等连线（出线与入线相等）
      let allEqualLinksArr = getAllUnequalLinksWithCurLinkInAllEqualLinks(this)

      allEqualLinksArr.forEach(function (equalLink, index) {
        // 为出线与入线相等的连线设置节点索引
        equalLink.nodeIndex = index
      })
    }

    // 图片节点动画函数：图片在连线上的运动
    function imgnodeanime() {
      // 如果未移除
      if (!self.isremove) {
        if (self.nodeA.outLinks) {
          // 如果存在动画节点路径 且 动画节点路径数组的长度大于 0
          if (self.animateNodePath && self.animateNodePath.length > 0) {
            // 将动画节点路径赋值给路径
            self.path = self.animateNodePath
          }

          // 设置起始节点为当前路径索引对应的元素值
          const nodeA = self.path[currentPathIndex]
          // 设置终止节点为当前路径索引 + 1 后对应的元素值
          const nodeZ = self.path[currentPathIndex + 1]

          // 如果需要跳过当前终止节点
          if (nodeZ.jump) {
            ++currentPathIndex
            imgnodeanime()
            return
          }

          let L
          // 横向微调
          let subX
          // 纵向微调
          let subY
          // sin(a) or cos(a)
          let xl
          // sin(a) or cos(a)
          let yl
          // 起始节点和终止节点的横坐标差值
          const xs = nodeA.x - nodeZ.x
          // 起始节点和终止节点的纵坐标差值
          const xy = nodeA.y - nodeZ.y
          // 起始节点到终止节点的长度
          const l = Math.floor(Math.sqrt(xs * xs + xy * xy))

          ++timeT

          if (self.path.length === 2) {
            L = l
            xl = xs / L
            yl = xy / L
            subX = 0
            subY = 0
          }
          else {
            if (currentPathIndex === 0) {
              // 起点
              L = l
              xl = xs / L
              yl = xy / L
              subX = 0
              subY = 0
            }
            else if (currentPathIndex === self.path.length - 2) {
              // 末点
              L = l
              xl = xs / L
              yl = xy / L
              subX = 0
              subY = 0
            }
            else {
              // 中间
              L = l
              xl = xs / L
              yl = xy / L
              subX = 0
              subY = 0
            }
          }

          // 动画在横轴移动的总长度
          const lenX = timeT * xl * _speed
          // 动画在纵轴移动的总长度
          const lenY = timeT * yl * _speed

          // 节点旋转弧度 todo: 算法有问题 ？？
          imgnode.rotate = (Math.atan(xy / xs)) + (xs > 0 ? Math.PI : 0)

          imgnode.cx = nodeA.x - lenX - subX
          imgnode.cy = nodeA.y - lenY - subY

          if (L <= Math.floor(Math.sqrt(lenX * lenX + lenY * lenY))) {
            timeT = 0
            ++currentPathIndex

            if (currentPathIndex === self.path.length - 1) {
              currentPathIndex = 0
              self.endAnimate = false
              self.endCallback && self.endCallback()
            }

            imgnode.cx = self.path[currentPathIndex].x
            imgnode.cy = self.path[currentPathIndex].y
          }
        }
      }
      else {
        clearInterval(self.animateT)
        scene.remove(imgnode)
      }
    }

    self.animateT = setInterval(function () {
      imgnodeanime()

      JTopo.flag.clearAllAnimateT && clearInterval(self.animateT)
    }, _rate)

    scene.add(imgnode)

    return imgnode
  }

  // once fold link
  JTopo.FoldLink = function (nodeA, nodeZ, text) {
    this.initialize = function () {
      JTopo.FoldLink.prototype.initialize.apply(this, arguments)

      this.direction = "horizontal"
    }
    this.initialize(nodeA, nodeZ, text)

    this.getStartPosition = function () {
      const startPos = {
        x: this.nodeA.cx,
        y: this.nodeA.cy
      }

      if ("horizontal" === this.direction) {
        this.nodeZ.cx > startPos.x
          ? startPos.x += this.nodeA.width / 2
          : startPos.x -= this.nodeA.width / 2
      }
      else {
        this.nodeZ.cy > startPos.y
          ? startPos.y += this.nodeA.height / 2
          : startPos.y -= this.nodeA.height / 2
      }

      return startPos
    }
    this.getEndPosition = function () {
      const endPos = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      }

      if ("horizontal" === this.direction) {
        this.nodeA.cy < endPos.y
          ? endPos.y -= this.nodeZ.height / 2
          : endPos.y += this.nodeZ.height / 2
      }
      else {
        endPos.x = this.nodeA.cx < endPos.x
          ? this.nodeZ.x
          : this.nodeZ.x + this.nodeZ.width
      }

      return endPos
    }
    this.getPath = function (a) {
      const pathObj = []
      const startPos = this.getStartPosition()
      const endPos = this.getEndPosition()

      if (this.nodeA === this.nodeZ) return [startPos, endPos]

      let f
      let g
      const length = getSharedLinksLen(this.nodeA, this.nodeZ)
      const i = (length - 1) * this.bundleGap
      const j = this.bundleGap * a - i / 2

      if ("horizontal" === this.direction) {
        f = endPos.x + j
        g = startPos.y - j
        pathObj.push({
          x: startPos.x,
          y: g
        })
        pathObj.push({
          x: f,
          y: g
        })
        pathObj.push({
          x: f,
          y: endPos.y
        })
      }
      else {
        f = startPos.x + j
        g = endPos.y - j
        pathObj.push({
          x: f,
          y: startPos.y
        })
        pathObj.push({
          x: f,
          y: g
        })
        pathObj.push({
          x: endPos.x,
          y: g
        })
      }

      return pathObj
    }
    this.paintText = function (ctx, b) {
      if (
        this.text
        && this.text.length > 0
      ) {
        const c = b[1]
        const d = c.x + this.textOffsetX
        const e = c.y + this.textOffsetY

        ctx.save()
        ctx.beginPath()
        ctx.font = this.font

        const textW = ctx.measureText(this.text).width
        const cnW = ctx.measureText("田").width

        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"
        ctx.fillText(this.text, d - textW / 2, e - cnW / 2)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
      }
    }
  }
  JTopo.FoldLink.prototype = new JTopo.Link

  // twice fold link
  JTopo.FlexionalLink = function (nodeA, nodeZ, text) {
    this.initialize = function () {
      JTopo.FlexionalLink.prototype.initialize.apply(this, arguments)

      this.direction = "vertical"
      this.offsetGap = 44
    }
    this.initialize(nodeA, nodeZ, text)

    this.getStartPosition = function () {
      const startPos = {
        x: this.nodeA.cx,
        y: this.nodeA.cy
      }

      "horizontal" === this.direction
        ? startPos.x = this.nodeZ.cx < startPos.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width
        : startPos.y = this.nodeZ.cy < startPos.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height

      return startPos
    }
    this.getEndPosition = function () {
      const endPos = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      }

      "horizontal" === this.direction
        ? endPos.x = this.nodeA.cx < endPos.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width
        : endPos.y = this.nodeA.cy < endPos.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height

      return endPos
    }
    this.getPath = function (a) {
      const startPos = this.getStartPosition()
      const endPos = this.getEndPosition()

      if (this.nodeA === this.nodeZ) return [startPos, endPos]

      const pathObj = []

      const length = getSharedLinksLen(this.nodeA, this.nodeZ)
      // 所占宽度
      const g = (length - 1) * this.bundleGap
      // h 具体分配坐标, a 为线序号
      const h = this.bundleGap * a - g / 2
      // 出线的相对坐标
      let outH
      // 如果合并,则出线的相对坐标为 0
      this.mergeOutLink && (outH = 0)

      let i = this.offsetGap

      if ("horizontal" === this.direction) {
        this.nodeA.cx > this.nodeZ.cx && (i = -i)
        pathObj.push({
          x: startPos.x,
          y: startPos.y + outH
        })
        pathObj.push({
          x: startPos.x + i,
          y: startPos.y + outH
        })
        pathObj.push({
          x: endPos.x - i,
          y: endPos.y + h
        })
        pathObj.push({
          x: endPos.x,
          y: endPos.y + h
        })
      }
      else {
        this.nodeA.cy > this.nodeZ.cy && (i = -i)
        pathObj.push({
          x: startPos.x + outH,
          y: startPos.y
        })
        pathObj.push({
          x: startPos.x + outH,
          y: startPos.y + i
        })
        pathObj.push({
          x: endPos.x + h,
          y: endPos.y - i
        })
        pathObj.push({
          x: endPos.x + h,
          y: endPos.y
        })
      }

      return pathObj
    }
  }
  JTopo.FlexionalLink.prototype = new JTopo.Link

  // curve link
  JTopo.CurveLink = function (nodeA, nodeZ, text) {
    this.initialize = function () {
      JTopo.CurveLink.prototype.initialize.apply(this, arguments)
    }
    this.initialize(nodeA, nodeZ, text)

    this.paintPath = function (ctx, pathArr) {
      if (this.nodeA === this.nodeZ) return void this.paintLoop(ctx)

      ctx.beginPath()
      ctx.moveTo(pathArr[0].x, pathArr[0].y)

      for (let i = 1; i < pathArr.length; i++) {
        const p1 = pathArr[i - 1]
        const p2 = pathArr[i]
        const cpx = (p1.x + p2.x) / 2
        let cpy = (p1.y + p2.y) / 2

        cpy += (p2.y - p1.y) / 2

        ctx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")"
        ctx.lineWidth = this.lineWidth
        ctx.moveTo(p1.x, p1.cy)
        ctx.quadraticCurveTo(cpx, cpy, p2.x, p2.y)
        ctx.stroke()
      }

      ctx.stroke()
      ctx.closePath()

      if (this.arrowsRadius) {
        const p1 = pathArr[pathArr.length - 2]
        const p2 = pathArr[pathArr.length - 1]

        this.paintArrow(ctx, p1, p2)
      }
    }
  }
  JTopo.CurveLink.prototype = new JTopo.Link
}

initCircleNode(JTopo)

function initCircleNode(JTopo) {
  JTopo.BarChartNode = function () {
    const node = new JTopo.Node

    node.showSelected = !1
    node.width = 250
    node.height = 180
    node.colors = ["#3666B0", "#2CA8E0", "#77D1F6"]
    node.datas = [.3, .3, .4]
    node.titles = ["A", "B", "C"]

    node.paint = function (ctx) {
      const c = 3
      const w = (this.width - c) / this.datas.length

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = "#FFFFFF"
      ctx.strokeStyle = "#FFFFFF"
      ctx.moveTo(-this.width / 2 - 1, -this.height / 2)
      ctx.lineTo(-this.width / 2 - 1, this.height / 2 + 3)
      ctx.lineTo(this.width / 2 + c + 1, this.height / 2 + 3)
      ctx.stroke()
      ctx.closePath()
      ctx.restore()

      for (let i = 0; i < this.datas.length; i++) {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = node.colors[i]

        const h = this.datas[i]
        const x = i * (w + c) - this.width / 2
        const y = this.height - h - this.height / 2

        ctx.fillRect(x, y, w, h)

        const text = "" + parseInt(this.datas[i])
        const numTextWidth = ctx.measureText(text).width
        const cnTextWidth = ctx.measureText("田").width

        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(text, x + (w - numTextWidth) / 2, y - cnTextWidth)
        ctx.fillText(this.titles[text], x + (w - numTextWidth) / 2, this.height / 2 + cnTextWidth)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
      }
    }

    return node
  }
  JTopo.PieChartNode = function () {
    const circleNode = new JTopo.CircleNode

    circleNode.radius = 150
    circleNode.colors = ["#3666B0", "#2CA8E0", "#77D1F6"]
    circleNode.datas = [.3, .3, .4]
    circleNode.titles = ["A", "B", "C"]

    circleNode.paint = function (ctx) {
      circleNode.width = 2 * circleNode.radius
      circleNode.height = 2 * circleNode.radius

      let startAngle = 0

      for (let i = 0; i < this.datas.length; i++) {
        const g = this.datas[i] * Math.PI * 2

        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = circleNode.colors[i]
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, this.radius, startAngle, startAngle + g, !1)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
        ctx.beginPath()
        ctx.font = this.font

        const text = this.titles[i] + ": " + (100 * this.datas[i]).toFixed(2) + "%"
        const numTextWidth = ctx.measureText(text).width
        const j = (startAngle + startAngle + g) / 2

        let k = this.radius * Math.cos(j)
        const l = this.radius * Math.sin(j)

        j > Math.PI / 2 && j <= Math.PI
          ? k -= numTextWidth
          : j > Math.PI && j < 2 * Math.PI * 3 / 4
          ? k -= numTextWidth
          : j > 2 * Math.PI * .75

        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(text, k, l)
        ctx.moveTo(this.radius * Math.cos(j), this.radius * Math.sin(j))

        j > Math.PI / 2 && j < 2 * Math.PI * 3 / 4 && (k -= numTextWidth)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        startAngle += g
      }
    }

    return circleNode
  }
}

initContainerNode(JTopo)

function initContainerNode(JTopo) {
  JTopo.ContainerNode = function () {
    this.initialize = function (text) {
      JTopo.ContainerNode.prototype.initialize.apply(this, null)
      this.elementType = "containerNode"
      this.zIndex = JTopo.zIndex_Container
      this.width = 100
      this.height = 100
      this.childs = []
      this.alpha = .5
      this.dragable = !0
      this.childDragble = !0
      this.visible = !0
      this.fillColor = "10,100,80"
      this.borderWidth = 0
      this.shadowBlur = 10
      this.shadowColor = "rgba(255,255,255,1)"
      this.shadowOffsetX = 0
      this.shadowOffsetY = 0
      this.borderColor = "255,255,255"
      this.borderRadius = null
      this.font = "12px Consolas"
      this.fontColor = "255,255,255"
      this.text = text
      this.textPosition = "Bottom_Center"
      this.textOffsetX = 0
      this.textOffsetY = 0
      this.layout = new JTopo.layout.AutoBoundLayout
    }
    this.initialize(text)
    this.add = function (ele) {
      this.childs.push(ele)
      ele.dragable = this.childDragble

      !ele.parentContainer && (ele.parentContainer = [])

      ele.parentContainer.push(this)
    }
    /** remove an element from current containerNode */
    this.remove = function (ele) {
      for (let i = 0; i < this.childs.length; i++)
        if (this.childs[i] === ele) {
          ele.parentContainer = null
          this.childs = this.childs.del(i)
          ele.lastParentContainer = this
          break
        }
    }
    /** remove all elements from current containerNode */
    this.removeAll = function () {
      this.childs = []
    }
    this.setLocation = function (x, y) {
      const c = x - this.x
      const d = y - this.y

      this.x = x
      this.y = y

      for (let i = 0; i < this.childs.length; i++) {
        const ele = this.childs[i]

        // 相对位置
        ele.setLocation(ele.x + c, ele.y + d)
      }
    }
    this.doLayout = function (cb) {
      cb && cb(this, this.childs)
    }
    /** paint all nodes in current containerNode */
    this.paint = function (ctx) {
      if (this.visible) {
        this.layout && this.layout(this, this.childs)

        ctx.beginPath()
        ctx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"

        !this.borderRadius
          ? ctx.rect(this.x, this.y, this.width, this.height)
          : ctx.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius)

        ctx.fill()
        ctx.closePath()

        this.paintText(ctx)
        this.paintBorder(ctx)
      }
    }
    this.paintBorder = function (ctx) {
      if (this.borderWidth) {
        ctx.beginPath()
        ctx.lineWidth = this.borderWidth
        ctx.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")"

        const b = this.borderWidth / 2

        !this.borderRadius ?
          ctx.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth)
          : ctx.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius)

        ctx.stroke()
        ctx.closePath()
      }
    }
    this.paintText = function (ctx) {
      const text = this.text

      if (text) {
        ctx.beginPath()
        ctx.font = this.font

        const textW = ctx.measureText(text).width
        const cnW = ctx.measureText("田").width

        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"

        const e = this.getTextPostion(this.textPosition, textW, cnW)

        ctx.fillText(text, e.x, e.y)
        ctx.closePath()
      }
    }
    this.getTextPostion = function (a, b, c) {
      let d = null

      switch (a) {
        case 'Bottom_Center':
          d = {
            x: this.x + this.width / 2 - b / 2,
            y: this.y + this.height + c
          }
          break
        case 'Bottom_Top':
          d = {
            x: this.x + this.width / 2 - b / 2,
            y: this.y + this.height + c
          }
          break
        case 'Top_Center':
          d = {
            x: this.x + this.width / 2 - b / 2,
            y: this.y - c / 2
          }
          break
        case 'Top_Right':
          d = {
            x: this.x + this.width - b,
            y: this.y - c / 2
          }
          break
        case 'Top_Left':
          d = {
            x: this.x,
            y: this.y - c / 2
          }
          break
        case 'Bottom_Right':
          d = {
            x: this.x + this.width - b,
            y: this.y + this.height + c
          }
          break
        case 'Bottom_Left':
          d = {
            x: this.x,
            y: this.y + this.height + c
          }
          break
        case 'Middle_Center':
          d = {
            x: this.x + this.width / 2 - b / 2,
            y: this.y + this.height / 2 + c / 2
          }
          break
        case 'Middle_Right':
          d = {
            x: this.x + this.width - b,
            y: this.y + this.height / 2 + c / 2
          }
          break
        case 'Middle_Left':
          d = {
            x: this.x,
            y: this.y + this.height / 2 + c / 2
          }
          break
      }

      this.textOffsetX && (d.x += this.textOffsetX)
      this.textOffsetY && (d.y += this.textOffsetY)

      return d
    }
    this.paintMouseover = function () {

    }
    this.paintMouseout = function () {

    }
    this.paintSelected = function (a) {
      a.shadowBlur = this.shadowBlur
      a.shadowColor = this.shadowColor
      a.shadowOffsetX = this.shadowOffsetX
      a.shadowOffsetY = this.shadowOffsetY
    }
    this.removeHandler = function (f) {
      const self = this

      if (this.outLinks) {
        this.outLinks.forEach(function (b) {
          b.nodeA === self && f.remove(b)
        })

        this.outLinks = null
      }

      if (this.inLinks) {
        this.inLinks.forEach(function (b) {
          b.nodeZ === self && f.remove(b)
        })
        this.inLinks = null
      }
    }
  }
  JTopo.ContainerNode.prototype = new JTopo.InteractiveElement
}

initContainer(JTopo)

function initContainer(JTopo) {
  JTopo.Container = function (text) {
    this.initialize = function (text) {
      JTopo.Container.prototype.initialize.apply(this, null)

      this.elementType = "container"
      this.zIndex = JTopo.zIndex_Container

      this.width = 100
      this.height = 100
      this.containerPadding = 0
      this.topPadding = 60
      this.childs = []
      this.childDragble = !0
      this.alpha = 0
      this.dragable = !0
      this.visible = !0
      this.fillColor = "79,164,218"
      this.borderBgFillColor = null
      this.borderBgAlpha = 0.3
      this.borderTextBg = "rgba(108,208,226,1)"
      this.borderWidth = 1
      this.borderColor = "108,208,226"
      this.borderRadius = 5
      this.borderDashed = false
      this.borderAlpha = 1
      this.borderPadding = 15
      this.shadowBlur = 5
      this.shadowColor = "rgba(43,43,43,0.5)"
      this.shadowOffsetX = 0
      this.shadowOffsetY = 0
      this.font = "16px 微软雅黑"
      this.fontColor = "255,255,255"
      this.text = text
      this.textAlpha = 1
      this.textPosition = "Top_Bottom"
      this.textOffsetX = 0
      this.textOffsetY = 11
      this.textPositionMsg = {
        x: null,
        y: null,
        width: null,
        height: null
      }
      this.layout = new JTopo.layout.AutoBoundLayout
    }
    this.initialize(text)

    this.add = function (ele) {
      this.childs.push(ele)

      ele.dragable = this.childDragble

      !ele.parentContainer && (ele.parentContainer = [])

      ele.parentContainer.push(this)
    }
    this.remove = function (ele) {
      for (let i = 0; i < this.childs.length; i++) {
        if (this.childs[i] === ele) {
          ele.parentContainer = null

          this.childs = this.childs.del(i)

          ele.lastParentContainer = this

          break
        }
      }
    }
    this.removeAll = function () {
      this.childs = []
    }
    this.setLocation = function (x, y) {
      const dx = x - this.x
      const dy = y - this.y

      this.x = x
      this.y = y

      for (let i = 0; i < this.childs.length; i++) {
        const ele = this.childs[i]

        ele.setLocation(ele.x + dx, ele.y + dy)
      }
    }
    this.doLayout = function (cb) {
      cb && cb(this, this.childs)
    }
    this.paint = function (ctx) {
      if (this.visible) {
        this.layout && this.layout(this, this.childs)

        ctx.beginPath()
        ctx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")"

        !this.borderRadius
          ? ctx.rect(this.x, this.y, this.width, this.height)
          : ctx.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius)

        ctx.fill()
        ctx.closePath()
        this.paintBorder(ctx)
      }

      this.paintText(ctx)

      if (!this.childs.length) {
        JTopo.flag.scene.remove(this)
      }
    }
    this.paintBorder = function (ctx) {
      if (this.borderWidth) {
        // 获取容器内部所有的子元素

        // 所有一行文字的高度
        const textHeight = ctx.measureText("田").width
        const thisObj = this
        const compareObj = {
          left: null,
          right: null,
          top: null,
          bottom: null
        }

        thisObj.childs.forEach(function (p) {
          let textWidth = ctx.measureText(p.text || '').width

          // 获取文字的相对位置
          const pObj = p.getTextPostion(p.textPosition, textWidth, textHeight)

          // 获取文字左下角的位置，注意不是左上角
          pObj.x += p.x + p.width / 2
          pObj.y += p.y + p.height / 2

          // 获取文字+节点整体的边界
          if (p.width > textWidth) {
            pObj.x = p.x
            textWidth = p.width
          }

          if (!compareObj.left || compareObj.left > pObj.x) {
            compareObj.left = pObj.x
          }

          if (!compareObj.right || compareObj.right < pObj.x + textWidth) {
            compareObj.right = pObj.x + textWidth
          }

          if (!compareObj.top || compareObj.top > pObj.y - textHeight) {
            compareObj.top = pObj.y - textHeight

          }

          if (!compareObj.bottom || compareObj.bottom < pObj.y) {
            compareObj.bottom = pObj.y
          }

        })

        sugar(thisObj, compareObj)

        function sugar(thisObj, compareObj) {
          const leftW = thisObj.x - compareObj.left
          const rightW = thisObj.x + thisObj.width - compareObj.right
          const topH = thisObj.y - compareObj.top
          const bottomH = thisObj.y + textHeight - compareObj.bottom

          if (leftW > 0) {
            thisObj.x = compareObj.left
            thisObj.width += leftW
          }
          if (rightW < 0) {
            thisObj.width = compareObj.right - thisObj.x
          }
          if (topH > 0) {
            thisObj.y = compareObj.top
            thisObj.height += topH
          }
          if (bottomH < 0) {
            thisObj.height = compareObj.bottom - thisObj.y
          }

          const len = thisObj.borderPadding
          thisObj.x -= len * 2
          thisObj.y -= thisObj.topPadding
          thisObj.width += len * 4
          thisObj.height += len * 5

          // 跟 title 比较宽度
          const titleWidth = ctx.measureText(thisObj.text || '').width + 60
          const subWidth = titleWidth - thisObj.width

          if (subWidth > 0) {
            thisObj.x -= subWidth / 2 + len
            thisObj.width = titleWidth + 2 * len
          }
        }

        const pp = this.containerPadding

        ctx.beginPath()
        ctx.lineWidth = this.borderWidth
        ctx.strokeStyle = "rgba(" + this.borderColor + "," + this.borderAlpha + ")"

        const b = this.borderWidth / 2

        !this.borderRadius
          ? ctx.rect(this.x - b - pp, this.y - b - pp, this.width + this.borderWidth + 2 * pp, this.height + this.borderWidth + 200)
          : ctx.JTopoRoundRect(this.x - b - pp, this.y - b - pp, this.width + this.borderWidth + 2 * pp, this.height + this.borderWidth + 200, this.borderRadius, this.borderDashed)

        ctx.stroke()

        if (this.borderBgFillColor) {
          ctx.fillStyle = "rgba(" + this.borderBgFillColor + "," + this.borderBgAlpha + ")"
          ctx.fill()
        }

        ctx.closePath()
      }
    }
    this.paintText = function (ctx) {
      const text = this.text

      if (text) {
        ctx.beginPath()
        ctx.font = this.font

        const textW = ctx.measureText(text).width
        const cnW = ctx.measureText("田").width
        const textPos = this.getTextPostion(this.textPosition, textW, cnW)

        TextPos.y -= 0.8
        ctx.fillStyle = this.borderTextBg

        ctx.beginPath()
        ctx.moveTo(textPos.x - 20, textPos.y - cnW - 3)
        ctx.lineTo(textPos.x + textW + 20, textPos.y - cnW - 3)
        ctx.lineTo(textPos.x + textW + 10, textPos.y + 5)
        ctx.lineTo(textPos.x - 10, textPos.y + 5)
        ctx.fill()
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.textAlpha + ")"
        ctx.fillText(text, textPos.x, textPos.y - 1)
        ctx.closePath()

        this.textPositionMsg = {
          x: textPos.x - 20,
          y: textPos.y - cnW - 3,
          width: textW + 40,
          height: cnW + 8
        }
      }
    }
    this.getTextPostion = function (posDesc, e, h) {
      let textPos = null

      switch (posDesc) {
        case 'Bottom_Center':
          textPos = {
            x: this.x + this.width / 2 - e / 2,
            y: this.y + this.height + h
          }
          break
        case 'Bottom_Top':
          textPos = {
            x: this.x + this.width / 2 - e / 2,
            y: this.y + this.height + h
          }
          break
        case 'Top_Center':
          textPos = {
            x: this.x + this.width / 2 - e / 2,
            y: this.y - h / 2
          }
          break
        case 'Top_Bottom':
          textPos = {
            x: this.x + this.width / 2 - e / 2,
            y: this.y + h / 2
          }
          break
        case 'Top_Right':
          textPos = {
            x: this.x + this.width - e,
            y: this.y - h / 2
          }
          break
        case 'Top_Left':
          textPos = {
            x: this.x,
            y: this.y - h / 2
          }
          break
        case 'Bottom_Right':
          textPos = {
            x: this.x + this.width - e,
            y: this.y + this.height + h
          }
          break
        case 'Bottom_Left':
          textPos = {
            x: this.x,
            y: this.y + this.height + h
          }
          break
        case 'Middle_Center':
          textPos = {
            x: this.x + this.width / 2 - e / 2,
            y: this.y + this.height / 2 + h / 2
          }
          break
        case 'Middle_Right':
          textPos = {
            x: this.x + this.width - e,
            y: this.y + this.height / 2 + h / 2
          }
          break
        case 'Middle_Left':
          textPos = {
            x: this.x,
            y: this.y + this.height / 2 + h / 2
          }
          break
      }

      this.textOffsetX && (textPos.x += this.textOffsetX)
      this.textOffsetY && (textPos.y += this.textOffsetY)

      return textPos
    }
    this.paintMouseover = function () {
    }
    this.paintSelected = function (b) {
      b.shadowBlur = this.shadowBlur
      b.shadowColor = this.shadowColor
      b.shadowOffsetX = this.shadowOffsetX
      b.shadowOffsetY = this.shadowOffsetY
    }
    this.removeHandler = function (f) {
      const self = this

      if (this.outLinks) {
        this.outLinks.forEach(function (outLink) {
          outLink.nodeA === self && f.remove(outLink)
        })
        this.outLinks = null
      }

      if (this.inLinks) {
        this.inLinks.forEach(function (inLink) {
          inLink.nodeZ === self && f.remove(inLink)
        })
        this.inLinks = null
      }
    }
  }
  JTopo.Container.prototype = new JTopo.InteractiveElement
}

initScene(JTopo)

function initScene(JTopo) {
  JTopo.Scene = function Scene(stage) {
    let self = this
    JTopo.flag.curScene = self

    // 返回一个绘制矩形的函数
    function drawRect(x, y, w, h) {
      return function (ctx) {
        ctx.beginPath()
        ctx.strokeStyle = "rgba(0, 0, 236, 0.5)"
        ctx.fillStyle = "rgba(0, 0, 236, 0.1)"
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
      }
    }

    self.initialize = function () {
      JTopo.Scene.prototype.initialize.apply(self, arguments)

      self.messageBus = new JTopo.util.MessageBus
      self.elementType = "scene"
      self.childs = []
      self.zIndexMap = {}
      self.zIndexArray = []
      self.backgroundColor = "255, 255, 255"
      self.visible = !0
      self.alpha = 0
      self.scaleX = 1
      self.scaleY = 1
      self.mode = JTopo.SceneMode.normal
      self.translate = !0
      self.translateX = 0
      self.translateY = 0
      self.lastTranslateX = 0
      self.lastTranslateY = 0
      self.mouseDown = !1
      self.mouseDownX = null
      self.mouseDownY = null
      self.mouseDownEvent = null
      self.areaSelect = !0
      self.operations = []
      self.selectedElements = []
      self.paintAll = !1

      const properties = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",")

      self.serializedProperties = self.serializedProperties.concat(properties)
    }
    self.initialize()

    self.setBackground = function (url) {
      self.background = url
    }

    self.addTo = function (stage) {
      self.stage !== stage
      && stage
      && (self.stage = stage)
    }

    if (stage) {
      stage.add(self)
      self.addTo(stage)
    }

    self.show = function () {
      self.visible = !0
    }

    self.hide = function () {
      self.visible = !1
    }

    self.paint = function (ctx, mapTag) {
      if (self.visible && self.stage) {
        ctx.save()
        self.paintBackground(ctx)
        ctx.restore()
        ctx.save()
        ctx.scale(self.scaleX, self.scaleY)

        if (self.translate) {
          const offsetTransObj = self.getOffsetTranslate(ctx)

          if (mapTag !== 'eagleEye') {
            ctx.translate(offsetTransObj.translateX, offsetTransObj.translateY)
          }
        }

        self.paintChilds(ctx)
        ctx.restore()
        ctx.save()
        self.paintOperations(ctx, self.operations)
        ctx.restore()
      }
    }

    self.repaint = function (ctx, mapTag) {
      self.visible && self.paint(ctx, mapTag)
    }

    self.paintBackground = function (ctx) {
      if (self.background) {
        ctx.drawImage(self.background, 0, 0, ctx.canvas.width, ctx.canvas.height)
      }
      else {
        ctx.beginPath()
        ctx.fillStyle = "rgba(" + self.backgroundColor + "," + self.alpha + ")"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.closePath()
      }
    }

    // 获取场景中可见并绘制出来的元素（超过 Canvas 边界）
    self.getDisplayedElements = function () {
      let displayedEleArr = []

      for (
        let i = 0;
        i < self.zIndexArray.length;
        i++
      ) {
        const c = self.zIndexArray[i]
        const eleArr = self.zIndexMap[c]

        for (let j = 0; j < eleArr.length; j++) {
          const ele = eleArr[j]

          self.isVisiable(ele) && displayedEleArr.push(ele)
        }
      }

      return displayedEleArr
    }

    // 获取场景中可见并绘制出来的 Node 对象（超过 Canvas 边界）
    self.getDisplayedNodes = function () {
      let displayedNodeArr = []

      for (let i = 0; i < self.childs.length; i++) {
        const ele = self.childs[i]

        ele instanceof JTopo.Node
        && self.isVisiable(ele)
        && displayedNodeArr.push(ele)
      }

      return displayedNodeArr
    }

    self.paintChilds = function (ctx) {
      for (let i = 0; i < self.zIndexArray.length; i++) {
        const zIndex = self.zIndexArray[i]
        const eleArr = self.zIndexMap[zIndex]

        for (let j = 0; j < eleArr.length; j++) {
          const ele = eleArr[j]

          if (
            self.paintAll
            || self.isVisiable(ele)
          ) {
            ctx.save()

            if (
              ele.transformAble
            ) {
              const h = ele.getCenterLocation()

              ctx.translate(h.x, h.y)

              if (ele.rotate) {
                ctx.rotate(ele.rotate)

                if (ele.scaleX && ele.scaleY) {
                  ctx.scale(ele.scaleX, ele.scaleY)
                } else {
                  ele.scaleX
                    ? ctx.scale(ele.scaleX, 1)
                    : ele.scaleY && ctx.scale(1, ele.scaleY)
                }
              }
            }

            if (ele.shadow) {
              ctx.shadowBlur = ele.shadowBlur
              ctx.shadowColor = ele.shadowColor
              ctx.shadowOffsetX = ele.shadowOffsetX
              ctx.shadowOffsetY = ele.shadowOffsetY
            }

            if (ele instanceof JTopo.InteractiveElement) {
              ele.selected
              && ele.showSelected
              && ele.paintSelected(ctx)

              ele.isMouseOver && ele.paintMouseover(ctx)
            }

            ele.paint(ctx)
            ctx.restore()
          }
        }
      }
    }

    // 获取相对位移
    self.getOffsetTranslate = function (a) {
      let w = self.stage.canvas.width
      let h = self.stage.canvas.height

      if (
        a
        && "move" !== a
      ) {
        w = a.canvas.width
        h = a.canvas.height
      }

      let x = w / self.scaleX / 2
      let y = h / self.scaleY / 2

      return {
        translateX: self.translateX + (x - x * self.scaleX),
        translateY: self.translateY + (y - y * self.scaleY)
      }
    }

    self.isVisiable = function (ele) {
      if (!ele.visible) return false

      if (ele instanceof JTopo.Link) return true

      const offsetTranslateObj = self.getOffsetTranslate()
      let x = ele.x + offsetTranslateObj.translateX
      let y = ele.y + offsetTranslateObj.translateY

      x *= self.scaleX
      y *= self.scaleY

      const f = x + ele.width * self.scaleX
      const g = y + ele.height * self.scaleY

      return x > self.stage.canvas.width
      || y > self.stage.canvas.height
      || 0 > f
      || 0 > g
        ? !1
        : !0
    }

    self.paintOperations = function (a, operations) {
      for (let i = 0; i < operations.length; i++) {
        operations[i](a)
      }
    }

    /** get elementArr by ClassName in scene, every element is instance of the ClassName */
    self.findElements = function (cb) {
      let eleArr = []

      for (let i = 0; i < self.childs.length; i++) {
        cb(self.childs[i]) && eleArr.push(self.childs[i])
      }

      return eleArr
    }

    /** get elementArr by ClassName in scene, every element is instance of the ClassName */
    self.getElementsByClass = function (ClassName) {
      return self.findElements(function (ele) {
        return ele instanceof ClassName
      })
    }

    self.addOperation = function (operation) {
      self.operations.push(operation)

      return self
    }

    self.clearOperations = function () {
      self.operations = []

      return self
    }

    self.getElementByXY = function (x, y) {
      let d = null

      for (let i = self.zIndexArray.length - 1; i >= 0; i--) {
        const zIndex = self.zIndexArray[i]
        const eleArr = self.zIndexMap[zIndex]

        for (let j = eleArr.length - 1; j >= 0; j--) {
          const ele = eleArr[j]

          if (
            ele instanceof JTopo.InteractiveElement
            && self.isVisiable(ele)
            && ele.isInBound(x, y)
          ) {
            return d = ele
          }

        }
      }

      return d
    }

    // 添加对象到当前场景中来，例如：scene.add(new JTopo.Node()); scene.add(new JTopo.Link(nodeA, nodeZ))
    self.add = function (ele) {
      self.childs.push(ele)

      if (!self.zIndexMap[ele.zIndex]) {
        self.zIndexMap[ele.zIndex] = []
        self.zIndexArray.push(ele.zIndex)
        self.zIndexArray.sort(function (a, b) {
          return a - b
        })
      }

      self.zIndexMap["" + ele.zIndex].push(ele)

      setTimeout(function () {
        self.stage && self.stage.eagleEye.update()
      }, 100)
    }

    // 移除场景中的某个元素，例如：scene.remove(myNode);
    self.remove = function (ele) {
      self.childs = JTopo.util.removeFromArray(self.childs, ele)

      const c = self.zIndexMap[ele.zIndex]

      c && (self.zIndexMap[ele.zIndex] = JTopo.util.removeFromArray(c, ele))

      ele.removeHandler(self)

      setTimeout(function () {
        self.stage && self.stage.eagleEye.update()
      }, 100)
    }

    // 移除场景中的所有元素
    self.clear = function () {
      self.childs.forEach(function (child) {
        child.removeHandler(self)
      })

      self.childs = []
      self.operations = []
      self.zIndexArray = []
      self.zIndexMap = {}

      setTimeout(function () {
        self.stage && self.stage.eagleEye.update()
      }, 100)
    }

    self.addToSelected = function (ele) {
      self.selectedElements.push(ele)
    }

    self.cancelAllSelected = function (a) {
      for (let i = 0; i < self.selectedElements.length; i++) {
        self.selectedElements[i].unselectedHandler(a)
      }

      self.selectedElements = []
    }

    self.notInSelectedNodes = function (a) {
      for (let i = 0; i < self.selectedElements.length; i++) {
        if (a === self.selectedElements[i]) return false
      }

      return true
    }

    self.removeFromSelected = function (a) {
      for (let i = 0; i < self.selectedElements.length; i++) {

        a === self.selectedElements[i]
        && (self.selectedElements = self.selectedElements.del(i))
      }
    }

    self.toSceneEvent = function (e) {
      const eObj = JTopo.util.clone(e)

      eObj.x /= self.scaleX
      eObj.y /= self.scaleY

      if (self.translate) {
        const offsetTranslateObj = self.getOffsetTranslate()

        eObj.x -= offsetTranslateObj.translateX
        eObj.y -= offsetTranslateObj.translateY
      }

      if (eObj.dx) {
        eObj.dx /= self.scaleX
        eObj.dy /= self.scaleY
      }

      self.currentElement && (eObj.target = self.currentElement)
      eObj.scene = self

      return eObj
    }

    self.selectElement = function (eObj) {
      const ele = self.getElementByXY(eObj.x, eObj.y)

      if (ele) {
        eObj.target = ele
        ele.mousedownHander(eObj)
        ele.selectedHandler(eObj)

        if (self.notInSelectedNodes(ele)) {
          eObj.ctrlKey || self.cancelAllSelected()

          self.addToSelected(ele)
        } else {
          if (1 === eObj.ctrlKey) {
            ele.unselectedHandler()
            self.removeFromSelected(ele)
          }

          for (let i = 0; i < self.selectedElements.length; i++) {
            const d = self.selectedElements[i]
            d.selectedHandler(eObj)
          }
        }
      } else {

        eObj.ctrlKey || self.cancelAllSelected()
      }

      self.currentElement = ele
    }

    self.mousedownHandler = function (e) {
      const e = self.toSceneEvent(e)

      self.mouseDown = !0
      self.mouseDownX = e.x
      self.mouseDownY = e.y
      self.mouseDownEvent = e

      if (self.mode === JTopo.SceneMode.normal) {
        self.selectElement(e)

        if (
          !self.currentElement
          || self.currentElement instanceof JTopo.Link
          && self.translate
        ) {
          self.lastTranslateX = self.translateX
          self.lastTranslateY = self.translateY
        }
      } else {
        if (
          self.mode === JTopo.SceneMode.drag
          && self.translate
        ) {
          self.lastTranslateX = self.translateX
          self.lastTranslateY = self.translateY
          return
        }

        if (self.mode === JTopo.SceneMode.select) {
          self.selectElement(e)
        } else {
          if (self.mode === JTopo.SceneMode.edit) {
            self.selectElement(e)

            if (
              !self.currentElement
              || self.currentElement instanceof JTopo.Link
              && self.translate
            ) {
              self.lastTranslateX = self.translateX
              self.lastTranslateY = self.translateY
            }
          }
        }
      }

      self.dispatchEvent("mousedown", e)
    }

    self.mouseupHandler = function (e) {
      self.stage.cursor !== JTopo.MouseCursor.normal
      && (self.stage.cursor = JTopo.MouseCursor.normal)

      self.clearOperations()

      const e = self.toSceneEvent(e)

      if (self.currentElement) {
        e.target = self.currentElement
        self.currentElement.mouseupHandler(e)
      }

      self.dispatchEvent("mouseup", e)
      self.mouseDown = false
    }

    self.dragElements = function (e) {
      if (
        self.currentElement
        && self.currentElement.dragable
      ) {
        for (let i = 0; i < self.selectedElements.length; i++) {
          const selectedEle = self.selectedElements[i]

          if (selectedEle.dragable) {
            const e = JTopo.util.clone(e)

            e.target = selectedEle
            selectedEle.mousedragHandler(e)
          }
        }
      }
    }

    self.mousedragHandler = function (e) {
      const e = self.toSceneEvent(e)

      if (self.mode === JTopo.SceneMode.normal) {
        if (
          !self.currentElement
          || self.currentElement instanceof JTopo.Link
        ) {
          if (self.translate) {
            self.stage.cursor = JTopo.MouseCursor.closed_hand
            self.translateX = self.lastTranslateX + e.dx
            self.translateY = self.lastTranslateY + e.dy
          }
        } else {
          self.dragElements(e)
        }
      } else {
        if (self.mode === JTopo.SceneMode.drag) {
          if (self.translate) {
            self.stage.cursor = JTopo.MouseCursor.closed_hand
            self.translateX = self.lastTranslateX + e.dx
            self.translateY = self.lastTranslateY + e.dy
          }
        } else {
          if (self.mode === JTopo.SceneMode.select) {
            self.currentElement
              ? self.currentElement.dragable && self.dragElements(e)
              : self.areaSelect && self.areaSelectHandle(e)
          } else {
            if (self.mode === JTopo.SceneMode.edit) {
              if (
                !self.currentElement
                || self.currentElement instanceof JTopo.Link
              ) {
                if (self.translate) {
                  self.stage.cursor = JTopo.MouseCursor.closed_hand
                  self.translateX = self.lastTranslateX + e.dx
                  self.translateY = self.lastTranslateY + e.dy
                }
              } else {
                self.dragElements(e)
              }
            }
          }
        }
      }

      self.dispatchEvent("mousedrag", e)
    }

    self.areaSelectHandle = function (e) {
      let b = e.offsetLeft
      let c = e.offsetTop
      let f = self.mouseDownEvent.offsetLeft
      let g = self.mouseDownEvent.offsetTop
      let x = b >= f ? f : b
      let y = c >= g ? g : c
      let w = Math.abs(e.dx) * self.scaleX
      let h = Math.abs(e.dy) * self.scaleY

      const l = new drawRect(x, y, w, h)

      self.clearOperations().addOperation(l)
      b = e.x
      c = e.y
      f = self.mouseDownEvent.x
      g = self.mouseDownEvent.y
      x = b >= f ? f : b
      y = c >= g ? g : c
      w = Math.abs(e.dx)
      h = Math.abs(e.dy)

      const m = x + w
      const n = y + h

      for (let i = 0; i < self.childs.length; i++) {
        const p = self.childs[i]

        if (
          p.x > x
          && p.x + p.width < m
          && p.y > y
          && p.y + p.height < n
          && self.notInSelectedNodes(p)
        ) {
          p.selectedHandler(e)
          self.addToSelected(p)
        }
      }
    }

    self.mousemoveHandler = function (eObj) {
      self.mousecoord = {
        x: eObj.x,
        y: eObj.y
      }

      const e = self.toSceneEvent(eObj)

      if (self.mode === JTopo.SceneMode.drag) {
        self.stage.cursor = JTopo.MouseCursor.open_hand
        return
      }

      if (self.mode === JTopo.SceneMode.normal) {
        self.stage.cursor = JTopo.MouseCursor.normal
      } else {
        self.mode === JTopo.SceneMode.select
        && (self.stage.cursor = JTopo.MouseCursor.normal)
      }

      const ele = self.getElementByXY(e.x, e.y)

      if (ele) {
        if (
          self.mouseOverelement
          && self.mouseOverelement !== ele
        ) {
          e.target = ele
          self.mouseOverelement.mouseoutHandler(e)
        }

        self.mouseOverelement = ele

        if (!ele.isMouseOver) {
          e.target = ele
          ele.mouseoverHandler(e)
          self.dispatchEvent("mouseover", e)
        } else {
          e.target = ele
          ele.mousemoveHandler(e)
          self.dispatchEvent("mousemove", e)
        }
      } else {
        if (self.mouseOverelement) {
          e.target = ele
          self.mouseOverelement.mouseoutHandler(e)
          self.mouseOverelement = null
          self.dispatchEvent("mouseout", e)
        } else {
          e.target = null
          self.dispatchEvent("mousemove", e)
        }
      }
    }

    self.mouseoverHandler = function (eObj) {
      const e = self.toSceneEvent(eObj)
      self.dispatchEvent("mouseover", e)
    }

    self.mouseoutHandler = function (eObj) {
      const e = self.toSceneEvent(eObj)
      self.dispatchEvent("mouseout", e)
    }

    self.clickHandler = function (eObj) {
      const e = self.toSceneEvent(eObj)

      if (self.currentElement) {
        e.target = self.currentElement
        self.currentElement.clickHandler(e)
      }

      self.dispatchEvent("click", e)
    }

    self.dbclickHandler = function (eObj) {
      const e = self.toSceneEvent(eObj)

      if (self.currentElement) {
        e.target = self.currentElement
        self.currentElement.dbclickHandler(e)
      } else {
        self.cancelAllSelected()
        self.dispatchEvent("dbclick", e)
      }
    }

    self.mousewheelHandler = function (eObj) {
      const e = self.toSceneEvent(eObj)
      self.dispatchEvent("mousewheel", e)
    }

    self.touchstart = self.mousedownHander

    self.touchmove = self.mousedragHandler

    self.touchend = self.mousedownHander

    self.keydownHandler = function (eObj) {
      self.dispatchEvent("keydown", eObj)
    }

    self.keyupHandler = function (eObj) {
      self.dispatchEvent("keyup", eObj)
    }

    self.addEventListener = function (eName, cb) {
      const fn = function (eName) {
        cb.call(self, eName)
      }

      self.messageBus.subscribe(eName, fn)

      return self
    }

    self.removeEventListener = function (eName) {
      self.messageBus.unsubscribe(eName)
    }

    self.removeAllEventListener = function () {
      self.messageBus = new JTopo.util.MessageBus
    }

    self.dispatchEvent = function (eName, eObj) {
      self.messageBus.publish(eName, eObj)

      return self
    }

    let eNameArr = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(",")

    eNameArr.forEach(function (eName) {
      self[eName] = function (cb) {
        cb
          ? self.addEventListener(eName, cb)
          : self.dispatchEvent(eName)
      }
    })

    self.zoom = function (scaleX, scaleY) {
      scaleX && (self.scaleX = scaleX)
      scaleY && (self.scaleY = scaleY)
    }

    self.zoomOut = function (scale) {
      if (scale) {
        self.scaleX /= scale
        self.scaleY /= scale
      } else {
        self.scaleX /= .8
        self.scaleY /= .8
      }
    }

    self.zoomIn = function (scale) {
      if (scale) {
        self.scaleX *= scale
        self.scaleY *= scale
      } else {
        self.scaleX *= .8
        self.scaleY *= .8
      }
    }

    self.zoomReset = function () {
      self.scaleX = 1
      self.scaleY = 1
    }

    self.getBound = function () {
      return {
        left: 0,
        top: 0,
        right: self.stage.canvas.width,
        bottom: self.stage.canvas.height,
        width: self.stage.canvas.width,
        height: self.stage.canvas.height
      }
    }

    self.getElementsBound = function () {
      return JTopo.util.getElementsBound(self.childs)
    }

    self.translateToCenter = function (a) {
      const bObj = self.getElementsBound()

      let x = self.stage.canvas.width / 2 - (bObj.left + bObj.right) / 2
      let y = self.stage.canvas.height / 2 - (bObj.top + bObj.bottom) / 2

      if (a) {
        x = a.canvas.width / 2 - (bObj.left + bObj.right) / 2
        y = a.canvas.height / 2 - (bObj.top + bObj.bottom) / 2
      }

      self.translateX = x
      self.translateY = y
    }

    self.setCenter = function (x, y) {
      let translateX = x - self.stage.canvas.width / 2
      let translateY = y - self.stage.canvas.height / 2

      self.translateX = -translateX
      self.translateY = -translateY
    }

    self.centerAndZoom = function (a, b, c) {
      if (a === 'toCenter') {
        self.translateToCenter(c)

        return
      }

      self.translateToCenter(c)

      if (!a || !b) {
        const bObj = self.getElementsBound()

        let w = bObj.right - bObj.left
        let h = bObj.bottom - bObj.top
        let scaleW = self.stage.canvas.width / w
        let scaleH = self.stage.canvas.height / h

        if (c) {
          const canvasObj = document.getElementById('canvas')
          const canvasWidth = canvasObj.width
          const canvasHeight = canvasObj.height

          w < canvasWidth && (w = canvasWidth)
          h < canvasWidth && (h = canvasHeight)

          scaleW = c.canvas.width / w
          scaleH = c.canvas.height / h
        }

        const min = Math.min(scaleW, scaleH)

        if (min > 1) return

        self.zoom(min, min)
      }

      self.zoom(a, b)
    }

    self.getCenterLocation = function () {
      return {
        x: self.stage.canvas.width / 2,
        y: self.stage.canvas.height / 2
      }
    }

    self.doLayout = function (fn) {
      fn && fn(self, self.childs)
    }

    self.toJson = function () {
      let b = "{"

      self.serializedProperties.forEach(function (key) {
        "background" === key && (self[key] = self._background.src)
        "string" === typeof self[key]
        && (self[key] = '"' + val + '"')
        b += '"' + key + '":' + self[key] + ","
      })

      b += '"childs":['

      let len = self.childs.length

      self.childs.forEach(function (key, index) {
        b += key.toJson()
        len > index + 1 && (b += ",")
      })
      b += "]"
      b += "}"

      return b
    }

    return self
  }
  JTopo.Scene.prototype = new JTopo.Element

  let c = {}

  Object.defineProperties(JTopo.Scene.prototype, {
    background: {
      get: function () {
        return this._background
      },
      set: function (a) {
        if ("string" === typeof a) {
          let b = c[a]

          if (!b) {
            b = new Image
            b.src = a
            b.onload = function () {
              c[a] = b
            }
          }

          this._background = b
        }
        else {
          this._background = a
        }
      }
    }
  })
}

initStage(JTopo)

function initStage(JTopo) {
  function eagleEye(stage) {
    return {
      hgap: 16,
      visible: !1,
      exportCanvas: document.createElement("canvas"),
      getImage(width, height) {
        const boundary = stage.getBound()
        let scaleWidth = 1
        let scaleHeight = 1

        this.exportCanvas.width = stage.canvas.width
        this.exportCanvas.height = stage.canvas.height

        if (width && height) {
          this.exportCanvas.width = width
          this.exportCanvas.height = height
          scaleWidth = width / boundary.width
          scaleHeight = height / boundary.height
        } else {
          boundary.width > stage.canvas.width
          && (this.exportCanvas.width = boundary.width)
          boundary.height > stage.canvas.height
          && (this.exportCanvas.height = boundary.height)
        }

        const ctx = this.exportCanvas.getContext("2d")

        if (stage.childs.length > 0) {
          ctx.save()
          ctx.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height)

          stage.childs.forEach(function (scene) {
            if (scene.visible) {
              scene.save()
              scene.translateX = 0
              scene.translateY = 0
              scene.scaleX = 1
              scene.scaleY = 1
              ctx.scale(scaleWidth, scaleHeight)
              boundary.left < 0 && (scene.translateX = Math.abs(boundary.left))
              boundary.top < 0 && (scene.translateY = Math.abs(boundary.top))
              scene.paintAll = !0
              scene.repaint(ctx)
              scene.paintAll = !1
              scene.restore()
            }
          })

          ctx.restore()

          return this.exportCanvas.toDataURL("image/png")
        }
      },
      canvas: document.createElement("canvas"),
      update() {
        this.eagleImageDatas = this.getData(stage)
      },
      setSize(w, h) {
        this.width = this.canvas.width = w
        this.height = this.canvas.height = h
      },
      getData(w, h) {
        const ctx = this.canvas.getContext("2d")
        const canvas = document.getElementById('canvas')
        const container_w = 250
        const container_h = container_w * canvas.height / canvas.width

        w && h
          ? this.setSize(w, h)
          : this.setSize(container_w, container_h)

        function getTranslateObj(scene) {
          const canvasW = scene.stage.canvas.width
          const canvasH = scene.stage.canvas.height
          const x = canvasW / scene.scaleX / 2
          const y = canvasH / scene.scaleY / 2

          return {
            translateX: scene.translateX + x - x * scene.scaleX,
            translateY: scene.translateY + y - y * scene.scaleY,
          }
        }

        if (stage.childs.length > 0) {
          ctx.save()
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

          stage.childs.forEach(function (scene) {
            if (scene.visible) {
              scene.save()
              scene.centerAndZoom(null, null, ctx)
              scene.repaint(ctx, 'eagleEye')
              scene.restore()
            }
          })

          let translateObj = getTranslateObj(stage.childs[0])

          let translateX = translateObj.translateX
            * (this.canvas.width / stage.canvas.width)
            * stage.childs[0].scaleX
          let translateY = translateObj.translateY
            * (this.canvas.height / stage.canvas.height)
            * stage.childs[0].scaleY

          let stageBoundary = stage.getBound()

          let w = stage.canvas.width
            / stage.childs[0].scaleX
            / stageBoundary.width

          let h = stage.canvas.height
            / stage.childs[0].scaleY
            / stageBoundary.height

          w > 1 && (w = 1)
          h > 1 && (h = 1)

          translateX *= w
          translateY *= h

          stageBoundary.left < 0
          && (
            translateX -= Math.abs(stageBoundary.left)
              * (this.width / stageBoundary.width)
          )

          stageBoundary.top < 0
          && (
            translateY -= Math.abs(stageBoundary.top)
              * (this.height / stageBoundary.height)
          )

          ctx.save()
          ctx.fillStyle = "rgba(168, 168, 168, 0.3)"
          ctx.fillRect(
            -translateX + 9,
            -translateY + 5,
            this.canvas.width - 18,
            this.canvas.height - 10
          )
          ctx.restore()

          // 上面绘制小地图红色边框
          let imgData = null

          try {
            imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
          } catch (err) {

          }

          return imgData
        }

        return null
      },
      paint() {
        if (this.eagleImageDatas) {
          const ctx = stage.graphics
          const w = 4

          ctx.save()
          ctx.lineWidth = 1
          ctx.strokeStyle = "rgba(43, 43, 43, 0.8)"

          ctx.strokeRect(
            stage.canvas.width - this.canvas.width - w,
            stage.canvas.height - this.canvas.height - w,
            this.canvas.width + w - 1,
            this.canvas.height + w
          )

          ctx.putImageData(
            this.eagleImageDatas,
            stage.canvas.width - this.canvas.width - w,
            stage.canvas.height - this.canvas.height - 1
          )

          ctx.restore()

        } else {
          this.eagleImageDatas = this.getData(stage)
        }
      },
      eventHandler(eName, eObj, stage) {
        let eX = eObj.x
        let eY = eObj.y

        // 如果触发事件时鼠标的位置在鹰眼区域内
        if (
          eX > stage.canvas.width - this.canvas.width
          && eY > stage.canvas.height - this.canvas.height
        ) {
          eX = eObj.x - this.canvas.width
          eY = eObj.y - this.canvas.height

          if ("mousedown" === eName) {
            this.lastTranslateX = stage.childs[0].translateX
            this.lastTranslateY = stage.childs[0].translateY
          }

          if (
            "mousedrag" === eName
            && stage.childs.length > 0
          ) {
            const dx = eObj.dx
            const dy = eObj.dy
            const stageBoundary = stage.getBound()
            const x = this.canvas.width / stage.childs[0].scaleX / stageBoundary.width
            const y = this.canvas.height / stage.childs[0].scaleY / stageBoundary.height

            stage.childs[0].translateX = this.lastTranslateX - dx / x
            stage.childs[0].translateY = this.lastTranslateY - dy / y
          }
        }
      },
    }
  }

  JTopo.Stage = function (canvas) {
    const self = this
    let isShowContextmenu = true
    let timer = null

    JTopo.stage = self

    self.initialize = function (canvas) {
      eventInit(canvas)
      self.canvas = canvas
      self.graphics = canvas.getContext("2d")
      self.childs = []
      self.frames = 24
      self.messageBus = new JTopo.util.MessageBus
      self.eagleEye = eagleEye(self)
      self.wheelZoom = null
      self.mouseDownX = 0
      self.mouseDownY = 0
      self.mouseDown = !1
      self.mouseOver = !1
      self.needRepaint = !0
      self.serializedProperties = ["frames", "wheelZoom"]
      self.mode = ''
    }
    canvas && self.initialize(canvas)

    function eventInit(canvas) {
      function getEventObj(e) {
        const eObj = JTopo.util.getEventPosition(e)
        const offsetPosObj = JTopo.util.getOffsetPosition(self.canvas)

        eObj.offsetLeft = eObj.pageX - offsetPosObj.left
        eObj.offsetTop = eObj.pageY - offsetPosObj.top
        eObj.x = eObj.offsetLeft
        eObj.y = eObj.offsetTop
        eObj.target = null

        return eObj
      }

      canvas.addEventListener("mouseout", function (e) {
        timer = setTimeout(function () {
          isShowContextmenu = true
        }, 500)

        document.onselectstart = function () {
          return true
        }

        const eObj = getEventObj(e)

        self.dispatchEventToScenes("mouseout", eObj)
        self.dispatchEvent("mouseout", eObj)
        self.needRepaint = 0 !== self.animate
      })
      canvas.addEventListener("mouseover", function (e) {
        document.onselectstart = function () {
          return false
        }

        this.mouseOver = true

        const eventObj = getEventObj(e)

        self.dispatchEventToScenes("mouseover", eventObj)
        self.dispatchEvent("mouseover", eventObj)
      })
      canvas.addEventListener("mousedown", function (e) {
        const eObj = getEventObj(e)

        self.mouseDown = true
        self.mouseDownX = eObj.x
        self.mouseDownY = eObj.y
        self.dispatchEventToScenes("mousedown", eObj)
        self.dispatchEvent("mousedown", eObj)
      })
      canvas.addEventListener("mouseup", function (e) {
        const eObj = getEventObj(e)

        self.dispatchEventToScenes("mouseup", eObj)
        self.dispatchEvent("mouseup", eObj)
        self.mouseDown = false
        self.needRepaint = 0 !== self.animate
      })
      canvas.addEventListener("mousemove", function (e) {
        if (timer) {
          window.clearTimeout(timer)
          timer = null
        }

        isShowContextmenu = false

        const eObj = getEventObj(e)

        if (self.mouseDown) {
          if (0 === e.button) {
            eObj.dx = eObj.x - self.mouseDownX
            eObj.dy = eObj.y - self.mouseDownY
            self.dispatchEventToScenes("mousedrag", eObj)
            self.dispatchEvent("mousedrag", eObj)

            self.eagleEye.visible && self.eagleEye.update()
          }
        }
        else {
          self.dispatchEventToScenes("mousemove", eObj)
          self.dispatchEvent("mousemove", eObj)
        }
      })
      canvas.addEventListener("click", function (e) {
        const eObj = getEventObj(e)

        self.dispatchEventToScenes("click", eObj)
        self.dispatchEvent("click", eObj)
      })
      canvas.addEventListener("dblclick", function (e) {
        const eObj = getEventObj(e)

        self.dispatchEventToScenes("dbclick", eObj)
        self.dispatchEvent("dbclick", eObj)
      })
      canvas.addEventListener("mousewheel", function (e) {
        const eObj = getEventObj(e)

        self.dispatchEventToScenes("mousewheel", eObj)
        self.dispatchEvent("mousewheel", eObj)

        if (self.wheelZoom) {
          if (e.preventDefault) {
            e.preventDefault()
          }
          else {
            e = e || window.event
            e.returnValue = !1
          }

          self.eagleEye.visible && self.eagleEye.update()
        }
      })

      window.addEventListener("keydown", function (e) {
        self.dispatchEventToScenes("keydown", JTopo.util.cloneEvent(e))

        const keyCode = e.keyCode

        if (
          37 === keyCode
          || 38 === keyCode
          || 39 === keyCode
          || 40 === keyCode
        ) {
          if (e.preventDefault) {
            e.preventDefault()
          }
          else {
            e = e || window.event
            e.returnValue = !1
          }
        }

      }, true)
      window.addEventListener("keyup", function (e) {
        self.dispatchEventToScenes("keyup", JTopo.util.cloneEvent(e))

        const keyCode = e.keyCode

        if (
          37 === keyCode
          || 38 === keyCode
          || 39 === keyCode
          || 40 === keyCode
        ) {
          if (e.preventDefault) {
            e.preventDefault()
          }
          else {
            e = e || window.event
            e.returnValue = !1
          }
        }
      }, true)
    }

    document.oncontextmenu = function () {
      return isShowContextmenu
    }

    self.dispatchEventToScenes = function (eName, eObj) {
      self.frames && (self.needRepaint = !0)

      if (
        self.eagleEye.visible
        && -1 !== eName.indexOf("mouse")
      ) {
        let eX = eObj.x
        let eY = eObj.y

        if (
          eX > self.width - self.eagleEye.width
          && eY > self.height - self.eagleEye.height
        ) {
          self.eagleEye.eventHandler(eName, eObj, self)

          return
        }
      }

      self.childs.forEach(function (scene) {
        if (scene.visible) {
          const eHandler = scene[eName + "Handler"]

          if (!eHandler) {
            throw new Error("Function not found:" + eName + "Handler")
          }

          eHandler.call(scene, eObj)
        }
      })
    }

    self.add = function (scene) {
      for (let i = 0; i < self.childs.length; i++) {
        if (self.childs[i] === scene) {
          return
        }
      }

      scene.addTo(self)
      self.childs.push(scene)
    }

    self.remove = function (scene) {
      if (!scene) {
        throw new Error("the argument of Stage.remove cannot be null!")
      }

      for (let i = 0; i < self.childs.length; i++) {
        if (self.childs[i] === scene) {
          scene.stage = null
          self.childs = self.childs.del(i)

          return self
        }
      }

      return self
    }

    self.clear = function () {
      self.childs = []
    }

    self.addEventListener = function (eName, cb) {
      const self = self
      const fn = function (eObj) {
        cb.call(self, eObj)
      }

      self.messageBus.subscribe(eName, fn)

      return self
    }

    self.removeEventListener = function (eName) {
      self.messageBus.unsubscribe(eName)
    }

    self.removeAllEventListener = function () {
      self.messageBus = new JTopo.util.MessageBus
    }

    self.dispatchEvent = function (eName, eObj) {
      self.messageBus.publish(eName, eObj)

      return self
    }

    const eNameArr = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(",")

    eNameArr.forEach(function (eName) {
      self[eName] = function (cb) {
        cb
          ? self.addEventListener(eName, cb)
          : self.dispatchEvent(eName)
      }
    })

    self.saveImageInfo = function (w, h) {
      const dataUrl = self.eagleEye.getImage(w, h)
      const newWindow = window.open("about:blank")

      newWindow.document.write("<img src='" + dataUrl + "' alt='from canvas'/>")

      return self
    }

    self.saveAsLocalImage = function (w, h) {
      const dataUrl = self.eagleEye.getImage(w, h)

      dataUrl.replace("image/png", "image/octet-stream")
      window.location.href = dataUrl

      return self
    }

    self.paint = function () {
      if (self.canvas) {
        self.graphics.save()
        self.graphics.clearRect(0, 0, self.width, self.height)
        self.childs.forEach(function (scene) {
          scene.visible && scene.repaint(self.graphics)
        })
        self.eagleEye.visible && self.eagleEye.paint(self)
        self.graphics.restore()
      }
    }

    self.repaint = function () {
      if (self.frames) {
        if (
          self.frames >= 0
          || self.needRepaint
        ) {
          self.paint()
          self.frames < 0 && (self.needRepaint = !1)
        }
      }
    }

    self.zoom = function (scale) {
      self.childs.forEach(function (scene) {
        scene.visible && scene.zoom(scale)
      })
    }

    self.zoomOut = function (scale) {
      self.childs.forEach(function (scene) {
        scene.visible && scene.zoomOut(scale)
      })
    }

    self.zoomIn = function (scale) {
      self.childs.forEach(function (scene) {
        scene.visible && scene.zoomIn(scale)
      })
    }

    self.zoomReset = function () {
      self.childs.forEach(function (scene) {
        scene.visible && scene.zoomReset()
      })
    }

    self.centerAndZoom = function () {
      self.childs.forEach(function (scene) {
        scene.visible && scene.centerAndZoom()
      })
    }

    self.setCenter = function (x, y) {
      self.childs.forEach(function (scene) {
        let translateX = x - self.canvas.width / 2
        let translateY = y - self.canvas.height / 2

        scene.translateX = -translateX
        scene.translateY = -translateY
      })
    }

    self.getBound = function () {
      const allSceneBoundary = {
        left: Number.MAX_VALUE,
        right: Number.MIN_VALUE,
        top: Number.MAX_VALUE,
        bottom: Number.MIN_VALUE,
      }

      self.childs.forEach(function (scene) {
        const allEleBoundary = scene.getElementsBound()

        if (allEleBoundary.left < allSceneBoundary.left) {
          allSceneBoundary.left = allEleBoundary.left
          allSceneBoundary.leftNode = allEleBoundary.leftNode
        }

        if (allEleBoundary.top < allSceneBoundary.top) {
          allSceneBoundary.top = allEleBoundary.top
          allSceneBoundary.topNode = allEleBoundary.topNode
        }

        if (allEleBoundary.right > allSceneBoundary.right) {
          allSceneBoundary.right = allEleBoundary.right
          allSceneBoundary.rightNode = allEleBoundary.rightNode
        }

        if (allEleBoundary.bottom > allSceneBoundary.bottom) {
          allSceneBoundary.bottom = allEleBoundary.bottom
          allSceneBoundary.bottomNode = allEleBoundary.bottomNode
        }
      })

      allSceneBoundary.width = allSceneBoundary.right - allSceneBoundary.left
      allSceneBoundary.height = allSceneBoundary.bottom - allSceneBoundary.top

      return allSceneBoundary
    }

    self.toJson = function () {
      let self = self
      let jsonStr = '{"version":"' + JTopo.version + '",'

      self.serializedProperties.forEach(function (prop) {
        let val = self[prop]

        "string" === typeof val && (val = '"' + val + '"')
        jsonStr += '"' + prop + '":' + val + ","
      })

      jsonStr += '"childs":['
      self.childs.forEach(function (a) {
        jsonStr += a.toJson()
      })
      jsonStr += "]"
      jsonStr += "}"

      return jsonStr
    }

    hahaha()

    function hahaha() {
      if (!self.frames) {
        setTimeout(hahaha, 100)
      }
      else {
        if (self.frames < 0) {
          self.repaint()
          setTimeout(hahaha, 1000 / -self.frames)
        } else {
          self.repaint()
          setTimeout(hahaha, 1000 / self.frames)
        }
      }
    }

    setTimeout(function () {
      self.mousewheel(function (a) {
        const b = !a.wheelDelta ? a.detail : a.wheelDelta

        self.wheelZoom && (
          b > 0
            ? self.zoomIn(self.wheelZoom)
            : self.zoomOut(self.wheelZoom)
        )
      })

      self.paint()
    }, 300)

    setTimeout(function () {
      self.paint()
    }, 1e3)

    setTimeout(function () {
      self.paint()
    }, 3e3)
  }
  JTopo.Stage.prototype = {
    get width() {
      return this.canvas.width
    },
    get height() {
      return this.canvas.height
    },
    set cursor(shape) {
      this.canvas.style.cursor = shape
    },
    get cursor() {
      return this.canvas.style.cursor
    },
    set mode(m) {
      this.childs.forEach(function (stage) {
        stage.mode = m
      })
    }
  }
}

initLayout(JTopo)

function initLayout(JTopo) {
  function h(a) {
    let b = 0
    let c = 0

    a.forEach(function (a) {
      b += a.width
      c += a.height
    })
    return {
      width: b / a.length,
      height: c / a.length
    }
  }

  function i(a, b, c, d) {
    b.x += c
    b.y += d

    const e = JTopo.Layout.getNodeChilds(a, b)

    for (let f = 0; f < e.length; f++) {
      i(a, e[f], c, d)
    }

  }

  function j(links, node) {
    function sugar(node, e) {
      const nodeChildsArr = JTopo.Layout.getNodeChilds(links, node)

      if (!d[e]) {
        d[e] = {}
        d[e].nodes = []
        d[e].childs = []
      }

      d[e].nodes.push(node)
      d[e].childs.push(nodeChildsArr)

      for (let i = 0; i < nodeChildsArr.length; i++) {
        sugar(nodeChildsArr[i], e + 1)
        nodeChildsArr[i].parent = node
      }

    }

    let d = []

    sugar(node, 0)

    return d
  }

  function m(x, y, rows, cols, horizontal, vertical) {
    let pointsArr = []

    for (let i = 0; rows > i; i++) {
      for (let j = 0; cols > j; j++) {
        pointsArr.push({
          x: x + j * horizontal,
          y: y + i * vertical
        })
      }
    }

    return pointsArr
  }

  function getRotatePoints(x, y, len, r, beginAngle, endAngle) {
    let beginA = beginAngle ? beginAngle : 0
    const endA = endAngle ? endAngle : 2 * Math.PI
    const angle = endA - beginA
    const j = angle / len
    const rotatePoints = []

    beginA += j / 2

    for (let i = beginA; endA >= i; i += j) {
      const x = x + Math.cos(i) * r
      const y = y + Math.sin(i) * r

      rotatePoints.push({
        x: x,
        y: y
      })
    }

    return rotatePoints
  }

  function o(x, y, len, w, h, direction) {
    const direction = direction || "bottom"
    const pointsArr = []

    if ("bottom" === direction) {
      let i = x - len / 2 * w + w / 2

      for (let j = 0; len >= j; j++) {
        pointsArr.push({
          x: i + j * w,
          y: y + h
        })
      }
    }
    else if ("top" === direction) {
      let i = x - len / 2 * w + w / 2

      for (let j = 0; len >= j; j++) {
        pointsArr.push({
          x: i + j * w,
          y: y - h
        })
      }
    }
    else if ("right" === direction) {
      let i = y - len / 2 * w + w / 2

      for (let j = 0; len >= j; j++) {
        pointsArr.push({
          x: x + h,
          y: i + j * w
        })
      }
    }
    else if ("left" === direction) {
      let i = y - len / 2 * w + w / 2

      for (let j = 0; len >= j; j++) {
        pointsArr.push({
          x: x - h,
          y: i + j * w
        })
      }
    }

    return pointsArr
  }

  JTopo.layout = JTopo.Layout = {
    layoutNode: function (a, node, c) {
      const nodeChildsArr = JTopo.Layout.getNodeChilds(a.childs, node)

      if (!nodeChildsArr.length) return null

      JTopo.Layout.adjustPosition(node, nodeChildsArr)

      if (1 === c) {
        for (let i = 0; i < nodeChildsArr.length; i++) {
          JTopo.Layout.layoutNode(a, nodeChildsArr[i], c)
        }
      }

      return null
    },
    getNodeChilds: function (links, node) {
      let nodeChildsArr = []

      for (let i = 0; i < links.length; i++) {
        links[i] instanceof JTopo.Link
        && links[i].nodeA === node
        && nodeChildsArr.push(links[i].nodeZ)
      }

      return nodeChildsArr
    },
    adjustPosition: function (node, nodeChildsArr) {
      if (node.layout) {
        const layout = node.layout
        const layoutType = layout.type
        let pointsArr = null

        if ("circle" === layoutType) {
          const layoutRadius = layout.radius || Math.max(node.width, node.height)

          pointsArr = getRotatePoints(node.cx, node.cy, nodeChildsArr.length, layoutRadius, node.layout.beginAngle, node.layout.endAngle)
        }
        else if ("tree" === layoutType) {
          const w = layout.width || 50
          const h = layout.height || 50
          const direction = layout.direction

          pointsArr = o(node.cx, node.cy, nodeChildsArr.length, w, h, direction)
        }
        else {
          if ("grid" !== layoutType) return

          pointsArr = m(node.x, node.y, layout.rows, layout.cols, layout.horizontal || 0, layout.vertical || 0)
        }

        for (let i = 0; i < nodeChildsArr.length; i++)
          nodeChildsArr[i].setCenterLocation(pointsArr[i].x, pointsArr[i].y)
      }
    },
    /** 获取树的深度 */
    getTreeDeep: function (links, node) {
      let deep = 0

      function c(links, node, e) {
        const nodeChildsArr = JTopo.Layout.getNodeChilds(links, node)

        e > deep && (deep = e)

        for (let i = 0; i < nodeChildsArr.length; i++)
          c(links, nodeChildsArr[i], e + 1)
      }

      c(links, node, 0)

      return deep
    },
    /** 获取所有根节点 */
    getRootNodes: function (nodes) {
      // 存储所有节点类型不为连线的节点
      const nonLinkNodes = []

      // 获取所有节点类型为连线的节点
      const linkNodes = nodes.filter(function (node) {
        if (node instanceof JTopo.Link) {
          return !0
        } else {
          nonLinkNodes.push(node)
          return !1
        }
      })

      // 所有非连线节点中不为 nodeZ 的节点
      let nonNodeZArrInNonLinkNodes = nonLinkNodes.filter(function (nonLinkNode) {
        for (let i = 0; i < linkNodes.length; i++) {
          if (linkNodes[i].nodeZ === nonLinkNode) return !1
        }

        return !0
      })

      // 所有非连线节点中为 nodeA 但不为 nodeZ 的节点
      return nonNodeZArrInNonLinkNodes.filter(function (node) {
        for (let i = 0; i < linkNodes.length; i++) {
          if (linkNodes[i].nodeA === node) return !0
        }

        return !1
      })
    },
    /** 获取一组节点在画布中排列的中心点坐标 */
    getNodesCenter: function (nodes) {
      let b = 0
      let c = 0

      nodes.forEach(function (node) {
        b += node.cx
        c += node.cy
      })

      return {
        x: b / nodes.length,
        y: c / nodes.length
      }
    },
    springLayout: function (ele, scene) {
      let f = .01
      let g = .95
      let h = -5
      let i = 0
      let j = 0
      let k = 0
      // get elementArr by ClassName in scene, every element is instance of the ClassName
      let eleArr = scene.getElementsByClass(JTopo.Node)

      function d(ele1, ele2) {
        const dx = ele1.x - ele2.x
        const dy = ele1.y - ele2.y

        i += dx * f
        j += dy * f
        i *= g
        j *= g
        j += h
        ele2.x += i
        ele2.y += j
      }

      function fn() {
        if (!(++k > 150)) {
          for (let i = 0; i < eleArr.length; i++) {
            eleArr[i] !== ele && d(ele, eleArr[i], eleArr)
          }

          setTimeout(fn, 1e3 / 24)
        }
      }

      fn()
    },
    GridLayout: function (a, b) {
      return function (c) {
        const d = c.childs

        if (!(d.length <= 0)) {
          const boundaryObj = c.getBound()
          const f = d[0]
          const g = (boundaryObj.width - f.width) / b
          const h = (boundaryObj.height - f.height) / a
          let i = 0

          for (let j = 0; a > j; j++) {
            for (let k = 0; b > k; k++) {
              const l = d[i++]
              const x = boundaryObj.left + g / 2 + k * g
              const y = boundaryObj.top + h / 2 + j * h

              l.setLocation(x, y)

              if (i >= d.length) return
            }
          }
        }
      }
    },
    FlowLayout: function (a, b) {
      !a && (a = 0)
      !b && (b = 0)

      return function (c) {
        const childsArr = c.childs

        if (!(childsArr.length <= 0)) {
          const boundaryObj = c.getBound()
          let bLeft = boundaryObj.left
          let bTop = boundaryObj.top

          for (let i = 0; i < childsArr.length; i++) {
            const child = childsArr[i]

            if (bLeft + child.width >= boundaryObj.right) {
              bLeft = boundaryObj.left
              bTop += b + child.height
            }

            child.setLocation(bLeft + a / 2, bTop + b / 2)
            bLeft += a + child.width
          }
        }
      }
    },
    AutoBoundLayout: function () {
      return function (a, b) {
        if (b.length) {
          let x = 1e7
          let d = -1e7
          let y = 1e7
          let f = -1e7
          let w = d - x
          let h = f - y

          for (let i = 0; i < b.length; i++) {
            const j = b[i]

            j.x <= x && (x = j.x)
            j.x >= d && (d = j.x)
            j.y <= y && (y = j.y)
            j.y >= f && (f = j.y)

            w = d - x + j.width
            h = f - y + j.height
          }

          a.x = x
          a.y = y
          a.width = w
          a.height = h
        }
      }
    },
    CircleLayout: function (b) {
      return function (ele) {
        function sugar(eleChilds, rootNode, e) {
          const nodeChildsArr = JTopo.Layout.getNodeChilds(eleChilds, rootNode)

          if (nodeChildsArr.length) {
            !e && (e = b)

            const g = 2 * Math.PI / nodeChildsArr.length

            nodeChildsArr.forEach(function (node, index) {
              const x = rootNode.x + e * Math.cos(g * index)
              const y = rootNode.y + e * Math.sin(g * index)

              node.setLocation(x, y)

              sugar(eleChilds, node, e / 2)
            })
          }
        }

        let rootNodes = JTopo.layout.getRootNodes(ele.childs)

        if (rootNodes.length > 0) {
          sugar(ele.childs, rootNodes[0])

          let eleBoundaryObj = JTopo.util.getElementsBound(ele.childs)

          // 元素的中心点坐标
          let centerLocOfEle = ele.getCenterLocation()
          let x = centerLocOfEle.x - (eleBoundaryObj.left + eleBoundaryObj.right) / 2
          let y = centerLocOfEle.y - (eleBoundaryObj.top + eleBoundaryObj.bottom) / 2

          ele.childs.forEach(function (node) {
            if (node instanceof JTopo.Node) {
              node.x += x
              node.y += y
            }
          })
        }
      }
    },
    TreeLayout: function (b, c, d) {
      return function (e) {
        function f(links, node) {
          let h = JTopo.layout.getTreeDeep(links, node)
          let k = j(links, node)
          let l = k["" + h].nodes

          for (let m = 0; m < l.length; m++) {
            const n = l[m]

            let o = (m + 1) * (c + 10)
            let p = h * d

            if ("down" !== b) {
              if ("up" === b) {
                p = -p
              }
              else {
                if ("left" === b) {
                  o = -h * d
                  p = (m + 1) * (c + 10)
                }
                else {
                  if ("right" === b) {
                    o = h * d
                    p = (m + 1) * (c + 10)
                  }
                }
              }
            }

            n.setLocation(o, p)
          }

          for (let q = h - 1; q >= 0; q--) {

            let r = k["" + q].nodes
            let s = k["" + q].childs

            for (let m = 0; m < r.length; m++) {
              const t = r[m]
              const u = s[m]

              "down" === b
                ? t.y = q * d
                : "up" == b ? t.y = -q * d : "left" == b ? t.x = -q * d : "right" == b && (t.x = q * d)

              if (u.length) {
                "down" === b || "up" === b
                  ? t.x = (u[0].x + u[u.length - 1].x) / 2
                  : ("left" === b || "right" === b) && (t.y = (u[0].y + u[u.length - 1].y) / 2)
              }
              else {
                if (m > 0) {
                  "down" === b || "up" === b
                    ? t.x = r[m - 1].x + r[m - 1].width + c
                    : ("left" === b || "right" === b) && (t.y = r[m - 1].y + r[m - 1].height + c)
                }
              }

              if (m > 0) {
                if ("down" === b || "up" === b) {
                  if (t.x < r[m - 1].x + r[m - 1].width) {
                    let v = r[m - 1].x + r[m - 1].width + c
                    let w = Math.abs(v - t.x)

                    for (let x = m; x < r.length; x++) {
                      i(e.childs, r[x], w, 0)
                    }
                  }
                }
                else if (
                  ("left" === b || "right" === b)
                  && t.y < r[m - 1].y + r[m - 1].height
                ) {
                  let y = r[m - 1].y + r[m - 1].height + c
                  let z = Math.abs(y - t.y)

                  for (let x = m; x < r.length; x++) {
                    i(e.childs, r[x], 0, z)
                  }
                }
              }
            }
          }
        }

        let g = null

        if (!c) {
          g = h(e.childs)
          c = g.width

          "left" === b
          || "right" === b
          && (c = g.width + 10)
        }

        if (!d) {
          !g && (g = h(e.childs))
          d = 2 * g.height
        }

        !b && (b = "down")

        let k = JTopo.layout.getRootNodes(e.childs)

        if (k.length > 0) {
          f(e.childs, k[0])

          let l = JTopo.util.getElementsBound(e.childs)
          let m = e.getCenterLocation()
          let n = m.x - (l.left + l.right) / 2
          let o = m.y - (l.top + l.bottom) / 2

          e.childs.forEach(function (b) {
            if (b instanceof JTopo.Node) {
              b.x += n
              b.y += o
            }
          })
        }
      }
    },
    circleLayoutNodes: function (c, d) {
      !d && (d = {})

      let cx = d.cx
      let cy = d.cy
      let minRadius = d.minRadius
      let nodeDiameter = d.nodeDiameter
      let hScale = d.hScale || 1
      let vScale = d.vScale || 1

      if (!cx || !cy) {
        const cPointOfNodes = JTopo.Layout.getNodesCenter(c)

        cx = cPointOfNodes.x
        cy = cPointOfNodes.y
      }

      let l = 0
      const m = []
      const n = []

      c.forEach(function (a) {
        if (!d.nodeDiameter) {
          a.diameter && (nodeDiameter = a.diameter)

          nodeDiameter = a.radius
            ? 2 * a.radius
            : Math.sqrt(2 * a.width * a.height)

          n.push(nodeDiameter)
        } else {

          n.push(nodeDiameter)
          l += nodeDiameter
        }
      })

      c.forEach(function (a, b) {
        const c = n[b] / l
        m.push(Math.PI * c)
      })

      const o = m[0] + m[1]
      const p = n[0] / 2 + n[1] / 2

      let q = p / 2 / Math.sin(o / 2)

      minRadius && minRadius > q && (q = minRadius)

      const r = q * hScale
      const s = q * vScale
      const t = d.animate

      if (t) {
        let u = t.time || 1e3
        let v = 0

        c.forEach(function (b, c) {
          v += 0 === c ? m[c] : m[c - 1] + m[c]

          const d = cx + Math.cos(v) * r
          const g = cy + Math.sin(v) * s

          JTopo.Animate
            .stepByStep(b, {
              x: d - b.width / 2,
              y: g - b.height / 2
            }, u)
            .start()
        })
      }
      else {
        let v = 0

        c.forEach(function (a, i) {
          v += 0 === i ? m[i] : m[i - 1] + m[i]

          const c = cx + Math.cos(v) * r
          const d = cy + Math.sin(v) * s

          a.cx = c
          a.cy = d
        })
      }

      return {
        cx: cx,
        cy: cy,
        radius: r,
        radiusA: r,
        radiusB: s
      }
    }
  }
}

initAnimateAndEffect(JTopo)

function initAnimateAndEffect(JTopo) {
  function b(fn, interval) {
    let timer
    let messageBus = null

    return {
      stop: function () {
        if (timer) {
          window.clearInterval(timer)
          messageBus && messageBus.publish("stop")
        }

        return this
      },
      start: function () {
        const self = this

        timer = setInterval(function () {
          fn.call(self)
        }, interval)

        return this
      },
      onStop: function (fn) {
        !messageBus && (messageBus = new JTopo.util.MessageBus)
        messageBus.subscribe("stop", fn)

        return this
      }
    }
  }

  // 动画
  JTopo.Animate = {}
  // 特效
  JTopo.Effect = {}

  let isStopAll = false

  // 特效：喷泉效果
  JTopo.Effect.spring = function (obj) {
    null == obj && (obj = {})

    const spring = obj.spring || .1
    const friction = obj.friction || .8
    const grivity = obj.grivity || 0
    const wind = obj.wind || 0

    return {
      items: [],
      timer: null,
      isPause: false,
      addNode: function (a, b) {
        const item = {
          node: a,
          target: b,
          vx: 0,
          vy: 0
        }

        this.items.push(item)

        return this
      },
      play: function (time) {
        this.stop()

        time = time ? 1e3 / 24 : time

        const self = this

        this.timer = setInterval(function () {
          self.nextFrame()
        }, time)
      },
      stop: function () {
        this.timer && window.clearInterval(this.timer)
      },
      nextFrame: function () {
        for (let i = 0; i < this.items.length; i++) {
          const item = this.items[i]
          const node = item.node
          const target = item.target
          let vx = item.vx
          let vy = item.vy
          const x = target.x - node.x
          const y = target.y - node.y
          const m = Math.atan2(y, x)

          if (0 != wind) {
            const n = target.x - Math.cos(m) * wind
            const o = target.y - Math.sin(m) * wind

            vx += (n - node.x) * spring
            vy += (o - node.y) * spring
          } else {
            vx += x * spring
          }

          vy += y * spring
          vx *= friction
          vy *= friction
          vy += grivity
          node.x += vx
          node.y += vy
          item.vx = vx
          item.vy = vy
        }
      }
    }
  }
  // 特效：重力效果
  JTopo.Effect.gravity = function (a, c) {
    c = c || {}

    const d = c.gravity || .1
    const e = c.dx || 0
    let f = c.dy || 5
    const g = c.stop
    const interval = c.interval || 30

    return new b(function () {
      if (g && g()) {
        f = .5
        this.stop()
      } else {
        f += d
        a.setLocation(a.x + e, a.y + f)
      }
    }, interval)
  }
  // 动画：逐步
  JTopo.Animate.stepByStep = function (node, attrs, time, isNeedCycle, isNeedReverseCycle) {
    //节点、属性、时间、true(是否循环)、是否逆循环
    const interval = 1e3 / 24
    const h = {}

    for (let attr in attrs) {
      const j = attrs[attr]
      const k = j - node[attr]

      h[attr] = {
        oldValue: node[attr],
        targetValue: j,
        step: k / time * interval,
        isDone: function (b) {
          return this.step > 0
            && node[b] >= this.targetValue
            || this.step < 0
            && node[b] <= this.targetValue
        }
      }
    }

    return new b(function () {
      let b = true

      for (let attr in attrs) {
        if (!h[attr].isDone(attr)) {
          node[attr] += h[attr].step
          b = false
        }
      }

      if (b) {
        if (!isNeedCycle) {
          return this.stop()
        }

        for (let attr in attrs) {
          if (isNeedReverseCycle) {
            const g = h[attr].targetValue

            h[attr].targetValue = h[attr].oldValue
            h[attr].oldValue = g
            h[attr].step = -h[attr].step

          } else {
            node[attr] = h[attr].oldValue
          }
        }
      }

      return this
    }, interval)
  }
  // 动画：旋转效果
  JTopo.Animate.rotate = function (a, b) {
    let timer = null
    const obj = {}
    let v = b.v

    obj.run = function () {
      timer = setInterval(function () {
        if (isStopAll) {
          f.stop()
        } else {
          a.rotate += v || .2

          a.rotate > 2 * Math.PI
          && (a.rotate = 0)
        }

      }, 100)

      return f
    }
    obj.stop = function () {
      window.clearInterval(timer)
      f.onStop && f.onStop(a)

      return f
    }
    obj.onStop = function (cb) {
      obj.onStop = cb

      return obj
    }

    return obj
  }
  // 动画：缩放效果
  JTopo.Animate.scale = function (a, b) {
    let scale = b.scale || 1
      , f = .06
      , scaleX = a.scaleX
      , scaleY = a.scaleY
      , obj = {}
      , timer = null

    obj.onStop = function (cb) {
      obj.onStop = cb
      return obj
    }
    obj.run = function () {
      timer = setInterval(function () {
        a.scaleX += f
        a.scaleY += f
        a.scaleX >= scale && obj.stop()
      }, 100)
      return obj
    }
    obj.stop = function () {
      obj.onStop && obj.onStop(a)
      a.scaleX = scaleX
      a.scaleY = scaleY
      window.clearInterval(timer)
    }

    return obj
  }
  // 动画：移动效果
  JTopo.Animate.move = function (a, b) {
    let position = b.position
      , easing = b.easing || .2
      , obj = {}
      , timer = null

    obj.onStop = function (cb) {
      obj.onStop = cb
      return obj
    }
    obj.run = function () {
      timer = setInterval(function () {
        if (isStopAll) {
          return void obj.stop()
        }

        let b = position.x - a.x
          , c = position.y - a.y
          , h = b * easing
          , i = c * easing

        a.x += h
        a.y += i
        .01 > h && .1 > i && obj.stop()
      }, 100)

      return obj
    }
    obj.stop = function () {
      window.clearInterval(timer)
    }

    return obj
  }
  // 动画：循环效果
  JTopo.Animate.cycle = function (b, c) {
    let p1 = c.p1
      , p2 = c.p2
      , h = p1.x + (p2.x - p1.x) / 2
      , i = p1.y + (p2.y - p1.y) / 2
      , j = JTopo.util.getDistance(p1, p2) / 2
      , k = Math.atan2(i, h)
      , speed = c.speed || .2
      , obj = {}
      , timer = null

    obj.run = function () {
      timer = setInterval(function () {
        if (isStopAll) {
          obj.stop()

          return
        }

        const a = p1.y + h + Math.sin(k) * j

        b.setLocation(b.x, a)

        k += speed
      }, 100)

      return obj
    }
    obj.stop = function () {
      window.clearInterval(timer)
    }

    return obj
  }
  // 动画：repeatThrow
  JTopo.Animate.repeatThrow = function (a, b) {
    let f = .8,
      context = b.context,
      timer = null,
      obj = {}

    function c(a) {
      a.visible = !0
      a.rotate = Math.random()

      const b = context.stage.canvas.width / 2

      a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100)
      a.y = context.stage.canvas.height
      a.vx = 5 * Math.random() - 5 * Math.random()
      a.vy = -25
    }

    obj.onStop = function (cb) {
      obj.onStop = cb
      return obj
    }
    obj.run = function d() {
      c(a)
      timer = setInterval(function () {
        if (isStopAll) {
          obj.stop()
        } else {
          a.vy += f
          a.x += a.vx
          a.y += a.vy

          if (
            a.x < 0
            || a.x > context.stage.canvas.width
            || a.y > context.stage.canvas.height
          ) {
            if (obj.onStop) {
              obj.onStop(a)
              c(a)
            }
          }
        }
      }, 50)
      return obj
    }
    obj.stop = function e() {
      window.clearInterval(timer)
    }

    return obj
  }
  // 动画：dividedTwoPiece
  JTopo.Animate.dividedTwoPiece = function (b, c) {
    let context = c.context
      , obj = {}

    function d(x, y, radius, startAngle, endAngle) {
      const node = new JTopo.Node

      node.setImage(b.image)
      node.setSize(b.width, b.height)
      node.setLocation(x, y)
      node.showSelected = !1
      node.dragable = !1
      node.paint = function (ctx) {
        ctx.save()
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.clip()
        ctx.beginPath()

        if (null != this.image) {
          ctx.drawImage(this.image, -this.width / 2, -this.height / 2)
        } else {
          ctx.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")"
          ctx.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2)
          ctx.fill()
        }

        ctx.closePath()
        ctx.restore()
      }

      return node
    }

    function e(angle, context) {
      let startAngle = angle
        , endAngle = angle + Math.PI
        , h = d(b.x, b.y, b.width, startAngle, endAngle)
        , j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, startAngle + Math.PI, startAngle)

      b.visible = !1

      context.add(h)
      context.add(j)

      JTopo.Animate
        .gravity(h, {
          context: context,
          dx: .3
        })
        .run()
        .onStop(function () {
          context.remove(h)
          context.remove(j)
          obj.stop()
        })

      JTopo.Animate
        .gravity(j, {
          context: context,
          dx: -.2
        })
        .run()
    }

    obj.onStop = function (cb) {
      obj.onStop = cb

      return obj
    }
    obj.run = function () {
      e(c.angle, context)

      return obj
    }
    obj.stop = function () {
      obj.onStop && obj.onStop(b)

      return obj
    }

    return obj
  }
  // 动画：重力效果
  JTopo.Animate.gravity = function (a, b) {
    let context = b.context
      , gravity = b.gravity || .1
      , timer = null
      , obj = {}

    function stop() {
      window.clearInterval(timer)
      obj.onStop && obj.onStop(a)

      return obj
    }

    function run() {
      const dx = b.dx || 0
      let dy = b.dy || 2

      timer = setInterval(function () {
        if (isStopAll) {
          obj.stop()
        } else {
          dy += gravity

          if (a.y + a.height < context.stage.canvas.height) {
            a.setLocation(a.x + dx, a.y + dy)
          } else {
            dy = 0
            stop()
          }
        }
      }, 20)

      return obj
    }

    obj.run = run
    obj.stop = stop
    obj.onStop = function (a) {
      obj.onStop = a

      return obj
    }

    return obj
  }
  // 动画：开始所有
  JTopo.Animate.startAll = function () {
    isStopAll = false
  }
  // 动画：停止所有
  JTopo.Animate.stopAll = function () {
    isStopAll = true
  }
}

initFind(JTopo)

function initFind(JTopo) {
  let e = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",")

  function b(a, b) {
    let c = []

    if (0 == a.length) {
      return c
    }

    let d = b.match(/^\s*(\w+)\s*$/)

    if (d) {
      let e = a.filter(function (a) {
        return a.elementType == d[1]
      })

      null != e && e.length > 0 && (c = c.concat(e))
    } else {
      let f = !1

      d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*]\s*/)

      if (
        !d
        || d.length < 5
      ) {
        d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*]\s*/)
        f = !0
      }

      if (d && d.length >= 5) {
        const g = d[1]
        const h = d[2]
        const i = d[3]
        const j = d[4]

        e = a.filter(function (a) {
          if (a.elementType !== g) return !1

          let b = a[h]

          1 === f && (b = parseInt(b))

          switch (i) {
            case '=':
              return b === j
            case '>':
              return b > j
            case '<':
              return j > b
            case '<=':
              return j >= b
            case '>=':
              return b >= j
            case '!=':
              return b != j
            default:
              return !1
          }
        })

        e
        && e.length > 0
        && (c = c.concat(e))
      }
    }

    return c
  }

  function c(a) {
    a.find = function (a) {
      return d.call(this, a)
    }

    e.forEach(function (b) {
      a[b] = function (a) {

        for (let c = 0; c < this.length; c++) {
          this[c][b](a)
        }

        return this
      }
    })

    if (a.length) {
      let b = a[0]

      for (let c in b) {
        let f = b[c]

        "function" === typeof f
        && !function (b) {
          a[c] = function () {
            let c = []

            for (let d = 0; d < a.length; d++) {
              c.push(b.apply(a[d], arguments))
            }

            return c
          }
        }(f)
      }
    }

    a.attr = function (a, b) {
      if (a && b) {
        for (let c = 0; c < this.length; c++) {
          this[c][a] = b
        }
      }
      else {
        if (a && "string" === typeof a) {
          let d = []

          for (let c = 0; c < this.length; c++) {
            d.push(this[c][a])
          }

          return d
        }
        if (a) {
          for (let c = 0; c < this.length; c++) {
            for (let e in a) {
              this[c][e] = a[e]
            }
          }
        }
      }

      return this
    }

    return a
  }

  function d(d) {
    let e = []
    let f = []

    if (this instanceof JTopo.Stage) {
      e = this.childs
      f = f.concat(e)
    } else {
      this instanceof JTopo.Scene
        ? e = [this]
        : f = this

      e.forEach(function (a) {
        f = f.concat(a.childs)
      })
    }

    let g = "function" === typeof d ? f.filter(d) : b(f, d)

    return c(g)
  }


  JTopo.Stage.prototype.find = d
  JTopo.Scene.prototype.find = d
}

initExtends(window)

function initExtends(window) {
  function Point(x, y) {
    this.x = x
    this.y = y
  }

  function Tortoise(paint) {
    this.p = new Point(0, 0)
    this.w = new Point(1, 0)
    this.paint = paint
  }

  Tortoise.prototype.forward = function (a) {
    const p = this.p
    const w = this.w

    p.x = p.x + a * w.x
    p.y = p.y + a * w.y
    this.paint && this.paint(p.x, p.y)

    return this
  }
  Tortoise.prototype.move = function (a) {
    const p = this.p
    const w = this.w

    p.x = p.x + a * w.x
    p.y = p.y + a * w.y

    return this
  }
  Tortoise.prototype.moveTo = function (x, y) {
    this.p.x = x
    this.p.y = y

    return this
  }
  Tortoise.prototype.turn = function (a) {
    const w = this.w

    const x = Math.cos(a) * w.x - Math.sin(a) * w.y
    const y = Math.sin(a) * w.x + Math.cos(a) * w.y

    w.x = x
    w.y = y

    return this
  }
  Tortoise.prototype.resize = function (a) {
    const w = this.w

    w.x = w.x * a
    w.y = w.y * a

    return this
  }
  Tortoise.prototype.save = function () {
    null == this._stack && (this._stack = [])
    this._stack.push([this.p, this.w])

    return this
  }
  Tortoise.prototype.restore = function () {
    if (
      null != this._stack
      && this._stack.length > 0
    ) {
      const a = this._stack.pop()

      this.p = a[0]
      this.w = a[1]
    }

    return this
  }

  const Logo = {}
  Logo.Tortoise = Tortoise
  Logo.shift = function (a, b, c) {
    return function (tortoise) {
      for (let i = 0; i < b; i++) {
        a()
      }

      if (c) {
        tortoise.turn(c)
        tortoise.move(3)
      }
    }
  }
  Logo.spin = function (a, b) {
    const c = 2 * Math.PI

    return function (d) {
      for (let i = 0; b > i; i++) {
        a()
      }

      d.turn(c / b)
    }
  }
  Logo.polygon = function (sides) {
    const rad = 2 * Math.PI

    return function (tortoise) {
      for (let i = 0; i < sides; i++) {
        tortoise.forward(1)
      }

      tortoise.turn(rad / sides)
    }
  }
  Logo.spiral = function (a, b, c, d) {
    return function (tortoise) {
      for (let i = 0; i < b; i++) {
        a()
      }

      tortoise.forward(1)
      tortoise.turn(c)
      tortoise.resize(d)
    }
  }
  Logo.star = function (a) {
    const rad = 4 * Math.PI

    return function (tortoise) {
      for (let i = 0; i < a; i++) {
        tortoise.forward(1)
      }

      tortoise.turn(rad / a)
    }
  }
  Logo.scale = function (a, b, c) {
    return function (d) {
      for (let i = 0; b > i; i++) {
        a()
      }

      d.resize(c)
    }
  }
  window.Logo = Logo
}

export default JTopo