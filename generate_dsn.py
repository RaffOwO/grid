#!/usr/bin/env python3
"""Generate Specctra DSN file from KiCad 8 PCB for FreeRouting."""

import re
import sys
import os

def parse_kicad_pcb(filepath):
    """Parse KiCad 8 PCB file and extract pads, nets, and board outline."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Extract net declarations (KiCad 8 format: (net "NAME"))
    nets = {}
    net_pattern = r'\(net "([^"]+)"\)'
    for i, match in enumerate(re.finditer(net_pattern, content)):
        net_name = match.group(1)
        nets[net_name] = i + 1  # Assign net IDs starting from 1

    # Extract board dimensions from edge cuts
    edge_lines = re.findall(
        r'\(gr_line \(start ([\d.-]+) ([\d.-]+)\) \(end ([\d.-]+) ([\d.-]+)\).*Edge\.Cuts',
        content
    )
    edge_arcs = re.findall(
        r'\(gr_arc \(start ([\d.-]+) ([\d.-]+)\) \(mid ([\d.-]+) ([\d.-]+)\) \(end ([\d.-]+) ([\d.-]+)\).*Edge\.Cuts',
        content
    )

    xs = []
    ys = []
    for x1, y1, x2, y2 in edge_lines:
        xs.extend([float(x1), float(x2)])
        ys.extend([float(y1), float(y2)])
    for x1, y1, mx, my, x2, y2 in edge_arcs:
        xs.extend([float(x1), float(x2), float(mx)])
        ys.extend([float(y1), float(y2), float(my)])

    board_x_min = min(xs) if xs else 0
    board_x_max = max(xs) if xs else 0
    board_y_min = min(ys) if ys else 0
    board_y_max = max(ys) if ys else 0

    # Parse footprints and their pads
    lines = content.split('\n')
    footprints = []
    in_footprint = False
    current_fp = None
    paren_depth = 0

    for i, line in enumerate(lines):
        if '(footprint "' in line:
            in_footprint = True
            paren_depth = 0

            fp_match = re.search(r'\(footprint "([^"]+)"', line)
            fp_name = fp_match.group(1) if fp_match else "unknown"

            # Find layer
            fp_layer = "F.Cu"
            for j in range(i, min(i+5, len(lines))):
                layer_match = re.search(r'\(layer "([^"]+)"\)', lines[j])
                if layer_match:
                    fp_layer = layer_match.group(1)
                    break

            # Find position
            fp_x, fp_y = 0, 0
            for j in range(i, min(i+10, len(lines))):
                at_match = re.search(r'\(at ([\d.-]+) ([\d.-]+)', lines[j])
                if at_match:
                    fp_x = float(at_match.group(1))
                    fp_y = float(at_match.group(2))
                    break

            current_fp = {
                'name': fp_name,
                'layer': fp_layer,
                'x': fp_x,
                'y': fp_y,
                'pads': []
            }
            footprints.append(current_fp)

        elif in_footprint:
            paren_depth += line.count('(') - line.count(')')

            # Parse pads
            if '(pad ' in line:
                pad_match = re.search(r'\(pad (\d+) (\w+)', line)
                if pad_match:
                    pad_num = int(pad_match.group(1))
                    pad_type = pad_match.group(2)

                    # Find pad position and net in next few lines
                    pad_x, pad_y = 0, 0
                    pad_net = None
                    for j in range(i, min(i+15, len(lines))):
                        at_match = re.search(r'\(at ([\d.-]+) ([\d.-]+)', lines[j])
                        if at_match:
                            pad_x = float(at_match.group(1))
                            pad_y = float(at_match.group(2))
                        net_match = re.search(r'\(net "([^"]+)"\)', lines[j])
                        if net_match:
                            pad_net = net_match.group(1)
                        if pad_x != 0 or pad_y != 0:
                            break

                    # Pad position is relative to footprint
                    abs_x = fp_x + pad_x
                    abs_y = fp_y + pad_y

                    current_fp['pads'].append({
                        'num': pad_num,
                        'type': pad_type,
                        'x': abs_x,
                        'y': abs_y,
                        'net': pad_net
                    })

            # Check if footprint is closed
            if paren_depth <= 0 and current_fp:
                in_footprint = False
                current_fp = None

    return nets, footprints, board_x_min, board_x_max, board_y_min, board_y_max


def generate_dsn(nets, footprints, board_x_min, board_x_max, board_y_min, board_y_max, output_path):
    """Generate Specctra DSN file."""
    # Collect all unique pad positions with their nets
    pad_connections = {}  # (x, y) -> [(net_name, footprint_name, pad_num)]

    for fp in footprints:
        for pad in fp['pads']:
            if pad['net']:
                key = (round(pad['x'], 2), round(pad['y'], 2))
                if key not in pad_connections:
                    pad_connections[key] = []
                pad_connections[key].append({
                    'net': pad['net'],
                    'fp': fp['name'],
                    'pad': pad['num']
                })

    # Generate DSN
    with open(output_path, 'w') as f:
        # Header
        f.write("version 5.0\n")
        f.write("units mil\n")
        f.write("\n")

        # Board outline (convert mm to mil: 1mm = 39.37 mil)
        f.write("board\n")
        f.write("  outline\n")
        f.write("    polygon\n")
        x_min_mil = board_x_min * 39.37
        y_min_mil = board_y_min * 39.37
        x_max_mil = board_x_max * 39.37
        y_max_mil = board_y_max * 39.37
        f.write(f"      ({x_min_mil:.1f} {y_min_mil:.1f})\n")
        f.write(f"      ({x_max_mil:.1f} {y_min_mil:.1f})\n")
        f.write(f"      ({x_max_mil:.1f} {y_max_mil:.1f})\n")
        f.write(f"      ({x_min_mil:.1f} {y_max_mil:.1f})\n")
        f.write("    endpolygon\n")
        f.write("  endoutline\n")
        f.write("endboard\n")
        f.write("\n")

        # Nets
        for net_name, net_id in sorted(nets.items(), key=lambda x: x[1]):
            f.write(f"net {net_name}\n")
            f.write("  pin\n")

            # Find all pads connected to this net
            for pos, connections in pad_connections.items():
                for conn in connections:
                    if conn['net'] == net_name:
                        x_mil = pos[0] * 39.37
                        y_mil = pos[1] * 39.37
                        f.write(f"    {conn['fp']}:{conn['pad']} ({x_mil:.1f} {y_mil:.1f})\n")

            f.write("  endpin\n")
            f.write("endnet\n")
            f.write("\n")

        # Design rules
        f.write("rules\n")
        f.write("  clearance\n")
        f.write("    default 4  # 0.1mm in mil\n")
        f.write("  endclearance\n")
        f.write("  width\n")
        f.write("    default 5  # 0.127mm in mil\n")
        f.write("  endwidth\n")
        f.write("endrules\n")

    print(f"DSN file generated: {output_path}")
    print(f"  Nets: {len(nets)}")
    print(f"  Pad connections: {len(pad_connections)}")
    print(f"  Footprints: {len(footprints)}")


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <input.kicad_pcb> <output.dsn>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    print(f"Parsing {input_file}...")
    nets, footprints, x_min, x_max, y_min, y_max = parse_kicad_pcb(input_file)
    print(f"Generating {output_file}...")
    generate_dsn(nets, footprints, x_min, x_max, y_min, y_max, output_file)


if __name__ == '__main__':
    main()
