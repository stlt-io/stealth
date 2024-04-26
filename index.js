// import axios from 'axios'
import jsSHA from 'jssha'

import canvas from './src/canvas.js'
import device from './src/device.js'
import permissions from './src/permissions.js'
import screenDetails from './src/screen.js'
import browser from './src/browser.js'
import locales from './src/locales.js'
import audio from './src/audio.js'
import webgl from './src/webgl.js'
import mathDetails from './src/math.js'
import fonts from './src/fonts.js'

export default async function stealth() {
  return await Promise.all([
    { canvas: await canvas() },
    { device: device() },
    {
      permissions: await permissions()
    },
    {
      screen: await screenDetails()
    },
    {
      browser: await browser()
    },
    {
      locales: await locales()
    },
    {
      audio: await audio()
    },
    {
      webgl: await webgl()
    },
    {
      math: await mathDetails()
    },
    {
      fonts: await fonts()
    }
  ]).then((data) => {
    const local = data.reduce((acc, cur) => {
      Object.keys(cur).forEach((key) => {
        acc[key] = cur[key]
      })
      return acc
    }, {})

    return {
      id: new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
        .update(JSON.stringify(local))
        .getHash('HEX'),
      local,
      remote: {}
    }
  })
}