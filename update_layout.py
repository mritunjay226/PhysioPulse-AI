p = 'web_app/app/layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('h-full antialiased`', 'h-full antialiased dark`')
c = c.replace(
    'className="min-h-full flex flex-col font-sans bg-[#EFF2F6] text-slate-900 selection:bg-blue-600 selection:text-white"',
    'className="min-h-full flex flex-col font-sans bg-[#09090b] text-zinc-100 selection:bg-teal-500 selection:text-black"'
)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Successfully updated layout.tsx!')
