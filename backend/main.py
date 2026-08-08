import os
import difflib
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document
import io

app = FastAPI()

ALLOWED_EXTENSIONS = {
    '.txt', '.docx', '.md', '.markdown',
    '.json', '.csv', '.xml', '.yaml', '.yml',
    '.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.css'
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_file(file: UploadFile):
    ext = os.path.splitext(file.filename)[1].lower()
    
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Формат файла '{file.filename}' не поддерживается.")
    
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"Файл '{file.filename}' слишком большой. Максимальный размер: 10 МБ")

def read_file_content(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1].lower()
    content_bytes = file.file.read()

    if ext == '.docx':
        doc = Document(io.BytesIO(content_bytes))
        return '\n'.join([p.text for p in doc.paragraphs])

    encodings = ['utf-8-sig', 'utf-8', 'cp1251', 'latin-1']
    for enc in encodings:
        try:
            return content_bytes.decode(enc)
        except UnicodeDecodeError:
            continue

    raise ValueError(f"Не удалось прочитать кодировку файла '{file.filename}'")

@app.post("/api/compare")
async def compare_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        validate_file(file1)
        validate_file(file2)

        text1 = read_file_content(file1)
        text2 = read_file_content(file2)

        lines1 = text1.splitlines()
        lines2 = text2.splitlines()

        matcher = difflib.SequenceMatcher(None, lines1, lines2)
        differences = []
        line_num = 1

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'equal':
                for l1, l2 in zip(lines1[i1:i2], lines2[j1:j2]):
                    differences.append({
                        "line_number": line_num,
                        "file1": l1,
                        "file2": l2,
                        "type": "Unchanged"
                    })
                    line_num += 1
            elif tag == 'replace':
                # Замена блока строк
                len1 = i2 - i1
                len2 = j2 - j1
                max_len = max(len1, len2)
                for k in range(max_len):
                    val1 = lines1[i1 + k] if k < len1 else None
                    val2 = lines2[j1 + k] if k < len2 else None
                    differences.append({
                        "line_number": line_num,
                        "file1": val1,
                        "file2": val2,
                        "type": "Modified"
                    })
                    line_num += 1
            elif tag == 'delete':
                for l1 in lines1[i1:i2]:
                    differences.append({
                        "line_number": line_num,
                        "file1": l1,
                        "file2": None,
                        "type": "Removed"
                    })
                    line_num += 1
            elif tag == 'insert':
                for l2 in lines2[j1:j2]:
                    differences.append({
                        "line_number": line_num,
                        "file1": None,
                        "file2": l2,
                        "type": "Added"
                    })
                    line_num += 1

        return {
            "status": "success",
            "differences": differences
        }

    except ValueError as err:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(err)}
        )
    except Exception as err:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Произошла ошибка при обработке файлов"}
        )