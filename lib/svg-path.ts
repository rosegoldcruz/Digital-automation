export type PathLike = SVGPathElement | null | undefined

// Treats the paths as one continuous route split into equal segments and returns the point at progress p (0..1).
export function pointAlong(paths: PathLike[], p: number) {
  const n = paths.length
  if (n === 0) return null
  const t = Math.min(Math.max(p, 0), 0.9999) * n
  const index = Math.floor(t)
  const el = paths[index]
  if (!el) return null
  return el.getPointAtLength((t - index) * el.getTotalLength())
}

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)
