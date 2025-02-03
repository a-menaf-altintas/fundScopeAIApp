#!/usr/bin/env python3
import os

# Folders that should always be skipped (e.g., libraries, dependencies, build artifacts, and test folders)
SKIP_FOLDERS = {'node_modules', '.git', 'dist', 'build', '__pycache__', 'coverage', 'test'}

# Define relevant extensions for both backend (Node.js) and frontend (React)
RELEVANT_EXTENSIONS = {'.py', '.js', '.jsx', '.ts', '.tsx', '.json', '.env', '.md', '.txt', '.html', '.css', '.sh'}

# Explicitly exclude patterns (e.g., minified files, compiled files, lock files, and dependency-related files)
EXCLUDED_PATTERNS = {'min.js', 'bundle.js', 'compiled.js', '.lock', 'package.json', 'package-lock.json', 'yarn.lock'}

# Allow scanning in both 'backend' and 'frontend' folders
ALLOWED_DIRECTORIES = {'backend', 'frontend'}

def should_skip_path(rel_path):
    """Return True if any part of the path is in SKIP_FOLDERS or if path doesn't intersect ALLOWED_DIRECTORIES."""
    path_parts = set(rel_path.split(os.sep))
    # Skip if any folder is in SKIP_FOLDERS (e.g., node_modules, build, etc.)
    if any(part in SKIP_FOLDERS for part in path_parts):
        return True
    # Also skip if none of the path parts are in ALLOWED_DIRECTORIES
    return not any(part in ALLOWED_DIRECTORIES for part in path_parts)

def is_relevant_file(filepath):
    """
    Check if a file has a relevant extension and is not explicitly excluded.
    Returns True if the file extension is in the RELEVANT_EXTENSIONS set and
    does not match any of the EXCLUDED_PATTERNS.
    """
    filename = os.path.basename(filepath)
    _, ext = os.path.splitext(filename)
    # Must have a relevant extension and must not match an excluded pattern
    if ext.lower() not in RELEVANT_EXTENSIONS:
        return False
    return not any(filename.endswith(pattern) for pattern in EXCLUDED_PATTERNS)

def scan_files(root_dir, output_file):
    """
    Recursively scans root_dir, collecting:
      - A sorted list of folder paths.
      - A sorted list of file paths (relevant extensions, not excluded).
    Writes to output_file:
      - The list of folder paths.
      - For each relevant file, a header, its full content, and a footer.
    """
    folders = set()
    files = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filter out directories we want to skip from the traversal
        dirnames[:] = [d for d in dirnames if not should_skip_path(os.path.join(dirpath, d))]

        relative_dir = os.path.relpath(dirpath, root_dir)

        # If this directory is not '.' (the root) or not to be skipped, add it to folder set
        if relative_dir == '.' or not should_skip_path(relative_dir):
            folders.add(relative_dir)

        for filename in filenames:
            relative_file = os.path.join(relative_dir, filename)
            # Check skipping logic and file relevance
            if not should_skip_path(relative_file) and is_relevant_file(relative_file):
                files.append(relative_file)

    sorted_folders = sorted(folders)
    sorted_files = sorted(files)

    with open(output_file, 'w', encoding='utf-8') as f_out:
        f_out.write("Folders:\n")
        for folder in sorted_folders:
            f_out.write(folder + "\n")
        f_out.write("\nFiles:\n")
        for file in sorted_files:
            f_out.write(f"=== File: {file} ===\n")
            file_path = os.path.join(root_dir, file)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f_in:
                    content = f_in.read()
                f_out.write(content + "\n")
            except Exception as e:
                f_out.write(f"[Error reading file: {e}]\n")
            f_out.write(f"=== End of file: {file} ===\n\n")

if __name__ == "__main__":
    root_directory = os.getcwd()  # Use current directory as root
    output_filename = "listOfFiles.txt"
    scan_files(root_directory, output_filename)
    print(f"Scanning complete! Output written to '{output_filename}'.")
