let text = 'PORTFOLIO'
let font = 'Six Caps, Proxima Nova, sans-serif'
let wobbleLength = 0.593
let cutStart = 0.425
let wobbleWidth = 6
let useHDPI = true
let dpr = 1
let cutHeight = 0.01
let cutSpacing = 0.01

let backgroundColor = '#141414'
let textColor = '#262629'



const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const textCanvas = document.createElement('canvas')
const textContext = textCanvas.getContext('2d')

function drawText() {
  const { width, height } = canvas
  textContext.clearRect(0, 0, width, height)
  textContext.fillStyle = textColor
  textContext.textBaseline = 'middle'
  textContext.textAlign = 'center'
  textContext.font = `${'normal'} ${428 * dpr}px ${font}`
  textContext.fillText(text, width / 2 + 5 / 2, height / 2, width - 20 * dpr)
}

function resize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window
  if (useHDPI) {
    dpr = devicePixelRatio
  }

  canvas.width = textCanvas.width = innerWidth * dpr
  canvas.height = textCanvas.height = innerHeight * dpr
  canvas.style.width = `${innerWidth}px`
  canvas.style.height = `${innerHeight}px`

  drawText()
}

resize()

document.body.appendChild(canvas)

const textinput = document.getElementById('text')
textinput.value = text
textinput.addEventListener('input', e => {
  text = e.target.value
  drawText()
})

const fontInput = document.getElementById('font')
fontInput.value = font
fontInput.addEventListener('input', e => {
  font = e.target.value
})

const wobbleLengthRange = document.getElementById('wobble-length')
wobbleLengthRange.value = wobbleLength
wobbleLengthRange.addEventListener('input', e => {
  wobbleLength = parseFloat(e.target.value, 10)
})

const wobbleWidthRange = document.getElementById('wobble-width')
wobbleWidthRange.type = 'range'
wobbleWidthRange.min = 0
wobbleWidthRange.max = 100
wobbleWidthRange.value = wobbleWidth
wobbleWidthRange.addEventListener('input', e => {
  wobbleWidth = parseInt(e.target.value, 10)
})

const cutStartRange = document.getElementById('cut-start')
cutStartRange.value = cutStart
cutStartRange.addEventListener('input', e => {
  cutStart = parseFloat(e.target.value, 10)
})

const cutHeightRange = document.getElementById('cut-height')
cutHeightRange.value = cutHeight
cutHeightRange.addEventListener('input', e => {
  cutHeight = parseFloat(e.target.value, 10)
})

const backgroundColorInput = document.getElementById('background-color')
backgroundColorInput.value = backgroundColor
backgroundColorInput.addEventListener('input', e => {
  backgroundColor = e.target.value
})

const textColorInput = document.getElementById('foreground-color')
textColorInput.value = textColor
textColorInput.addEventListener('input', e => {
  textColor = e.target.value
  drawText()
})

const hdpiCheckbox = document.getElementById('use-hdpi')
hdpiCheckbox.type = 'checkbox'
hdpiCheckbox.checked = false
hdpiCheckbox.addEventListener('input', e => {
  if (e.target.checked) {
    dpr = window.devicePixelRatio
  } else {
    dpr = 1
  }

  resize()
})

window.removeEventListener('resize', resize)
window.addEventListener('resize', resize)

let raf
cancelAnimationFrame(raf)

function loop(delta) {
  raf = requestAnimationFrame(loop)
  const { width, height } = canvas

  context.fillStyle = backgroundColor

  context.fillRect(0, 0, width, height)

  const nCutStart = cutStart * height

  context.drawImage(textCanvas, 0, 0, width, nCutStart, 0, 0, width, nCutStart)

  const nWobbleLength = wobbleLength * 800 * dpr

  const sliceHeight = cutHeight * 100 * dpr

  for (let i = 0; i < nWobbleLength; ++i) {
    const mapped2 = Math.sin((i / (nWobbleLength * 2)) * (Math.PI * 2))
    const x =
      mapped2 *
      Math.sin(delta * 0.007 + (i / dpr / 10 + 1) * Math.cos(delta / 2400)) *
      wobbleWidth *
      dpr

    context.drawImage(
      textCanvas,
      x,
      nCutStart,
      width,
      sliceHeight,

      0,
      nCutStart + i,
      width,
      sliceHeight
    )
  }

  context.drawImage(
    textCanvas,
    0,
    nCutStart + sliceHeight - 1,
    width,
    height - nCutStart,

    0,
    nCutStart + nWobbleLength + sliceHeight - 1,
    width,
    height - nCutStart
  )
}

async function start() {
  await document.fonts.load('10pt "Six Caps"')
  resize()
  requestAnimationFrame(loop)
}

start()