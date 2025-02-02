#!/usr/bin/env python3
import os

# Folders that are always skipped
SKIP_FOLDERS = {'node_modules', '.git'}

# Define which file extensions are considered "relevant" for understanding the project.
# Adjust this set as needed.
RELEVANT_EXTENSIONS = {'.py', '.js', '.json', '.env', '.md', '.txt', '.html', '.css', '.sh'}

def should_skip_path(rel_path):
    """Return True if any part of the path is in SKIP_FOLDERS."""
    return any(part in SKIP_FOLDERS for part in rel_path.split(os.sep))

def is_relevant_file(filepath):
    """
    Check if a file has a relevant extension.
    Returns True if the file extension is in the RELEVANT_EXTENSIONS set.
    """
    _, ext = os.path.splitext(filepath)
    return ext.lower() in RELEVANT_EXTENSIONS

def scan_files(root_dir, output_file):
    """
    Recursively scans root_dir (using relative paths) and collects:
      - A sorted list of folder paths.
      - A sorted list of file paths for files with relevant extensions.
    Writes to output_file:
      * The list of folder paths.
      * For each relevant file, a header, its full content, and a footer.
    """
    folders = set()
    files = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remove directories we want to skip from traversal.
        dirnames[:] = [d for d in dirnames if d not in SKIP_FOLDERS]
        relative_dir = os.path.relpath(dirpath, root_dir)
        if relative_dir == '.' or not should_skip_path(relative_dir):
            folders.add(relative_dir)
        for filename in filenames:
            relative_file = os.path.join(relative_dir, filename)
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