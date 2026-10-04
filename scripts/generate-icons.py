"""
Generate crisp, multi-resolution PNG icons for PageFyre Chrome Extension.
Uses 8x supersampling with Lanczos filtering to ensure pristine sharpness
and legibility at 16x16, 32x32, 48x48, and 128x128 px.
"""

import os
import math
from PIL import Image, ImageDraw

def create_pagefyre_icon(target_size):
    scale = 8
    S = target_size * scale
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Rounded-Square Seal Base (Midnight Ink)
    pad = int(S * 0.06)
    radius = int(S * 0.22)
    ink_color = (11, 13, 26, 255)       # #0B0D1A
    inner_ink = (22, 26, 52, 255)      # #161A34

    # Outer drop shadow
    shadow_pad = pad - int(S * 0.02)
    shadow_col = (0, 0, 0, 90)
    draw.rounded_rectangle([shadow_pad, shadow_pad + int(S * 0.03), S - shadow_pad, S - shadow_pad + int(S * 0.03)], radius=radius, fill=shadow_col)

    # Base ink rounded square
    draw.rounded_rectangle([pad, pad, S - pad, S - pad], radius=radius, fill=ink_color)

    # 2. Brass Beveled Outer Border
    brass_width = max(int(S * 0.04), 2)
    brass_color = (201, 162, 75, 255)    # #C9A24B
    brass_hi = (252, 230, 138, 255)     # #FCE68A
    brass_sh = (122, 92, 32, 255)       # #7A5C20

    # Draw border ring
    draw.rounded_rectangle([pad, pad, S - pad, S - pad], radius=radius, outline=brass_color, width=brass_width)

    # Inner filigree inset ring
    inset_pad = pad + int(S * 0.055)
    inset_rad = max(radius - int(S * 0.055), 2)
    inset_brass = (201, 162, 75, 120)
    draw.rounded_rectangle([inset_pad, inset_pad, S - inset_pad, S - inset_pad], radius=inset_rad, outline=inset_brass, width=max(int(S * 0.012), 1))

    # Corner Rivets on Brass Ring
    rivet_r = max(int(S * 0.02), 2)
    rivet_col = (254, 240, 138, 255)
    rivets = [
        (S // 2, pad + brass_width // 2),
        (S // 2, S - pad - brass_width // 2),
        (pad + brass_width // 2, S // 2),
        (S - pad - brass_width // 2, S // 2),
    ]
    for rx, ry in rivets:
        draw.ellipse([rx - rivet_r, ry - rivet_r, rx + rivet_r, ry + rivet_r], fill=rivet_col)

    # 3. Dragon Horns / Aurora Flame Crest
    # Horn coordinates normalized 0..1 relative to box inside
    cx = S * 0.52
    cy = S * 0.52

    # Flame / Crest Points (Cyan & Arcane Violet)
    flame_pts = [
        (S * 0.38, S * 0.44),
        (S * 0.42, S * 0.28),
        (S * 0.48, S * 0.35),
        (S * 0.56, S * 0.22),
        (S * 0.62, S * 0.32),
        (S * 0.72, S * 0.24),
        (S * 0.74, S * 0.38),
        (S * 0.65, S * 0.45),
        (S * 0.50, S * 0.44),
    ]
    aurora_violet = (168, 85, 247, 240) # #A855F7
    draw.polygon(flame_pts, fill=aurora_violet)

    # Secondary fiery crest layer
    flame_inner = [
        (S * 0.46, S * 0.40),
        (S * 0.50, S * 0.29),
        (S * 0.58, S * 0.24),
        (S * 0.65, S * 0.33),
        (S * 0.68, S * 0.42),
    ]
    aurora_cyan = (94, 234, 212, 230)  # #5EEAD4
    draw.polygon(flame_inner, fill=aurora_cyan)

    # 4. Main Dragon Head Silhouette (Parchment Ivory)
    head_pts = [
        (S * 0.34, S * 0.55),
        (S * 0.32, S * 0.44),
        (S * 0.40, S * 0.36),
        (S * 0.50, S * 0.36),
        (S * 0.62, S * 0.40),
        (S * 0.72, S * 0.42),
        (S * 0.82, S * 0.50),
        (S * 0.80, S * 0.55),
        (S * 0.73, S * 0.56),
        (S * 0.81, S * 0.61),
        (S * 0.78, S * 0.68),
        (S * 0.70, S * 0.68),
        (S * 0.64, S * 0.65),
        (S * 0.56, S * 0.72),
        (S * 0.46, S * 0.82),
        (S * 0.38, S * 0.81),
        (S * 0.40, S * 0.71),
        (S * 0.35, S * 0.65),
        (S * 0.33, S * 0.59),
    ]
    parchment_col = (243, 233, 210, 255) # #F3E9D2
    draw.polygon(head_pts, fill=parchment_col)

    # Jaw Shadow / Inset
    jaw_pts = [
        (S * 0.45, S * 0.64),
        (S * 0.54, S * 0.59),
        (S * 0.66, S * 0.58),
        (S * 0.72, S * 0.59),
        (S * 0.66, S * 0.65),
        (S * 0.56, S * 0.65),
        (S * 0.48, S * 0.73),
        (S * 0.44, S * 0.70),
    ]
    draw.polygon(jaw_pts, fill=ink_color)

    # Sharp Fang
    fang_pts = [
        (S * 0.64, S * 0.63),
        (S * 0.66, S * 0.70),
        (S * 0.69, S * 0.63),
    ]
    draw.polygon(fang_pts, fill=parchment_col)

    # 5. Glowing Ember Dragon Eye
    eye_x = S * 0.58
    eye_y = S * 0.48
    eye_r = max(int(S * 0.045), 2)
    ember_orange = (255, 122, 26, 255) # #FF7A1A
    draw.ellipse([eye_x - eye_r, eye_y - eye_r, eye_x + eye_r, eye_y + eye_r], fill=ember_orange)

    pupil_r = max(int(eye_r * 0.5), 1)
    draw.ellipse([eye_x - pupil_r, eye_y - pupil_r, eye_x + pupil_r, eye_y + pupil_r], fill=(254, 230, 138, 255))
    draw.ellipse([eye_x - pupil_r // 2, eye_y - pupil_r // 2, eye_x + pupil_r // 2, eye_y + pupil_r // 2], fill=ink_color)

    # 6. Spine Spikes
    spine_pts1 = [(S * 0.36, S * 0.46), (S * 0.28, S * 0.44), (S * 0.34, S * 0.52)]
    spine_pts2 = [(S * 0.32, S * 0.60), (S * 0.25, S * 0.61), (S * 0.31, S * 0.66)]
    draw.polygon(spine_pts1, fill=brass_color)
    draw.polygon(spine_pts2, fill=brass_color)

    # Downsample with Lanczos filtering
    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def main():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "icons")
    os.makedirs(out_dir, exist_ok=True)

    sizes = [16, 32, 48, 128]
    for size in sizes:
        icon_img = create_pagefyre_icon(size)
        out_path = os.path.join(out_dir, f"icon{size}.png")
        icon_img.save(out_path, format="PNG")
        print(f"Generated {out_path} ({size}x{size})")

if __name__ == "__main__":
    main()
