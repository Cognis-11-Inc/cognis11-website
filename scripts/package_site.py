"""Package the built static site for the Cloudflare dashboard, using stdlib only."""

from hashlib import sha256
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    output = root / "dist"
    if not (output / "index.html").is_file():
        raise SystemExit("Build the site first: npm run build")

    release = root / "release"
    release.mkdir(exist_ok=True)
    archive_path = release / "cognis11-cloudflare.zip"
    temporary = release / "cognis11-cloudflare.zip.tmp"
    try:
        with ZipFile(temporary, "w", ZIP_DEFLATED) as archive:
            for path in sorted(output.rglob("*")):
                if path.is_file():
                    archive.write(path, path.relative_to(output).as_posix())
        with ZipFile(temporary) as archive:
            if archive.testzip() is not None or "index.html" not in archive.namelist():
                raise SystemExit("Archive verification failed; existing release preserved.")
            count = len(archive.namelist())
        temporary.replace(archive_path)
    finally:
        temporary.unlink(missing_ok=True)

    print(f"Upload: {archive_path}")
    print(f"Verified: {count} files, {archive_path.stat().st_size} bytes")
    print(f"SHA-256: {sha256(archive_path.read_bytes()).hexdigest()}")
    print("No upload or deployment performed.")


if __name__ == "__main__":
    main()
