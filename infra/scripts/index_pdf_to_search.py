import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from pypdf import PdfReader


def request_json(method, url, api_key, body=None):
    data = None
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            content = response.read().decode("utf-8")
            return json.loads(content) if content else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {url} failed with {exc.code}: {detail}") from exc


def safe_key(value):
    raw = value.encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def chunk_text(text, max_chars):
    clean = re.sub(r"\s+", " ", text).strip()
    if not clean:
        return

    start = 0
    while start < len(clean):
        end = min(start + max_chars, len(clean))
        if end < len(clean):
            boundary = clean.rfind(" ", start, end)
            if boundary > start + max_chars // 2:
                end = boundary
        yield clean[start:end].strip()
        start = end


def build_index(service_endpoint, index_name, api_key, api_version):
    url = f"{service_endpoint}/indexes/{index_name}?api-version={api_version}"
    body = {
        "name": index_name,
        "fields": [
            {"name": "id", "type": "Edm.String", "key": True, "filterable": True},
            {"name": "title", "type": "Edm.String", "searchable": True, "filterable": True},
            {"name": "sourceFile", "type": "Edm.String", "searchable": True, "filterable": True},
            {"name": "page", "type": "Edm.Int32", "filterable": True, "sortable": True},
            {"name": "chunk", "type": "Edm.Int32", "filterable": True, "sortable": True},
            {"name": "content", "type": "Edm.String", "searchable": True},
        ],
    }
    request_json("PUT", url, api_key, body)


def upload_documents(service_endpoint, index_name, api_key, api_version, documents):
    url = f"{service_endpoint}/indexes/{index_name}/docs/index?api-version={api_version}"
    batch_size = 100
    for offset in range(0, len(documents), batch_size):
        batch = documents[offset : offset + batch_size]
        request_json("POST", url, api_key, {"value": batch})


def extract_documents(pdf_path, title, max_chars):
    reader = PdfReader(str(pdf_path))
    documents = []
    for page_index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        for chunk_index, chunk in enumerate(chunk_text(text, max_chars), start=1):
            doc_id = safe_key(f"{pdf_path.name}:{page_index}:{chunk_index}")
            documents.append(
                {
                    "@search.action": "upload",
                    "id": doc_id,
                    "title": title,
                    "sourceFile": pdf_path.name,
                    "page": page_index,
                    "chunk": chunk_index,
                    "content": chunk,
                }
            )
    return documents


def main():
    parser = argparse.ArgumentParser(description="Index a PDF into Azure AI Search.")
    parser.add_argument("--search-endpoint", required=True)
    parser.add_argument(
        "--api-key",
        default=os.environ.get("AZURE_SEARCH_API_KEY", ""),
        help="Azure AI Search admin key. Defaults to AZURE_SEARCH_API_KEY env var.",
    )
    parser.add_argument("--index-name", default="documents")
    parser.add_argument("--pdf", required=True)
    parser.add_argument("--title", default="Fort Worth FY2021-2025 Adopted CIP")
    parser.add_argument("--api-version", default="2024-07-01")
    parser.add_argument("--max-chars", type=int, default=3500)
    args = parser.parse_args()

    if not args.api_key:
        print("API key required. Pass --api-key or set AZURE_SEARCH_API_KEY.", file=sys.stderr)
        return 1

    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 1

    service_endpoint = args.search_endpoint.rstrip("/")
    documents = extract_documents(pdf_path, args.title, args.max_chars)
    if not documents:
        print("No text was extracted from the PDF.", file=sys.stderr)
        return 1

    build_index(service_endpoint, args.index_name, args.api_key, args.api_version)
    upload_documents(service_endpoint, args.index_name, args.api_key, args.api_version, documents)
    print(f"Indexed {len(documents)} chunks into '{args.index_name}'.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
