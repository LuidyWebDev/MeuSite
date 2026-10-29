import React, { useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react"

const VERTEX_SHADER = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;

uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;

uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize, vec2 maxBoxSize) {
  vec2 box = vec2(0.);
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) {
    box.x = boxRatio * min(maxBoxSize[0] / boxRatio, maxBoxSize[1]);
  } else if (u_fit == 2.) {
    box.x = boxRatio * max(maxBoxSize[0] / boxRatio, maxBoxSize[1]);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  vec2 maxBoxSize = vec2(max(u_resolution.x, givenBoxSize.x), max(u_resolution.y, givenBoxSize.y));
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
    (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
    (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  vec2 objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize, maxBoxSize).xy;
  vec2 objectWorldScale = u_resolution.xy / objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;
}
`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec4 u_colors[10];
uniform float u_colorsCount;
uniform float u_distortion;
uniform float u_swirl;

in vec2 v_objectUV;
out vec4 fragColor;

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + mod(float(i), 3.) * .3;
  float c = .8 + mod(float(i + 1), 4.) * 0.25;

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 shape_uv = v_objectUV;
  shape_uv += .5;

  float t = .5 * u_time;

  float radius = smoothstep(0., 1., length(shape_uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    shape_uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., shape_uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., shape_uv.y));
    shape_uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., shape_uv.x));
  }

  vec2 uvRotated = shape_uv;
  uvRotated -= vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < 10; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, t);
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);
    dist = pow(dist, 3.5);
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= totalWeight;
  opacity /= totalWeight;

  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  fragColor = vec4(color, opacity);
}
`

function hexToRgba(hex: string): [number, number, number, number] {
  let clean = hex.replace(/^#/, "")
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("")
  }
  if (clean.length === 6) {
    clean += "ff"
  }
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const a = parseInt(clean.slice(6, 8), 16) / 255
  return [r, g, b, a]
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

interface MeshGradientProps {
  className?: string
  colors: string[]
  speed?: number
  distortion?: number
  swirl?: number
  backgroundColor?: string
}

export function MeshGradient({
  className = "",
  colors,
  speed = 0.25,
  distortion = 0.8,
  swirl = 0.1,
  backgroundColor = "transparent",
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorsFlat = useMemo(() => {
    const padded = new Float32Array(40)
    colors.slice(0, 10).forEach((hex, idx) => {
      const [r, g, b, a] = hexToRgba(hex)
      padded[idx * 4 + 0] = r
      padded[idx * 4 + 1] = g
      padded[idx * 4 + 2] = b
      padded[idx * 4 + 3] = a
    })
    return padded
  }, [colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true })
    if (!gl) return

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      return
    }

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const locs = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
      u_originX: gl.getUniformLocation(program, "u_originX"),
      u_originY: gl.getUniformLocation(program, "u_originY"),
      u_worldWidth: gl.getUniformLocation(program, "u_worldWidth"),
      u_worldHeight: gl.getUniformLocation(program, "u_worldHeight"),
      u_fit: gl.getUniformLocation(program, "u_fit"),
      u_scale: gl.getUniformLocation(program, "u_scale"),
      u_rotation: gl.getUniformLocation(program, "u_rotation"),
      u_offsetX: gl.getUniformLocation(program, "u_offsetX"),
      u_offsetY: gl.getUniformLocation(program, "u_offsetY"),
      u_colors: gl.getUniformLocation(program, "u_colors"),
      u_colorsCount: gl.getUniformLocation(program, "u_colorsCount"),
      u_distortion: gl.getUniformLocation(program, "u_distortion"),
      u_swirl: gl.getUniformLocation(program, "u_swirl"),
    }

    const resize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let rafId = 0
    let currentFrame = 0
    let lastTime = performance.now()

    const render = (now: number) => {
      const dt = now - lastTime
      lastTime = now
      currentFrame += dt * speed

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.uniform1f(locs.u_time, currentFrame * 0.001)
      gl.uniform2f(locs.u_resolution, canvas.width, canvas.height)
      gl.uniform1f(locs.u_pixelRatio, Math.min(window.devicePixelRatio || 1, 2))
      gl.uniform1f(locs.u_originX, 0.5)
      gl.uniform1f(locs.u_originY, 0.5)
      gl.uniform1f(locs.u_worldWidth, 0)
      gl.uniform1f(locs.u_worldHeight, 0)
      gl.uniform1f(locs.u_fit, 1)
      gl.uniform1f(locs.u_scale, 1)
      gl.uniform1f(locs.u_rotation, 0)
      gl.uniform1f(locs.u_offsetX, 0)
      gl.uniform1f(locs.u_offsetY, 0)
      gl.uniform4fv(locs.u_colors, colorsFlat)
      gl.uniform1f(locs.u_colorsCount, Math.min(colors.length, 10))
      gl.uniform1f(locs.u_distortion, distortion)
      gl.uniform1f(locs.u_swirl, swirl)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      gl.deleteBuffer(posBuffer)
      gl.deleteProgram(program)
    }
  }, [colors, colorsFlat, distortion, speed, swirl])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ backgroundColor, display: "block" }}
    />
  )
}

interface ShaderHeroProps {
  isDarkMode?: boolean
  badgeText?: string
  title?: string
  subtitle?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  whatsappCtaText?: string
  whatsappCtaHref: string
}

const letterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
}

export function ShaderHero({
  isDarkMode = true,
  badgeText = "Desenvolvimento Front-End & Back-End",
  title = "Desenvolvimento de Sites e Aplicações Web.",
  subtitle = "Desenvolvo páginas e aplicações web com atenção à organização, à interface e ao funcionamento. Cada projeto é pensado de acordo com seu conteúdo e suas necessidades.",
  primaryCtaText = "Explorar Projetos",
  primaryCtaHref = "#works",
  secondaryCtaText = "Fale Comigo",
  secondaryCtaHref = "#inquiry",
  whatsappCtaText = "Fale pelo WhatsApp",
  whatsappCtaHref,
}: ShaderHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const primaryColors = isDarkMode
    ? ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"]
    : ["#ffffff", "#f4f4f5", "#d4d4d8", "#27272a"]

  const secondaryColors = isDarkMode
    ? ["#000000", "#ffffff", "#2e2e2e"]
    : ["#ffffff", "#18181b", "#d4d4d8"]

  const words = title.split(" ")

  return (
    <section
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden w-full border-b transition-colors duration-300 ${
        isDarkMode ? "bg-black border-neutral-800" : "bg-white border-neutral-200"
      }`}
    >
      {/* Glass SVG filter from beratberkayg/shader-hero */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.004" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.25" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
              result="tint"
            />
          </filter>
        </defs>
      </svg>

      {/* Primary Shader Layer */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={primaryColors}
        speed={0.25}
        backgroundColor={isDarkMode ? "#000000" : "#ffffff"}
      />

      {/* Secondary Overlay Shader Layer */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-40"
        colors={secondaryColors}
        speed={0.15}
        backgroundColor="transparent"
      />

      {/* Scroll Rail */}
      <div
        className={`absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 font-mono text-xs ${
          isDarkMode ? "text-neutral-400" : "text-neutral-500"
        } tracking-[0.2em] [writing-mode:vertical-lr] z-10`}
      >
        <span>SCROLL DOWN</span>
        <div
          className={`w-[1px] h-20 bg-gradient-to-b ${
            isDarkMode ? "from-neutral-400" : "from-neutral-500"
          } to-transparent`}
        />
      </div>

      {/* Centered Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className={`mb-6 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-lg border ${
            isDarkMode
              ? "bg-white/10 text-white border-white/20"
              : "bg-black/5 text-neutral-900 border-black/15"
          }`}
        >
          <Sparkles
            className={`w-4 h-4 ${
              isDarkMode ? "text-neutral-200" : "text-neutral-700"
            }`}
          />
          <span>{badgeText}</span>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`text-5xl md:text-7xl font-extrabold tracking-tight flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-4xl leading-[1.05] ${
            isDarkMode ? "text-white drop-shadow-lg" : "text-neutral-950"
          }`}
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-flex whitespace-nowrap">
              {word.split("").map((char, charIdx) => (
                <motion.span key={charIdx} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className={`mt-6 max-w-2xl text-lg md:text-xl leading-relaxed ${
            isDarkMode ? "text-neutral-300" : "text-neutral-600"
          }`}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href={primaryCtaHref}
            className={`rounded-2xl px-7 py-4 text-base font-medium inline-flex items-center transition-colors shadow-sm ${
              isDarkMode
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            {primaryCtaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a
            href={secondaryCtaHref}
            className={`rounded-2xl px-7 py-4 text-base font-medium inline-flex items-center border backdrop-blur-md transition-colors ${
              isDarkMode
                ? "border-white/20 bg-white/5 text-white hover:bg-white/15"
                : "border-neutral-300 bg-white/70 text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {secondaryCtaText}
          </a>
          <a
            href={whatsappCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${whatsappCtaText} (abre em nova aba)`}
            className={`rounded-2xl px-7 py-4 text-base font-medium inline-flex items-center border backdrop-blur-md transition-colors ${
              isDarkMode
                ? "border-white/20 bg-white/5 text-white hover:bg-white/15"
                : "border-neutral-300 bg-white/70 text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <MessageCircle className="mr-2 h-5 w-5 text-[#25D366]" aria-hidden="true" />
            {whatsappCtaText}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default ShaderHero
