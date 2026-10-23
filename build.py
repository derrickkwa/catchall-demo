#!/usr/bin/env python3
"""Bundle src/ into one self-contained page: dist/index.html (no build tools, no dependencies).
The hosted page gets no <html>/<head>/<body> of its own (the host adds them); dist/local.html wraps it for opening locally."""
import glob, os, re
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()

base = rd("src/ds-base.css")
# Mirror every [data-theme="dark"] block as a prefers-color-scheme block, so "system" viewers get dark too.
dark = re.findall(r':root\[data-theme="dark"\]\{([^}]*)\}', base)
auto = "@media (prefers-color-scheme: dark){:root:not([data-theme=\"light\"]){%s;color-scheme:dark}}\n:root[data-theme=\"dark\"]{color-scheme:dark}\n" % ";".join(d.strip().rstrip(";") for d in dark)
css = base + "\n" + auto + rd("src/demo.css") + "".join(rd(p[len(R)+1:]) for p in sorted(glob.glob(os.path.join(R, "src/views/*.css"))))

js_files = ["src/data.js"] + sorted(p[len(R)+1:] for p in glob.glob(os.path.join(R, "src/data-*.js"))) + ["src/ui.js", "src/app.js"] + sorted(p[len(R)+1:] for p in glob.glob(os.path.join(R, "src/views/*.js")))
js = "\n".join(f"/* {f} */\n" + rd(f) for f in js_files) + "\nCA.start();\n"

page = f"""<title>CatchAll Demo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=JetBrains+Mono:wght@400;500;600&display=swap">
<style>
{css}
</style>
{rd("src/icons.svg.html")}
<div id="app"></div>
<script>
{js}
</script>
"""
os.makedirs(os.path.join(R, "dist"), exist_ok=True)
open(os.path.join(R, "dist/index.html"), "w", encoding="utf-8").write(page)
open(os.path.join(R, "dist/local.html"), "w", encoding="utf-8").write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>\n' + page + "</body></html>\n")
print("built dist/index.html", len(page), "bytes;", len(js_files), "js files")
