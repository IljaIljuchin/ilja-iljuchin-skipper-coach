"""Prepare and publish the Czech version of the site under /cs/.

    python3 scripts/cs_scaffold.py scaffold          # create cs/*.html copies to translate
    python3 scripts/cs_scaffold.py publish coach     # publish one translated page

scaffold
    Copies each English page to cs/<page>.html (never overwrites an existing
    Czech file). The copy gets lang="cs", og:locale cs_CZ, /cs/ canonical and
    navigation, a Czech footer label and robots "noindex" so an untranslated
    page can never be indexed. Translate the visible text by hand afterwards.

publish <page>
    Run once a Czech page is translated. Removes its "noindex", adds
    hreflang links (en, cs, x-default) and og:locale:alternate to both the
    English and the Czech page, adds an EN/CS switch to both navigations and
    lists both versions in sitemap.xml with xhtml:link alternates.
"""
import os
import re
import sys

BASE = 'https://www.iljuchin.com'
PAGES = ['index', 'coach', 'skipper', 'about']          # Runs is parked
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def url(page, lang):
    path = '' if page == 'index' else page
    return f'{BASE}/cs/{path}' if lang == 'cs' else f'{BASE}/{path}'


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def scaffold():
    for page in PAGES:
        target = f'cs/{page}.html'
        if os.path.exists(os.path.join(ROOT, target)):
            print(f'skip {target} (exists)')
            continue
        s = read(f'{page}.html')
        s = s.replace('<html lang="en">', '<html lang="cs">', 1)
        s = s.replace('content="en_US"', 'content="cs_CZ"')
        en, cs = url(page, 'en'), url(page, 'cs')
        s = s.replace(f'<link rel="canonical" href="{en}">', f'<link rel="canonical" href="{cs}">')
        s = s.replace(f'<meta property="og:url" content="{en}">', f'<meta property="og:url" content="{cs}">')
        s = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex,follow">', s, count=1)
        # internal navigation and links stay inside the Czech version
        s = re.sub(r'href="/(coach|skipper|about)(#[^"]*)?"', lambda m: f'href="/cs/{m.group(1)}{m.group(2) or ""}"', s)
        s = s.replace('href="/"', 'href="/cs/"')
        s = s.replace('Last updated:', 'Aktualizováno:')
        s = s.replace('<head>', '<head>\n<!-- Czech version: translate the visible text, then run scripts/cs_scaffold.py publish '
                      f'{page} -->', 1)
        write(target, s)
        print(f'created {target}')


def add_alternates(s, page):
    if 'hreflang="cs"' in s:
        return s
    links = (f'<link rel="alternate" hreflang="en" href="{url(page, "en")}">\n'
             f'<link rel="alternate" hreflang="cs" href="{url(page, "cs")}">\n'
             f'<link rel="alternate" hreflang="x-default" href="{url(page, "en")}">')
    s = re.sub(r'(<link rel="canonical" href="[^"]*">)', lambda m: m.group(1) + '\n' + links, s, count=1)
    own = 'cs_CZ' if '<html lang="cs">' in s else 'en_US'
    other = 'en_US' if own == 'cs_CZ' else 'cs_CZ'
    return s.replace(f'<meta property="og:locale" content="{own}">',
                     f'<meta property="og:locale" content="{own}">\n<meta property="og:locale:alternate" content="{other}">', 1)


def add_switch(s, href, label, lang):
    if 'class="lang-switch"' in s:
        return s
    link = f'      <a class="lang-switch" href="{href}" lang="{lang}" hreflang="{lang}">{label}</a>\n    </nav>'
    return re.sub(r'\n    </nav>', '\n' + link, s, count=1)


def publish(page):
    cs_rel = f'cs/{page}.html'
    if not os.path.exists(os.path.join(ROOT, cs_rel)):
        sys.exit(f'{cs_rel} does not exist; run "scaffold" first')
    cs_path = '/cs/' if page == 'index' else f'/cs/{page}'
    en_path = '/' if page == 'index' else f'/{page}'

    cs = read(cs_rel)
    cs = re.sub(r'<meta name="robots" content="noindex,follow">',
                '<meta name="robots" content="index,follow,max-image-preview:large">', cs, count=1)
    cs = re.sub(r'\n<!-- Czech version: translate.*?-->', '', cs, count=1)
    write(cs_rel, add_switch(add_alternates(cs, page), en_path, 'EN', 'en'))

    en = read(f'{page}.html')
    write(f'{page}.html', add_switch(add_alternates(en, page), cs_path, 'CS', 'cs'))

    sm = read('sitemap.xml')
    if 'xmlns:xhtml' not in sm:
        sm = sm.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
                        'xmlns:xhtml="http://www.w3.org/1999/xhtml">', 1)
    alt = (f'    <xhtml:link rel="alternate" hreflang="en" href="{url(page, "en")}"/>\n'
           f'    <xhtml:link rel="alternate" hreflang="cs" href="{url(page, "cs")}"/>\n')
    en_loc = f'<loc>{url(page, "en")}</loc>\n'
    if en_loc in sm and alt not in sm:
        sm = sm.replace(en_loc, en_loc + alt, 1)
    cs_loc = f'<loc>{url(page, "cs")}</loc>'
    if cs_loc not in sm:
        block = f'  <url>\n    {cs_loc}\n{alt}    <lastmod>1970-01-01</lastmod>\n  </url>\n'
        sm = sm.replace('</urlset>', block + '</urlset>', 1)
    write('sitemap.xml', sm)
    print(f'published {cs_rel}; commit to stamp dates')


if __name__ == '__main__':
    if len(sys.argv) >= 2 and sys.argv[1] == 'scaffold':
        scaffold()
    elif len(sys.argv) == 3 and sys.argv[1] == 'publish' and sys.argv[2] in PAGES:
        publish(sys.argv[2])
    else:
        sys.exit(__doc__)
