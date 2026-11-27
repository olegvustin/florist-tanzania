/* Seat only positions produced by an explicit harmony preset. These are
   design-unit offsets, so the same bouquet is preserved in mobile and handoff.
   Wide linen folds need a deeper seat than the steeper African side wings. */
function ftz215SeatHarmony(positions, ids, sleeve) {
  const fit = {
    kraft:[11,100], linen:[14,104], velvet:[11,99], signature:[11,99],
    savanna:[8,91], baobab:[8,91], kilimanjaro:[9,94], zanzibar:[9,94]
  };
  if (!Object.prototype.hasOwnProperty.call(fit,sleeve)) return positions;
  const [drop, lowerTier]=fit[sleeve];
  return positions.map((p,i)=>{
    const profile=bouquetFlowerProfile(ids[i]);
    // The renderer adds the species' own offset. Use the rendered height
    // here, and ease back near the low side folds or already-low front row.
    const edge=Math.min(1,Math.abs(p.x)/69);
    const extra=Math.max(0,Math.min(drop*(1-.17*edge),
      lowerTier-8*edge-(p.y+(Number(profile.dy)||0)),108-p.y));
    return {...p,y:+(p.y+extra).toFixed(2)};
  });
}
