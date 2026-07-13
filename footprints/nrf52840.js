// NRF52840 MCU module footprint
// Based on RaffOwO's MCU_NRF52840.kicad_mod
// https://github.com/RaffOwO/RaffOwOKiCaD
//
// This is a through-hole module with 26 pins (0-25) in a 2-row layout:
//   Right column (x=+7.62): pins 0-12 (top to bottom: B+, P1, P0, GND, GND, P2, P3, P4, P5, P6, P7, P8, P9)
//   Left column  (x=-7.62): pins 13-25 (bottom to top: P10, P16, P14, P15, P18, P19, P20, P21, VCC, RST, GND, RAW, B-)
//
// Params
//    orientation: default is 'down' (component side down)
//      if 'up', flips the footprint
//    All pin nets default to their own named net (P0, P1, etc.)

module.exports = {
  params: {
    designator: 'MCU',
    orientation: 'down',
    RAW: {type: 'net', value: 'RAW'},
    GND: {type: 'net', value: 'GND'},
    RST: {type: 'net', value: 'RST'},
    VCC: {type: 'net', value: 'VCC'},
    P0:  {type: 'net', value: 'P0'},
    P1:  {type: 'net', value: 'P1'},
    P2:  {type: 'net', value: 'P2'},
    P3:  {type: 'net', value: 'P3'},
    P4:  {type: 'net', value: 'P4'},
    P5:  {type: 'net', value: 'P5'},
    P6:  {type: 'net', value: 'P6'},
    P7:  {type: 'net', value: 'P7'},
    P8:  {type: 'net', value: 'P8'},
    P9:  {type: 'net', value: 'P9'},
    P10: {type: 'net', value: 'P10'},
    P14: {type: 'net', value: 'P14'},
    P15: {type: 'net', value: 'P15'},
    P16: {type: 'net', value: 'P16'},
    P18: {type: 'net', value: 'P18'},
    P19: {type: 'net', value: 'P19'},
    P20: {type: 'net', value: 'P20'},
    P21: {type: 'net', value: 'P21'},
    BPOS: {type: 'net', value: 'BPOS'},
    BNEG: {type: 'net', value: 'BNEG'}
  },
  body: p => {
    const standard = `
      (footprint "MCU_NRF52840"
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

        (attr exclude_from_pos_files exclude_from_bom)

        ${'' /* front silk - component outline */}
        (fp_line (start -8.95 14.03) (end -8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -6.29 14.03) (end -8.95 14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -6.29 14.03) (end -6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -6.29 -16.57) (end -8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 6.29 14.03) (end 6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 8.95 14.03) (end 6.29 14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 8.95 14.03) (end 8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 8.95 -16.57) (end 6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))

        ${'' /* back silk - component outline */}
        (fp_line (start -8.95 -16.57) (end -6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -8.95 14.03) (end -8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -8.95 14.03) (end -6.29 14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start -6.29 14.03) (end -6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 6.29 -16.57) (end 8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 6.29 11.43) (end 8.95 11.43) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 6.29 14.03) (end 6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 6.29 14.03) (end 8.95 14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        (fp_line (start 8.95 14.03) (end 8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))

        ${'' /* Dwgs.User - board outline + USB overhang */}
        (fp_line (start -8.89 -16.57) (end 8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -8.89 16.51) (end -8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -8.89 16.51) (end 8.89 16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -3.81 16.51) (end -3.81 17.2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start -3.81 17.2) (end 3.556 17.2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 3.556 17.2) (end 3.556 16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
        (fp_line (start 8.89 16.51) (end 8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

        ${'' /* front silk - pin labels right column */}
        (fp_text user "B+" (at 4.44 15.19) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P1" (at 4.45 12.7) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P0" (at 4.45 10.16) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "GND" (at 4.45 7.62) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "GND" (at 4.45 5.08) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P2" (at 4.45 2.54) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P3" (at 4.45 0) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P4" (at 4.45 -2.54) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P5" (at 4.45 -5.08) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P6" (at 4.45 -7.62) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P7" (at 4.45 -10.16) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P8" (at 4.45 -12.7) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P9" (at 4.45 -15.24) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* front silk - pin labels left column */}
        (fp_text user "B-" (at -5.1 15.2) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "RAW" (at -5.04 12.7) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "GND" (at -5.04 10.16) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "RST" (at -5.04 7.62) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "VCC" (at -5.04 5.08) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P21" (at -5.04 2.54) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P20" (at -5.04 0) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P19" (at -5.04 -2.54) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P18" (at -5.04 -5.08) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P15" (at -5.04 -7.62) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P14" (at -5.04 -10.16) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P16" (at -5.04 -12.7) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
        (fp_text user "P10" (at -5.04 -15.24) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* back silk - pin labels right column (mirrored) */}
        (fp_text user "B+" (at 4.44 15.19) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P1" (at 4.45 12.7) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P0" (at 4.45 10.16) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "GND" (at 4.45 7.62) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "GND" (at 4.45 5.08) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P2" (at 4.45 2.54) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P3" (at 4.45 0) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P4" (at 4.45 -2.54) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P5" (at 4.45 -5.08) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P6" (at 4.45 -7.62) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P7" (at 4.45 -10.16) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P8" (at 4.45 -12.7) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P9" (at 4.45 -15.24) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))

        ${'' /* back silk - pin labels left column (mirrored) */}
        (fp_text user "B-" (at -5.1 15.2) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "RAW" (at -5.04 12.7) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "GND" (at -5.04 10.16) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "RST" (at -5.04 7.62) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "VCC" (at -5.04 5.08) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P21" (at -5.04 2.54) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P20" (at -5.04 0) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P19" (at -5.04 -2.54) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P18" (at -5.04 -5.08) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P15" (at -5.04 -7.62) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P14" (at -5.04 -10.16) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P16" (at -5.04 -12.7) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
        (fp_text user "P10" (at -5.04 -15.24) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
    `

    function pins(flip) {
      // When orientation is 'down', right column is on F.Cu side
      // When orientation is 'up', we mirror left/right
      const rx = flip ? '-7.62' : '7.62'
      const lx = flip ? '7.62' : '-7.62'
      return `
        ${'' /* right column pads (pins 0-12) */}
        (pad 0 thru_hole circle (at ${rx} 15.2) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.BPOS})
        (pad 1 thru_hole circle (at ${rx} 12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P1})
        (pad 2 thru_hole circle (at ${rx} 10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P0})
        (pad 3 thru_hole circle (at ${rx} 7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.GND})
        (pad 4 thru_hole circle (at ${rx} 5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.GND})
        (pad 5 thru_hole circle (at ${rx} 2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P2})
        (pad 6 thru_hole circle (at ${rx} 0) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P3})
        (pad 7 thru_hole circle (at ${rx} -2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P4})
        (pad 8 thru_hole circle (at ${rx} -5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P5})
        (pad 9 thru_hole circle (at ${rx} -7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P6})
        (pad 10 thru_hole circle (at ${rx} -10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P7})
        (pad 11 thru_hole circle (at ${rx} -12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P8})
        (pad 12 thru_hole circle (at ${rx} -15.24) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P9})

        ${'' /* left column pads (pins 13-25) */}
        (pad 13 thru_hole circle (at ${lx} -15.24) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P10})
        (pad 14 thru_hole circle (at ${lx} -12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P16})
        (pad 15 thru_hole circle (at ${lx} -10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P14})
        (pad 16 thru_hole circle (at ${lx} -7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P15})
        (pad 17 thru_hole circle (at ${lx} -5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P18})
        (pad 18 thru_hole circle (at ${lx} -2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P19})
        (pad 19 thru_hole circle (at ${lx} 0) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P20})
        (pad 20 thru_hole circle (at ${lx} 2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P21})
        (pad 21 thru_hole circle (at ${lx} 5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.VCC})
        (pad 22 thru_hole circle (at ${lx} 7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.RST})
        (pad 23 thru_hole circle (at ${lx} 10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.GND})
        (pad 24 thru_hole circle (at ${lx} 12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.RAW})
        (pad 25 thru_hole circle (at ${lx} 15.2) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.BNEG})
      )
      `
    }

    if(p.orientation == 'up') {
      return `${standard}\n${pins(true)}`
    } else {
      return `${standard}\n${pins(false)}`
    }
  }
}
