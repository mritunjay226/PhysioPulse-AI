import os

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    content = content.replace('bg-white', 'bg-[#121215]')
    content = content.replace('bg-slate-50/70', 'bg-[#09090b]')
    content = content.replace('bg-slate-50', 'bg-[#09090b]')
    content = content.replace('bg-slate-100/80', 'bg-zinc-900')
    content = content.replace('bg-slate-100', 'bg-zinc-900')
    content = content.replace('bg-slate-200', 'bg-zinc-800')
    content = content.replace('border-slate-200/90', 'border-zinc-800/80')
    content = content.replace('border-slate-200/80', 'border-zinc-800/80')
    content = content.replace('border-slate-200', 'border-zinc-800')
    content = content.replace('border-slate-100', 'border-zinc-800/60')
    content = content.replace('border-slate-300', 'border-zinc-700')
    content = content.replace('hover:bg-slate-100/80', 'hover:bg-zinc-800')
    content = content.replace('hover:bg-slate-100', 'hover:bg-zinc-800')
    content = content.replace('hover:bg-slate-200', 'hover:bg-zinc-800')
    content = content.replace('hover:bg-slate-50', 'hover:bg-zinc-900')
    content = content.replace('text-slate-900', 'text-zinc-100')
    content = content.replace('text-slate-800', 'text-zinc-200')
    content = content.replace('text-slate-700', 'text-zinc-300')
    content = content.replace('text-slate-600', 'text-zinc-400')
    content = content.replace('text-slate-500', 'text-zinc-400')
    content = content.replace('text-slate-400', 'text-zinc-500')
    
    # Blue to Teal
    content = content.replace('bg-blue-600 hover:bg-blue-700 text-white', 'bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-bold')
    content = content.replace('bg-blue-600', 'bg-teal-400 text-black')
    content = content.replace('text-blue-600', 'text-teal-400')
    content = content.replace('text-blue-700', 'text-teal-300')
    content = content.replace('bg-blue-50/70', 'bg-teal-500/10')
    content = content.replace('bg-blue-50/50', 'bg-teal-500/10')
    content = content.replace('bg-blue-50', 'bg-teal-500/10')
    content = content.replace('border-blue-200', 'border-teal-500/30')
    content = content.replace('border-blue-300', 'border-teal-500/40')
    content = content.replace('border-blue-400', 'border-teal-400')
    content = content.replace('border-blue-500', 'border-teal-500')
    content = content.replace('focus:border-blue-600', 'focus:border-teal-500')
    content = content.replace('focus:border-blue-500', 'focus:border-teal-500')
    content = content.replace('focus:ring-blue-100', 'focus:ring-teal-500/20')
    content = content.replace('focus:ring-blue-500/20', 'focus:ring-teal-500/20')
    content = content.replace('focus:bg-white', 'focus:bg-[#09090b]')
    content = content.replace('accent-blue-600', 'accent-teal-400')
    content = content.replace('shadow-blue-500/20', 'shadow-teal-500/20')
    content = content.replace('hover:border-blue-300', 'hover:border-teal-500/40')
    content = content.replace('hover:border-blue-400', 'hover:border-teal-400')
    content = content.replace('group-hover:text-blue-600', 'group-hover:text-teal-300')
    content = content.replace('ring-blue-500/30', 'ring-teal-500/30')
    content = content.replace('shadow-healix-window', 'shadow-2xl')
    content = content.replace('shadow-healix', 'shadow-2xl')
    content = content.replace('shadow-xs', 'shadow-sm')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {filepath}")

base = os.path.abspath('web_app')
for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx') and ('session' in root or 'components' in root or 'app' in root):
            clean_file(os.path.join(root, file))
