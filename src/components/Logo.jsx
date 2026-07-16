/**
 * Coach Mishael's "M" mark on a brand-green rounded tile.
 * The image lives in /public, so it's referenced by URL (no import needed).
 *
 * @param {number}  size  width/height in px
 * @param {boolean} bob   gentle floating animation (used on the splash screen)
 */
export default function Logo({ size = 48, bob = false, style = {} }) {
  return (
    <div
      className={`logo${bob ? ' logo--bob' : ''}`}
      style={{ width: size, height: size, ...style }}
      aria-label="Coach Mishael"
    >
      <img src={`${import.meta.env.BASE_URL}logo-white.png`} alt="" />
    </div>
  )
}
