import re
import os

filepath = r'c:\Users\Otabek\Desktop\Johns\Jons-website\css\student.css'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

sticky_bottom_css = """
@media (max-width: 520px) {
  .main-wrapper {
    padding-bottom: 90px;
  }

  .sidebar {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    height: auto !important;
    border-radius: 24px 24px 0 0 !important;
    margin: 0 !important;
    padding: 10px 14px !important;
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1) !important;
    z-index: 1000;
  }
  
  body.dark-mode .sidebar {
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.4) !important;
  }
  
  .sidebar .brand {
    display: none !important;
  }
  
  .sidebar .nav-menu {
    width: 100%;
    justify-content: space-around !important;
    gap: 0 !important;
  }
  
  .sidebar .theme-toggle {
    display: none !important;
  }
  
  .nav-link-custom {
    padding: 0 !important;
    justify-content: center !important;
    width: 48px !important;
  }
}
"""

if "@media (max-width: 520px)" not in content:
    content += "\n" + sticky_bottom_css

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated student.css")
