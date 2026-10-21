import os
import re

components_dir = "src/components"
for filename in os.listdir(components_dir):
    if filename.startswith("Raga") and filename.endswith(".tsx"):
        filepath = os.path.join(components_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Regex to find Play/Pause buttons that are NOT Aaroh/Avaroh
        # This is very simplified, it might not work perfectly.
        # Maybe I should just list them and process them manually.
        
        # Actually, let's just do it manually for a few important ones.
        pass
