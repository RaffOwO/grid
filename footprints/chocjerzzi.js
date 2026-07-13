// Choc + Jerzzi dual switch footprint
// Based on RaffOwO's Choc+Jerzii.kicad_mod
// https://github.com/RaffOwO/RaffOwOKiCaD
//
// Nets
//    from: corresponds to pin 1 (both Choc and Jerzzi sides)
//    to:   corresponds to pin 2 (shared)
//
// This footprint has two pin-1 pads (one for Choc, one for Jerzzi)
// and a shared pin-2 pad, so you can solder either switch type.

module.exports = {
  params: {
    designator: 'S',
    from: undefined,
    to: undefined
  },
  body: p => {
    return `
      (footprint "Choc+Jerzii"
        (layer "F.Cu")
        ${p.at /* parametric position */}

        (property "Reference" "${p.ref}"
          (at 0 0 0)
          (layer "F.SilkS")
          ${p.ref_hide}
          (effects (font (size 1.27 1.27) (thickness 0.15)))
        )
        (property "Value" ""
          (at 0 0 0)
          (layer "F.SilkS")
          hide
          (effects (font (size 1.27 1.27) (thickness 0.15)))
        )

        (attr through_hole)

        ${'' /* keycap outline (18x17 Choc keycap) */}
        (fp_line (start -9 -8.5) (end 9 -8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 9 -8.5) (end 9 8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 9 8.5) (end -9 8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -9 8.5) (end -9 -8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

        ${'' /* switch outline (14x14) */}
        (fp_line (start -7 -6) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -7 7) (end -7 6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -6 -7) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -7 7) (end -6 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 6 7) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 7 -7) (end 6 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 7 -7) (end 7 -6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 7 6) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

        ${'' /* center shaft (Choc compatible) */}
        (pad "" np_thru_hole circle (at 0 0) (size 4.9 4.9) (drill 4.9) (layers "*.Cu" "*.Mask"))

        ${'' /* stabilizer holes */}
        (pad "" np_thru_hole circle (at -5.5 0) (size 1.9 1.9) (drill 1.9) (layers "*.Cu" "*.Mask"))
        (pad "" np_thru_hole circle (at 5.5 0) (size 1.9 1.9) (drill 1.9) (layers "*.Cu" "*.Mask"))

        ${'' /* Choc pin 1 (left side) */}
        (pad 1 thru_hole roundrect (at -4.59 -3.43 135) (size 3.025 2.025) (drill oval 2.27 1.27) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.2202643172) ${p.from})

        ${'' /* Jerzzi pin 1 (right side) */}
        (pad 1 thru_hole roundrect (at 4.63 -3.4 225) (size 3.025 2.025) (drill oval 2.27 1.27) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.2202643172) ${p.from})

        ${'' /* shared pin 2 */}
        (pad 2 thru_hole circle (at 0 -5.9) (size 2.032 2.032) (drill 1.27) (layers "*.Cu" "*.Mask") ${p.to})
      )
    `
  }
}
