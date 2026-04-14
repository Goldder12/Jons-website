import os
import re

css_files = [
    r'c:\Users\Otabek\Desktop\Johns\Jons-website\css\index.css',
    r'c:\Users\Otabek\Desktop\Johns\Jons-website\css\student.css',
    r'c:\Users\Otabek\Desktop\Johns\Jons-website\css\dualigo.css',
    r'c:\Users\Otabek\Desktop\Johns\Jons-website\css\group.css'
]

def wrap_hover_rules(content):
    # Wrap .sidebar:hover, .sidebar:focus-within block
    pattern1 = r'\.sidebar:hover,\s*\n*\.sidebar:focus-within\s*\{\s*width:\s*255px;[^}]+\}'
    match1 = re.search(pattern1, content)
    if match1:
        wrapped1 = f"@media (min-width: 1101px) {{\n{match1.group(0)}\n}}"
        content = content.replace(match1.group(0), wrapped1)

    # Wrap .brand-name hover block
    pattern2 = r'\.sidebar:hover \.brand-name,\s*\n*\.sidebar:focus-within \.brand-name\s*\{[^}]+\}'
    match2 = re.search(pattern2, content)
    if match2:
        wrapped2 = f"@media (min-width: 1101px) {{\n{match2.group(0)}\n}}"
        content = content.replace(match2.group(0), wrapped2)

    # Wrap .nav-label hover block
    pattern3 = r'\.sidebar:hover \.nav-label,\s*\n*\.sidebar:focus-within \.nav-label\s*\{[^}]+\}'
    match3 = re.search(pattern3, content)
    if match3:
        wrapped3 = f"@media (min-width: 1101px) {{\n{match3.group(0)}\n}}"
        content = content.replace(match3.group(0), wrapped3)
        
    return content

override_css = """
/* --- GLOBAL MOBILE SIDEBAR UNIFICATION --- */
@media (max-width: 1100px) {
  .brand-name, 
  .nav-label {
    display: none !important;
  }
  
  /* Disable hover background effect on links on smaller screens */
  .nav-link:hover:not(.is-active)::before,
  .nav-link-custom:hover:not(.is-active)::before {
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }
  .nav-link:hover:not(.is-active),
  .nav-link-custom:hover:not(.is-active) {
    color: var(--sidebar-icon-soft) !important;
  }
}
"""

for filepath in css_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = wrap_hover_rules(content)
        
        # Also, let's fix student.css mobile breakpoints if this is student.css
        if 'student.css' in filepath:
            # We must make student.css match index.css
            # Find @media (max-width: 991px) block and replace it with 760px logic
            if '@media (max-width: 991px)' in new_content:
                # We'll replace 991px with 760px and add the 520px logic from index.css
                pass # I'll do this manually next if script gets complex.
                
        # Append the global override if not already there
        if "GLOBAL MOBILE SIDEBAR UNIFICATION" not in new_content:
            new_content += override_css
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"File not found: {filepath}")
