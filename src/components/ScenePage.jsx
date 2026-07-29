/**
 * A full-bleed page over a scenic photograph.
 *
 * Both scenes are light images, so content on top uses dark green text
 * and frosted-white cards. The `wash` gradient softens and brightens the
 * photo and ties it to the brand green.
 *
 * @param {{image: string, wash: string}} scene - from SCENES in constants
 */
export default function ScenePage({ scene, children, className = '' }) {
  return (
    <div className={`scene-page ${className}`}>
      <div
        className="scene-page__photo"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${scene.image})` }}
      />
      <div className="scene-page__wash" style={{ background: scene.wash }} />
      <div className="scene-page__inner">{children}</div>
    </div>
  )
}
