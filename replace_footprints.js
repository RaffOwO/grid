const fs = require('fs');

const gen = fs.readFileSync('_archive/plank(5).kicad_pcb', 'utf8');
const lines = gen.split('\n');

// Extract a footprint block starting at a given line index
function extractFootprintBlock(lines, startIndex) {
  let depth = 0;
  const block = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    block.push(line);
    for (const ch of line) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
    }
    if (depth === 0) return { lines: block, end: i };
  }
  return { lines: block, end: lines.length - 1 };
}

// Find all footprint start indices and types
const footprints = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('(footprint "')) {
    const name = lines[i].match(/"([^"]+)"/)[1];
    const { end } = extractFootprintBlock(lines, i);
    footprints.push({ name, start: i, end });
  }
}

console.log('Found', footprints.length, 'footprints:');
const counts = {};
footprints.forEach(f => { counts[f.name] = (counts[f.name] || 0) + 1; });
for (const [k, v] of Object.entries(counts)) console.log('  ', k + ':', v);

// Build replacement for Choc+Jerzii
function buildChocJerzii(blockLines) {
  const atLine = blockLines.find(l => l.includes('(at '));
  const refLine = blockLines.find(l => l.includes('"Reference"'));
  const pad1Line = blockLines.find(l => l.includes('pad "1"') && l.includes('thru_hole'));
  const pad2Line = blockLines.find(l => l.includes('pad "2"') && l.includes('thru_hole'));

  const at = atLine ? atLine.match(/\(at\s+([^)]+)\)/)?.[1] : '0 0 0';
  const ref = refLine ? refLine.match(/"Reference"\s+"([^"]+)"/)?.[1] : 'S?';
  const netFrom = pad1Line ? pad1Line.match(/\(net\s+[^)]+\)/)?.[0] : '(net 0 "")';
  const netTo = pad2Line ? pad2Line.match(/\(net\s+[^)]+\)/)?.[0] : '(net 0 "")';

  return `(footprint "Choc+Jerzii"
    (layer "F.Cu")
    (at ${at})
    (property "Reference" "${ref}"
      (at 0 0 0)
      (layer "F.SilkS")
      hide
      (effects (font (size 1.27 1.27) (thickness 0.15)))
    )
    (property "Value" ""
      (at 0 0 0)
      (layer "F.SilkS")
      hide
      (effects (font (size 1.27 1.27) (thickness 0.15)))
    )

    (attr through_hole)

    (fp_line (start -9 -8.5) (end 9 -8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 9 -8.5) (end 9 8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 9 8.5) (end -9 8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -9 8.5) (end -9 -8.5) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

    (fp_line (start -7 -6) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -7 6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6 -7) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -6 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 6 7) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 6 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 7 -6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 6) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

    (pad "" np_thru_hole circle (at 0 0) (size 4.9 4.9) (drill 4.9) (layers "*.Cu" "*.Mask"))

    (pad "" np_thru_hole circle (at -5.5 0) (size 1.9 1.9) (drill 1.9) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole circle (at 5.5 0) (size 1.9 1.9) (drill 1.9) (layers "*.Cu" "*.Mask"))

    (pad "1" thru_hole roundrect (at -4.59 -3.43 135) (size 3.025 2.025) (drill oval 2.27 1.27) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.2202643172) ${netFrom})

    (pad "1" thru_hole roundrect (at 4.63 -3.4 225) (size 3.025 2.025) (drill oval 2.27 1.27) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.2202643172) ${netFrom})

    (pad "2" thru_hole circle (at 0 -5.9) (size 2.032 2.032) (drill 1.27) (layers "*.Cu" "*.Mask") ${netTo})
  )`;
}

// Build replacement for MCU_NRF52840
function buildNrf52840(blockLines) {
  const atLine = blockLines.find(l => l.includes('(at '));
  const refLine = blockLines.find(l => l.includes('"Reference"'));

  const at = atLine ? atLine.match(/\(at\s+([^)]+)\)/)?.[1] : '0 0 0';
  const ref = refLine ? refLine.match(/"Reference"\s+"([^"]+)"/)?.[1] : 'MCU?';

  // Extract net assignments from original pads
  const netByName = {};
  for (const line of blockLines) {
    if (line.includes('(pad "') && line.includes('thru_hole')) {
      const netMatch = line.match(/\(net\s+(\d+)\s+"([^"]+)"\)/);
      if (netMatch) {
        netByName[netMatch[2]] = `(net ${netMatch[1]} "${netMatch[2]}")`;
      }
    }
  }
  const getNet = (name) => netByName[name] || '(net 0 "")';

  return `(footprint "MCU_NRF52840"
    (layer "F.Cu")
    (at ${at})
    (property "Reference" "${ref}"
      (at 0 0 0)
      (layer "F.SilkS")
      hide
      (effects (font (size 1.27 1.27) (thickness 0.15)))
    )
    (property "Value" ""
      (at 0 0 0)
      (layer "F.SilkS")
      hide
      (effects (font (size 1.27 1.27) (thickness 0.15)))
    )

    (attr exclude_from_pos_files exclude_from_bom)

    (fp_line (start -8.95 14.03) (end -8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 14.03) (end -8.95 14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 14.03) (end -6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 -16.57) (end -8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 14.03) (end 6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 14.03) (end 6.29 14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 14.03) (end 8.95 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -16.57) (end 6.29 -16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))

    (fp_line (start -8.95 -16.57) (end -6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 14.03) (end -8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 14.03) (end -6.29 14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 14.03) (end -6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 -16.57) (end 8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 11.43) (end 8.95 11.43) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 14.03) (end 6.29 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 14.03) (end 8.95 14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 14.03) (end 8.95 -16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))

    (fp_line (start -8.89 -16.57) (end 8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 16.51) (end -8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 16.51) (end 8.89 16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 16.51) (end -3.81 17.2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 17.2) (end 3.556 17.2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 3.556 17.2) (end 3.556 16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 8.89 16.51) (end 8.89 -16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))

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

    (pad "0" thru_hole circle (at 7.62 15.2) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('BAT_P')})
    (pad "1" thru_hole circle (at 7.62 12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P1')})
    (pad "2" thru_hole circle (at 7.62 10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P0')})
    (pad "3" thru_hole circle (at 7.62 7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('GND')})
    (pad "4" thru_hole circle (at 7.62 5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('GND')})
    (pad "5" thru_hole circle (at 7.62 2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P2')})
    (pad "6" thru_hole circle (at 7.62 0) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P3')})
    (pad "7" thru_hole circle (at 7.62 -2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P4')})
    (pad "8" thru_hole circle (at 7.62 -5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P5')})
    (pad "9" thru_hole circle (at 7.62 -7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P6')})
    (pad "10" thru_hole circle (at 7.62 -10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P7')})
    (pad "11" thru_hole circle (at 7.62 -12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P8')})
    (pad "12" thru_hole circle (at 7.62 -15.24) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P9')})

    (pad "13" thru_hole circle (at -7.62 -15.24) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P10')})
    (pad "14" thru_hole circle (at -7.62 -12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P16')})
    (pad "15" thru_hole circle (at -7.62 -10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P14')})
    (pad "16" thru_hole circle (at -7.62 -7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P15')})
    (pad "17" thru_hole circle (at -7.62 -5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P18')})
    (pad "18" thru_hole circle (at -7.62 -2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P19')})
    (pad "19" thru_hole circle (at -7.62 0) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P20')})
    (pad "20" thru_hole circle (at -7.62 2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('P21')})
    (pad "21" thru_hole circle (at -7.62 5.08) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('VCC')})
    (pad "22" thru_hole circle (at -7.62 7.62) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('RST')})
    (pad "23" thru_hole circle (at -7.62 10.16) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('GND')})
    (pad "24" thru_hole circle (at -7.62 12.7) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('RAW')})
    (pad "25" thru_hole circle (at -7.62 15.2) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${getNet('BAT_N')})
  )`;
}

// Build output
const result = [];
let i = 0;
while (i < lines.length) {
  const fp = footprints.find(f => f.start === i);
  if (fp) {
    const blockLines = lines.slice(fp.start, fp.end + 1);
    if (fp.name === 'ceoloide:switch_choc_v1_v2') {
      result.push(buildChocJerzii(blockLines));
    } else if (fp.name === 'ceoloide:mcu_supermini_nrf52840') {
      result.push(buildNrf52840(blockLines));
    } else {
      result.push(...blockLines);
    }
    i = fp.end + 1;
  } else {
    result.push(lines[i]);
    i++;
  }
}

fs.writeFileSync('output/pcbs/main.kicad_pcb', result.join('\n'));
console.log('Done! Written to output/pcbs/main.kicad_pcb');
