import os

# 1. Fix globals.css
with open('web_app/app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()
css = css.replace('--canvas-bg: #EFF2F6;', '--canvas-bg: #09090b;')
with open('web_app/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Fixed globals.css')

# 2. Fix app/session/page.tsx
with open('web_app/app/session/page.tsx', 'r', encoding='utf-8') as f:
    page = f.read()

page = page.replace(
    'className="min-h-screen w-full bg-[#EFF2F6] text-slate-900 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-600 selection:text-white"',
    'className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-teal-500 selection:text-black"'
)
page = page.replace(
    'className="relative w-full max-w-[1580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 theme-window overflow-hidden flex flex-col"',
    'className="relative w-full max-w-[1580px] bg-[#121215] rounded-3xl shadow-2xl border border-zinc-800/90 overflow-hidden flex flex-col"'
)
page = page.replace(
    'className="bg-[#EFF2F6] bg-clinical-grid min-h-[calc(100vh-140px)] p-4 sm:p-6 lg:p-8"',
    'className="bg-[#09090b] bg-clinical-grid min-h-[calc(100vh-140px)] p-4 sm:p-6 lg:p-8"'
)
# Any residual replacements in session/page.tsx
page = page.replace('#EFF2F6', '#09090b')
page = page.replace('text-slate-900', 'text-zinc-100')
page = page.replace('selection:bg-blue-600', 'selection:bg-teal-500')

with open('web_app/app/session/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page)
print('Fixed app/session/page.tsx')

# 3. Fix SessionWorkflowStepper.tsx
with open('web_app/components/session/SessionWorkflowStepper.tsx', 'r', encoding='utf-8') as f:
    stepper = f.read()
stepper = stepper.replace('text-slate-900', 'text-zinc-100')
with open('web_app/components/session/SessionWorkflowStepper.tsx', 'w', encoding='utf-8') as f:
    f.write(stepper)
print('Fixed SessionWorkflowStepper.tsx')
