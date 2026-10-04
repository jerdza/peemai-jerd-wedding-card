# peemai-jerd-wedding-card

E-Wedding Card + RSVP สำหรับงานแต่ง ปีใหม่ & เจิด

## โครงโฟลเดอร์

```
index.html          # การ์ดที่เผยแพร่ (GitHub Pages)
rsvp.html           # RSVP ที่เผยแพร่ (LIFF)
card/               # ชุดเวอร์ชันการ์ด (index-vX.XX.html)
rsvp/               # ชุดเวอร์ชัน RSVP (rsvp-vX.XX.html)
assets/             # สื่อที่ใช้จริง
archive/            # ไฟล์เก่า / ไม่ใช้
scripts/            # เครื่องมือ publish
```

## Publish ชุดเวอร์ชัน

```bash
node scripts/publish-version.js card v1.10
node scripts/publish-version.js rsvp v1.04
```
