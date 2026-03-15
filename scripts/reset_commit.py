import subprocess
import os

# Change to project directory
os.chdir('/vercel/share/v0-project')

# Reset to commit 2232006
result = subprocess.run(['git', 'reset', '--hard', '2232006'], capture_output=True, text=True)

print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("Return code:", result.returncode)
