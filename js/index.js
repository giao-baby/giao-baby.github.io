musicBg()
countDown()

function musicBg () {
  let music = document.querySelector('#music')
  let musicAudio = music.querySelector('audio')
  let fireSoundAudios = document.querySelectorAll('#fireSound audio')
  // 控制音频音量
  musicAudio.volume = 0.2
  music.addEventListener('click', function () {
    // 是否暂停
    if (musicAudio.paused) {
      this.className = 'run'
      musicAudio.play()
      for (let i = 0; i < fireSoundAudios.length; i++) {
        fireSoundAudios[i].play()
        fireSoundAudios[i].muted = true
        // 音频开始时间不同，产生错落感
        fireSoundAudios[i].currentTime = i;
      }
    } else {
      this.className = ''
      musicAudio.pause()
      for (let i = 0; i < fireSoundAudios.length; i++) {
        fireSoundAudios.pause()
      }
    }
  })
}
function countDown () {
  let countNumber = document.querySelector('.page1-frame span')
  let page1 = document.querySelector('#page1')
  let page2 = document.querySelector('#page2')
  let timer = setInterval(() => {
    if (countNumber.innerHTML == 9) {
      clearInterval(timer)
      page1.style.display = 'none'
      page2.style.display = 'block'
      initFires()
    } else {
      countNumber.innerHTML = ++countNumber.innerHTML
    }
  }, 1000)
}

function initFires () {
  let canvas = document.querySelector('#page2 canvas')
  let ctx = canvas.getContext('2d')
  let fireSoundAudio = document.querySelectorAll('#fireSound audio')
  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height
  resize(canvas)
  let balls = []
  let fires = []
  let timer = null
  let count = 0
  let ballsAll = 10
  timer = setInterval(() => {
    if (count === ballsAll) {
      clearInterval(timer)
      count = 0
      timer = null
    } else {
      count++
      balls.push(new Ball({
        r: 3,
        x: Math.random() * width / 3 + width / 3,
        y: height,
        vx: Math.random() * 2 - 1,
        vy: -Math.random() * 2 - 9,
        end() {
          if (this.vy > 1) {
            balls.splice(balls.indexOf(this), 1)
            let size = Math.random() * 10
            for (let i = 0; i < 60; i++) {
              // 粒度
              let power = Math.random() * size
              let vx = Math.cos(i * 6 * Math.PI / 180) * power
              let vy = Math.sin(i * 6 * Math.PI / 180) * power
              fires.push(new Fire({
                r: 3,
                x: this.x,
                y: this.y,
                vx: vx,
                vy: vy,
                g: 0.05,
                end() {
                  if (this.life < 10) {
                    fires.splice(fires.indexOf(this), 1)
                  }
                }
              }))
            }
          }
        }
      }))
    }
  }, 500)
  loop()
  function loop () {
    if (balls.length) {
      // 如果存在小球就开始播放音乐
      for (let i = 0; i < fireSoundAudio.length; i++) {
        fireSoundAudio[i].muted = false
      }
      ctx.fillStyle = 'rgba(184, 42, 30, .2)'
      ctx.fillRect(0, 0, width, height)
    } else {
      // 如果不存在小球就静音
      for (let i = 0; i < fireSoundAudio.length; i++) {
        fireSoundAudio[i].muted = true
      }
      ctx.fillStyle = 'rgb(184, 42, 30)'
      ctx.fillRect(0, 0, width, height)
    }
    for (let i = 0; i < balls.length; i++) {
      balls[i].update()
      balls[i].render()
    }
    for (let i = 0; i < fires.length; i++) {
      fires[i].update()
      fires[i].render()
    }
    // 递归loop
    requestAnimationFrame(loop)
  }
  class Ball {
    constructor (options) {
      this.settings = Object.assign({
        // 颜色
        color: 'yellow',
        // 半径
        r: 5,
        // 重力加速度
        g: 0.1,
        // 结束的回调
        end() {}
      }, options)
      // 加入循环的目的就是不需再 this.settings.color 这样取值,直接挂载在this下通过 this.color 取值
      for (let attr in this.settings) {
        this[attr] = this.settings[attr]
      }
    }
    update() {
      this.x += this.vx
      this.y += this.vy
      this.vy += this.g
    }
    render() {
      ctx.beginPath()
      ctx.fillStyle = this.color
      // 绘制圆
      // 角度和弧度的换算
      // 2π == 360
      ctx.arc(this.x, this.y, this.r, 0, 360 * Math.PI / 180)
      ctx.closePath()
      ctx.fill()
      this.end()
    }
  }
  class Fire {
    constructor (options) {
      this.settings = Object.assign({
        // 颜色
        color: 'yellow',
        // 半径
        r: 5,
        // 重力加速度
        g: 0.1,
        // 摩擦力
        fs: 0.95,
        // 生命值
        life: 100,
        // 结束的回调
        end() {}
      }, options)
      // 加入循环的目的就是不需再 this.settings.color 这样取值,直接挂载在this下通过 this.color 取值
      for (let attr in this.settings) {
        this[attr] = this.settings[attr]
      }
    }
    update() {
      this.x += this.vx
      this.y += this.vy
      this.vy += this.g
      this.vx *= this.fs
      this.vy *= this.fs
      if (this.life > 0 && this.life < 300) {
        this.life--
      }
    }
    render() {
      ctx.beginPath()
      ctx.fillStyle = this.color
      // 绘制圆
      // 角度和弧度的换算
      // 2π == 360
      ctx.arc(this.x, this.y, this.r * Math.min(this.life, 100) / 100, 0, 360 * Math.PI / 180)
      ctx.closePath()
      ctx.fill()
      this.end()
    }
  }
}

function resize (canvas) {
  window.addEventListener('resize', function () {
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height
  })
}

function loadStatic () {
  
}
