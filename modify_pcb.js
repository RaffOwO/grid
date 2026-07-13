const fs = require('fs');

let gen = fs.readFileSync('output/pcbs/main.kicad_pcb', 'utf8');

// 1. Remove S46, LED46, D46 already done in previous step
// But let's redo from scratch to be safe
const lines = gen.split('\n');
const result = [];
let blockDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('(footprint "')) {
    // Find end of this footprint block
    let blockEnd = i;
    let d = 0;
    for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '(') d++;
        if (ch === ')') d--;
      }
      if (d === 0 && j > i) {
        blockEnd = j;
        break;
      }
    }
    const block = lines.slice(i, blockEnd + 1).join('\n');
    const refMatch = block.match(/"Reference"\s+"([^"]+)"/);
    const ref = refMatch ? refMatch[1] : '';
    
    if (ref === 'S46' || ref === 'LED46' || ref === 'D46') {
      i = blockEnd;
      continue;
    }
  }
  
  result.push(line);
}

gen = result.join('\n');

// 2. Fix top-right corner radius from 2.5 to 9.25
// Current edge cuts (exact strings from file):
// Right edge:  (gr_line (start 268.525 106.47500000000001) (end 268.525 36.375000000000014) ...)
// Top edge:    (gr_line (start 266.025 33.875000000000014) (end 43.525000000000006 33.875000000000014) ...)
// Top-right arc: (gr_arc (start 268.525 36.375000000000014) (mid 267.79276699999997 34.607233000000015) (end 266.025 33.875000000000014) ...)

const r = 9.25;
const cx = 259.275;  // center x
const cy = 43.125;   // center y
const midX = cx + r * Math.cos(Math.PI / 4);  // 265.8157...
const midY = cy - r * Math.sin(Math.PI / 4);  // 36.5843...

// Replace right edge: change end Y from 36.375 to 43.125
gen = gen.replace(
  '(gr_line (start 268.525 106.47500000000001) (end 268.525 36.375000000000014)',
  `(gr_line (start 268.525 106.47500000000001) (end 268.525 ${cy})`
);

// Replace top edge: change start X from 266.025 to 259.275
gen = gen.replace(
  '(gr_line (start 266.025 33.875000000000014) (end 43.525000000000006 33.875000000000014)',
  `(gr_line (start ${cx} 33.875000000000014) (end 43.525000000000006 33.875000000000014)`
);

// Replace top-right arc
gen = gen.replace(
  '(gr_arc (start 268.525 36.375000000000014) (mid 267.79276699999997 34.607233000000015) (end 266.025 33.875000000000014)',
  `(gr_arc (start 268.525 ${cy}) (mid ${midX} ${midY}) (end ${cx} 33.875000000000014)`
);

fs.writeFileSync('output/pcbs/main.kicad_pcb', gen);
console.log('Done!');
console.log('Removed S46, LED46, D46');
console.log('Top-right corner radius: 2.5 -> 9.25');
console.log('Arc: from (268.525, ' + cy + ') to (' + cx + ', 33.875), mid (' + midX + ', ' + midY + ')');
