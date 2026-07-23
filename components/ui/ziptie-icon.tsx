import fs from "fs";
import path from "path";

export function ZipTieIcon({ className }: { className?: string }) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "public/images/ziptie-icon.svg"),
    "utf-8"
  );
  const svg = raw
    .replace(
      'width="1902" height="1902"',
      `class="${className ?? ""}" style="display:block"`
    )
    .replace('viewBox="0 0 1902 1902"', 'viewBox="90 808 1820 280"');
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
