export function Mascot() {
  return (
    <div className="mascot-scene" aria-hidden="true">
      <span className="float-key float-a">A</span>
      <span className="float-key float-s">S</span>
      <span className="float-key float-star">✦</span>
      <span className="scene-spark spark-one">✧</span>
      <span className="scene-spark spark-two">✦</span>
      <div className="mascot-shadow" />
      <div className="mascot-body">
        <span className="mascot-eye left" />
        <span className="mascot-eye right" />
        <span className="mascot-cheek left" />
        <span className="mascot-cheek right" />
        <span className="mascot-smile" />
        <div className="mascot-keys">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <span className="mascot-space" />
      </div>
      <span className="mascot-hand left" />
      <span className="mascot-hand right" />
    </div>
  );
}
