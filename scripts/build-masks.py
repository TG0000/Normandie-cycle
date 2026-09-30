"""
Génère public/img/sl9-mask.png à partir de public/img/sl9.webp.

Canaux :
  R = parties FIXES (255) vs parties qui TOURNENT avec les roues (0)
  G = peinture du cadre (recoloration + reflet de lumière), bords adoucis
  B = zone « roue » (disque elliptique), pour l'ombre / flou de mouvement

Usage : python3 scripts/build-masks.py   (requiert pillow + numpy)
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/img/sl9.webp'
OUT = ROOT / 'public/img/sl9-mask.png'

# Ellipses des roues (centre x, centre y, demi-axe x, demi-axe y) — ajustées sur les flancs beiges
WHEELS = [(523.7, 718.7, 315.6, 310.1), (1477.8, 719.9, 314.1, 309.7)]
DISK = 1.045  # rayon normalisé du disque de roue (pneu compris)

# Polygones des pièces fixes superposées aux roues (non détectables par la couleur)
STATIC_POLYS = [
    # dérailleur arrière + chape
    [(440, 742), (505, 736), (565, 755), (582, 795), (570, 830), (585, 880), (566, 905), (500, 905), (488, 862), (462, 838), (438, 822)],
    # brin supérieur de chaîne
    [(552, 678), (860, 678), (860, 704), (552, 704)],
    # brin inférieur de chaîne
    [(500, 878), (880, 874), (880, 908), (500, 910)],
    # étrier arrière
    [(572, 645), (630, 645), (632, 728), (572, 728)],
    # dérailleur avant
    [(812, 600), (910, 600), (910, 692), (812, 692)],
    # base arrière (décor SPECIALIZED) et hauban
    [(500, 700), (560, 688), (848, 742), (848, 792), (560, 764), (500, 748)],
    [(498, 712), (788, 448), (822, 468), (540, 736)],
    # fourche
    [(1318, 392), (1372, 386), (1424, 500), (1472, 640), (1500, 718), (1498, 748), (1466, 748), (1452, 702), (1394, 562)],
    # étrier avant
    [(1380, 632), (1436, 632), (1440, 720), (1380, 720)],
]
STATIC_CIRCLES = [(912, 792, 104)]  # plateau / pédalier


def main():
    im = Image.open(SRC).convert('RGBA')
    a = np.asarray(im).astype(np.float32) / 255.0
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    H, W = al.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-5), 0)
    # teinte en degrés
    hue = np.zeros_like(mx)
    d = np.maximum(mx - mn, 1e-5)
    hr = (mx == r)
    hg = (mx == g) & ~hr
    hb = ~hr & ~hg
    hue[hr] = (60 * ((g - b) / d) % 360)[hr]
    hue[hg] = (60 * ((b - r) / d) + 120)[hg]
    hue[hb] = (60 * ((r - g) / d) + 240)[hb]

    in_disk = np.zeros((H, W), bool)
    for cx, cy, ax, by in WHEELS:
        in_disk |= np.hypot((xx - cx) / ax, (yy - cy) / by) < DISK
    # étiquettes rouges « COTTON » des pneus : ni peinture, ni pièce fixe
    tire_band = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in [(465, 394, 585, 418), (1425, 398, 1545, 422)]:
        tire_band |= (xx >= x0) & (xx <= x1) & (yy >= y0) & (yy <= y1)

    red = ((hue > 335) | (hue < 12)) & (sat > 0.45) & (mx > 0.14) & (al > 0.5)
    red &= ~tire_band
    # ouverture morphologique : supprime les petits pixels rougeâtres isolés (transition flanc/bande de roulement)
    red = np.asarray(Image.fromarray((red * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))) > 127
    # reflets spéculaires rosés collés à la peinture (douille, couronne, tube horizontal)
    near = np.asarray(Image.fromarray((red * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11))) > 127
    glint = ((hue > 315) | (hue < 14)) & (sat > 0.1) & (al > 0.5) & near & ~tire_band
    paint = red | glint

    # ---- masque fixe
    static_img = Image.fromarray((red * 255).astype(np.uint8))
    static_img = static_img.filter(ImageFilter.MaxFilter(13))  # englobe décors blancs et bords
    dr = ImageDraw.Draw(static_img)
    for poly in STATIC_POLYS:
        dr.polygon(poly, fill=255)
    for cx, cy, rr in STATIC_CIRCLES:
        dr.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=255)
    static = np.asarray(static_img) > 127
    # moyeux : petit cercle fixe au centre (axe traversant, pattes)
    for cx, cy, ax, by in WHEELS:
        static |= np.hypot(xx - cx, yy - cy) < 26
    static |= ~in_disk
    static_img = Image.fromarray((static * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))

    # ---- masque peinture (adouci)
    paint_img = Image.fromarray((paint * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))

    disk_img = Image.fromarray((in_disk * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))

    out = Image.merge('RGB', (static_img, paint_img, disk_img))
    out.save(OUT, optimize=True)
    print('écrit', OUT, out.size)


if __name__ == '__main__':
    main()
