import urllib.request
import re

req = urllib.request.Request('http://localhost:3000/session', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print('--- HTML INSPECTION ---')
for tag in ['body', 'main']:
    matches = re.findall(rf'<{tag}[^>]*>', html)
    print(f'<{tag}> tags:', matches)

input_matches = re.findall(r'<input[^>]*class="([^"]*)"', html)
print('Input classes found:', len(input_matches))
for c in input_matches[:3]:
    print('  INPUT CLASS:', c)

chrome_matches = re.findall(r'class="([^"]*h-10[^"]*)"', html)
print('Chrome matches:', chrome_matches)

model_bg = re.findall(r'class="([^"]*min-h-\[460px\][^"]*)"', html)
print('Model box classes:', model_bg)

bg_clinical = html.count('bg-clinical-grid')
print('bg-clinical-grid count:', bg_clinical)

print('--- CHECKING globals.css LINKED ---')
css_files = re.findall(r'href="([^"]*\.css[^"]*)"', html)
print('CSS files linked:', css_files)
for css_url in css_files:
    if css_url.startswith('/'):
        full_url = f'http://localhost:3000{css_url}'
        try:
            css_content = urllib.request.urlopen(full_url).read().decode('utf-8')
            print(f'CSS {css_url} length: {len(css_content)}')
            print('  Contains #09090b in CSS:', '#09090b' in css_content)
            print('  Contains --canvas-bg in CSS:', '--canvas-bg' in css_content)
            # Find body rule in CSS
            body_rules = re.findall(r'body\s*\{[^}]*\}', css_content)
            print('  Body rules in CSS:', body_rules)
            grid_rules = re.findall(r'\.bg-clinical-grid\s*\{[^}]*\}', css_content)
            print('  .bg-clinical-grid in CSS:', grid_rules)
        except Exception as e:
            print(f'Error fetching {css_url}: {e}')
