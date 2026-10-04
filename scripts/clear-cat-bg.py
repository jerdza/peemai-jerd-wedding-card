"""Remove cream backgrounds from cat PNGs via edge flood-fill."""
from pathlib import Path
from collections import deque
from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "assets" / "Cats"
DST = SRC / "clear"
DST.mkdir(exist_ok=True)

USED = [
    "cats-48-07-loaf.png",
    "cats-48-09-sleepy.png",
    "cats-48-35-profile-sit.png",
    "cats-48-21-tail-up.png",
    "cats-48-03-look-left.png",
    "cats-48-02-look-right.png",
    "cats-48-48-nose-touch.png",
    "cats-48-34-look-up.png",
    "cats-48-12-curl-sleep.png",
    "cats-48-08-yawn.png",
    "cats-48-45-sit-and-loaf.png",
    "cats-48-17-walk-right.png",
    "cats-48-22-look-back.png",
    "cats-48-32-paw-up.png",
    "cats-48-33-reach-up.png",
    "cats-48-23-crouch.png",
    "cats-48-25-hop.png",
    "cats-48-18-walk-left.png",
    "cats-48-37-hug.png",
    "cats-48-43-close-sit.png",
    "cats-48-42-tails-together.png",
]

BG = (255, 251, 242)
TOL = 30
SOFT = 18


def dist(c):
    return max(abs(c[0] - BG[0]), abs(c[1] - BG[1]), abs(c[2] - BG[2]))


def clear_bg(src: Path, dst: Path):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()
    mark = bytearray(w * h)

    def idx(x, y):
        return y * w + x

    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if dist(px[x, y]) <= TOL:
                mark[idx(x, y)] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if dist(px[x, y]) <= TOL and mark[idx(x, y)] == 0:
                mark[idx(x, y)] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and mark[idx(nx, ny)] == 0:
                if dist(px[nx, ny]) <= TOL:
                    mark[idx(nx, ny)] = 1
                    q.append((nx, ny))

    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if mark[idx(x, y)] == 1:
                r, g, b, _ = opx[x, y]
                opx[x, y] = (r, g, b, 0)

    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if mark[idx(x, y)] == 1:
                continue
            near_bg = any(
                mark[idx(nx, ny)] == 1
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
            )
            if near_bg:
                r, g, b, a = opx[x, y]
                d = dist((r, g, b, a))
                if d <= TOL + SOFT:
                    fade = max(0, min(255, int(255 * (d - TOL) / SOFT)))
                    opx[x, y] = (r, g, b, fade)

    out.save(dst, "PNG", optimize=True)


def main():
    for name in USED:
        src = SRC / name
        dst = DST / name
        clear_bg(src, dst)
        print("ok", name)
    print("done", len(USED))


if __name__ == "__main__":
    main()
