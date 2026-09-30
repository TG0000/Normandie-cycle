'use client'

import { useEffect, useRef, useState } from 'react'
import { FRAG, VERT } from './shader'
import { HOTSPOTS, sampleViews } from './views'
import { COLORWAYS, setXp, xp } from '@/lib/experience'

const IMG = { w: 1999, h: 1125 }
// Ellipses des roues (voir scripts/build-masks.py)
const W0 = [523.7, 718.7, 315.6, 310.1] as const
const W1 = [1477.8, 719.9, 314.1, 309.7] as const
const GROUND = 1043
const SRC = '/img/sl9.webp'
const MASK = '/img/sl9-mask.png'

const damp = (a: number, b: number, l: number, dt: number) => a + (b - a) * (1 - Math.exp(-l * dt))

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })
}

function compile(gl: WebGL2RenderingContext) {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
    return s
  }
  const p = gl.createProgram()!
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link')
  return p
}

function texture(gl: WebGL2RenderingContext, img: HTMLImageElement, unit: number, premult: boolean) {
  const t = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premult)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const ext = gl.getExtension('EXT_texture_filter_anisotropic')
  if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8)
  return t
}

export default function SL9Stage({ active }: { active: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const [fallback, setFallback] = useState(false)
  activeRef.current = active

  useEffect(() => {
    const c = canvas.current!
    const gl = c.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' })
    if (!gl) {
      setFallback(true)
      setXp({ ready: true })
      return
    }
    let prog: WebGLProgram
    try {
      prog = compile(gl)
    } catch (e) {
      console.error(e)
      setFallback(true)
      setXp({ ready: true })
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(prog, n)
    const u = {
      tex: U('uTex'), mask: U('uMask'), res: U('uRes'), img: U('uImg'), center: U('uCenter'), offset: U('uOffset'),
      scale: U('uScale'), w0: U('uW0'), w1: U('uW1'), ang: U('uAng'), spread: U('uSpread'), taps: U('uTaps'),
      tries: U('uTries'), colA: U('uColA'), colB: U('uColB'), colMix: U('uColMix'), sheen: U('uSheen'),
      ground: U('uGround'), dpr: U('uDpr'),
    }
    gl.uniform2f(u.img, IMG.w, IMG.h)
    gl.uniform4f(u.w0, ...W0)
    gl.uniform4f(u.w1, ...W1)
    gl.uniform1f(u.ground, GROUND)
    gl.uniform1i(u.tex, 0)
    gl.uniform1i(u.mask, 1)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = {
      cx: 1000, cy: 600, zoom: 0.9, sx: 0.2, sy: 0.04,
      ang: 0, omega: 0, lastY: window.scrollY, vel: 0,
      col: [0, 1, 1] as number[], sheenBoost: 0, cw: xp.colorway,
      px: 0, py: 0, loaded: false, time: 0,
    }
    let raf = 0
    let last = performance.now()
    let alive = true
    const spots = () => Array.from(wrap.current?.closest('.xp-sticky')?.querySelectorAll<HTMLElement>('[data-hotspot]') ?? [])
    let spotEls: HTMLElement[] = []

    Promise.all([loadImage(SRC), loadImage(MASK)])
      .then(([img, mask]) => {
        if (!alive) return
        texture(gl, img, 0, true)
        texture(gl, mask, 1, false)
        s.loaded = true
        spotEls = spots()
      })
      .catch(() => {
        setFallback(true)
        setXp({ ready: true })
      })

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!s.loaded || !activeRef.current) return
      s.time += dt

      // taille
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.6 : 2)
      const cw = c.clientWidth
      const ch = c.clientHeight
      if (c.width !== Math.round(cw * dpr) || c.height !== Math.round(ch * dpr)) {
        c.width = Math.round(cw * dpr)
        c.height = Math.round(ch * dpr)
        gl.viewport(0, 0, c.width, c.height)
      }
      const mobile = cw < 820

      // caméra
      const { a, b, k } = sampleViews(xp.progress)
      const L = (x: number, y: number) => x + (y - x) * k
      const za = mobile ? a.zoomMobile ?? a.zoom : a.zoom
      const zb = mobile ? b.zoomMobile ?? b.zoom : b.zoom
      const sha = mobile ? a.shiftMobile : a.shift
      const shb = mobile ? b.shiftMobile : b.shift
      const lam = reduced ? 30 : 4
      s.cx = damp(s.cx, L(a.c[0], b.c[0]), lam, dt)
      s.cy = damp(s.cy, L(a.c[1], b.c[1]), lam, dt)
      s.zoom = damp(s.zoom, L(za, zb), lam, dt)
      s.sx = damp(s.sx, L(sha[0], shb[0]), lam, dt)
      s.sy = damp(s.sy, L(sha[1], shb[1]), lam, dt)
      s.px = damp(s.px, xp.pointer.x, 3, dt)
      s.py = damp(s.py, xp.pointer.y, 3, dt)
      const fit = mobile ? Math.min((cw * 0.98) / IMG.w, (ch * 0.5) / IMG.h) : Math.min((cw * 0.8) / IMG.w, (ch * 0.78) / IMG.h)
      const scale = fit * s.zoom
      const ox = s.sx * cw + s.px * 14
      const oy = s.sy * ch - s.py * 8

      // roues : roulent avec le scroll (sans glisser) + élan d'intro
      const y = window.scrollY
      const v = (y - s.lastY) / Math.max(dt, 1e-3)
      s.lastY = y
      s.vel = damp(s.vel, v, 10, dt)
      const spinT = L(a.spin, b.spin)
      const rollOmega = (s.vel * 0.55) / (312 * Math.max(scale, 0.2))
      const target = reduced ? 0 : spinT * 11 + clamp(rollOmega, -22, 22)
      s.omega = damp(s.omega, target, s.omega > target ? 1.1 : 3, dt)
      s.ang += s.omega * dt
      const spread = reduced ? 0 : Math.min(Math.abs(s.omega) * 0.028, 0.75)
      const taps = spread > 0.015 ? (mobile ? 6 : 10) : 1
      const tries = taps > 1 ? 5 : 9

      // finition : interpolation (la teinte traverse le spectre)
      if (s.cw !== xp.colorway) {
        s.cw = xp.colorway
        s.sheenBoost = 1
      }
      const tgt = COLORWAYS.find((cc) => cc.id === xp.colorway)!.k
      const f = 1 - Math.exp(-dt * 3.2)
      for (let i = 0; i < 3; i++) s.col[i] += (tgt[i] - s.col[i]) * f
      s.sheenBoost = damp(s.sheenBoost, 0, 1.5, dt)

      // reflet de lumière
      const period = 7
      const ph = (s.time % period) / period
      const sheenX = -500 + ph * 3200 + s.px * 260
      const sheenI = 0.2 + s.sheenBoost * 0.55

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.res, c.width, c.height)
      gl.uniform1f(u.dpr, dpr)
      gl.uniform2f(u.center, s.cx, s.cy)
      gl.uniform2f(u.offset, ox, oy)
      gl.uniform1f(u.scale, scale)
      gl.uniform1f(u.ang, s.ang)
      gl.uniform1f(u.spread, spread)
      gl.uniform1i(u.taps, taps)
      gl.uniform1i(u.tries, tries)
      gl.uniform3f(u.colA, s.col[0], s.col[1], s.col[2])
      gl.uniform3f(u.colB, s.col[0], s.col[1], s.col[2])
      gl.uniform1f(u.colMix, 0)
      gl.uniform3f(u.sheen, sheenX, 70 + s.sheenBoost * 140, sheenI)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // parallaxe (légère inclinaison 3D du plan photo)
      if (wrap.current) wrap.current.style.transform = `perspective(1800px) rotateY(${(s.px * 2.2).toFixed(3)}deg) rotateX(${(-s.py * 1.4).toFixed(3)}deg)`

      // étiquettes
      if (!spotEls.length) spotEls = spots()
      spotEls.forEach((el, i) => {
        const h = HOTSPOTS[i]
        if (!h) return
        const X = (h.p[0] - s.cx) * scale + cw / 2 + ox
        const Y = (h.p[1] - s.cy) * scale + ch / 2 + oy
        el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0)`
      })

      if (!xp.ready) {
        setXp({ ready: true })
        s.omega = reduced ? 0 : 16 // élan d'intro : les roues tournent puis ralentissent
      }
    }
    raf = requestAnimationFrame(frame)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrap} className="stage">
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={SRC} alt="S-Works Tarmac SL9 Red Tint, transmission SRAM RED AXS, roues Roval Rapide CLX III" className="stage-fallback" />
      ) : (
        <canvas ref={canvas} className="stage-canvas" role="img" aria-label="S-Works Tarmac SL9 Red Tint, transmission SRAM RED AXS, roues Roval Rapide CLX III — photo animée" />
      )}
    </div>
  )
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}
