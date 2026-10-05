"""Split sit-front pair into dress-code orange/grey cats."""
from pathlib import Path
from collections import deque

import numpy as np
from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "assets" / "Cats" / "cats-48-01-sit-front.png"
OUT = Path(__file__).resolve().parents[1] / "assets" / "Cats" / "clear"


def clear_bg(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    bg = (np.maximum(np.maximum(np.abs(r - 255), np.abs(g - 251)), np.abs(b - 242)) <= 36) | (
        (r >= 185) & (g >= 170) & (b >= 155) & (chroma <= 52) & ((r - b) <= 55) & ((r - g) <= 35)
    )
    cream = (r >= 190) & (g >= 130) & (g <= 215) & (b <= 185) & (chroma >= 50)
    grey = (r <= 210) & (chroma <= 28) & (np.abs(r - g) <= 22) & (np.abs(g - b) <= 22) & (r < 230)
    dark = (r + g + b) < 220
    clear = bg & ~(cream | grey | dark)
    mark = np.zeros((h, w), dtype=np.uint8)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if clear[y, x]:
                mark[y, x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if clear[y, x] and mark[y, x] == 0:
                mark[y, x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and mark[ny, nx] == 0 and clear[ny, nx]:
                mark[ny, nx] = 1
                q.append((nx, ny))
    visited = np.zeros((h, w), dtype=np.uint8)
    ys, xs = np.where(clear & (mark == 0))
    for x, y in zip(xs.tolist(), ys.tolist()):
        if visited[y, x]:
            continue
        qq = deque([(x, y)])
        visited[y, x] = 1
        while qq:
            cx, cy = qq.popleft()
            mark[cy, cx] = 1
            for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and clear[ny, nx]:
                    visited[ny, nx] = 1
                    qq.append((nx, ny))
    arr[mark == 1, 3] = 0
    return Image.fromarray(arr, "RGBA")


def pack(im: Image.Image, chubby: bool = False, target_h: int = 640) -> Image.Image:
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 10)
    if len(xs) == 0:
        raise RuntimeError("empty crop")
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    pad = 20
    cat = im.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(im.width, x1 + pad + 1),
            min(im.height, y1 + pad + 1),
        )
    )
    nh = target_h
    nw = max(1, int(round(cat.width * (nh / max(1, cat.height)))))
    if chubby:
        nw = max(1, int(round(nw * 1.12)))
    cat = cat.resize((nw, nh), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (720, target_h), (0, 0, 0, 0))
    out.paste(cat, ((720 - nw) // 2, 0), cat)
    return out


def main():
    OUT.mkdir(exist_ok=True)
    cleared = clear_bg(Image.open(SRC))
    # gap between cats so neither crop includes the other
    left_end = 500
    right_start = 545
    orange = pack(cleared.crop((0, 0, left_end, cleared.height)), chubby=False)
    grey = pack(cleared.crop((right_start, 0, cleared.width, cleared.height)), chubby=True)
    orange.save(OUT / "dress-cat-orange.png", "PNG", optimize=True)
    grey.save(OUT / "dress-cat-grey.png", "PNG", optimize=True)
    print("orange", orange.size, "grey", grey.size)


if __name__ == "__main__":
    main()
