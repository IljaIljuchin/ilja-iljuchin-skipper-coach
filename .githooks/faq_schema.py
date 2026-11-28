"""Regenerate the FAQPage JSON-LD block of a page from its visible FAQ.

Usage: python3 .githooks/faq_schema.py page.html [page.html ...]
Pages without both a <div class="faq-list"> and a FAQPage block are skipped.
Called by .githooks/pre-commit for every staged HTML page.
"""
import html
import json
import re
import sys

LD = re.compile(r'<script type="application/ld\+json">\n(.*?)\n</script>', re.S)
QA = re.compile(r'<summary>(.*?)</summary>\s*<p>(.*?)</p>', re.S)


def plain(fragment):
    return html.unescape(re.sub(r'<[^>]+>', '', fragment)).strip()


def update(path):
    src = open(path, encoding='utf-8').read()
    if 'class="faq-list"' not in src:
        return False
    head, sep, body = src.partition('</head>')
    pairs = [(plain(q), plain(a)) for q, a in QA.findall(body)]
    for m in LD.finditer(head):
        data = json.loads(m.group(1))
        if data.get('@type') != 'FAQPage':
            continue
        data['mainEntity'] = [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in pairs
        ]
        new = head[:m.start(1)] + json.dumps(data, indent=2, ensure_ascii=False) + head[m.end(1):]
        if new != head:
            open(path, 'w', encoding='utf-8').write(new + sep + body)
            return True
        return False
    return False


if __name__ == '__main__':
    for page in sys.argv[1:]:
        if update(page):
            print(f'faq_schema: updated {page}')
