"""Generate PWA icons for BilluYo with rounded corners and gradient."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')

def make_icon(size, radius):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle with gradient purple (#8B5CF6 → #EC4899)
    for y in range(size):
        r = int(139 + (236 - 139) * y / size)
        g = int(92 + (72 - 92) * y / size)
        b = int(246 + (153 - 246) * y / size)
        for x in range(size):
            # Rounded corner check
            corners = [
                (x < radius and y < radius, (x - radius) ** 2 + (y - radius) ** 2 > radius ** 2),
                (x >= size - radius and y < radius, (x - (size - radius)) ** 2 + (y - radius) ** 2 > radius ** 2),
                (x < radius and y >= size - radius, (x - radius) ** 2 + (y - (size - radius)) ** 2 > radius ** 2),
                (x >= size - radius and y >= size - radius, (x - (size - radius)) ** 2 + (y - (size - radius)) ** 2 > radius ** 2),
            ]
            outside_corner = any(c[0] and c[1] for c in corners)
            if not outside_corner:
                draw.point((x, y), fill=(r, g, b, 255))

    # Draw "B" letter in white
    try:
        from PIL import ImageFont
        font_size = size // 2
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()
        bb = draw.textbbox((0, 0), "B", font=font)
        tw = bb[2] - bb[0]
        th = bb[3] - bb[1]
        x = (size - tw) // 2 - bb[0]
        y = (size - th) // 2 - bb[1]
        draw.text((x, y), "B", fill="white", font=font)
    except Exception:
        pass

    return img

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for size, radius in [(192, 32), (512, 80)]:
        img = make_icon(size, radius)
        path = os.path.join(OUT, f'pwa-{size}.png')
        img.save(path, 'PNG')
        print(f'Generated {path} ({size}x{size})')
