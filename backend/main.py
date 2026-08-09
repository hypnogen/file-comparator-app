import os
import io
import difflib
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table

app = FastAPI()

# 1. Настройка CORS для работы с Vite/React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {
    '.txt', '.docx', '.md', '.markdown',
    '.json', '.csv', '.xml', '.yaml', '.yml',
    '.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.css'
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_file(file: UploadFile):
    ext = os.path.splitext(file.filename or "")[1].lower()
    
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Формат файла '{file.filename}' не поддерживается.")
    
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"Файл '{file.filename}' слишком большой. Максимальный размер: 10 МБ")

def read_file_content(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or "")[1].lower()
    content_bytes = file.file.read()

    # Безопасное чтение .docx с учетом таблиц и сохранения порядка
    if ext == '.docx':
        try:
            doc = Document(io.BytesIO(content_bytes))
            lines = []

            # Перебираем элементы документа в порядке их естественного следования
            for child in doc.element.body:
                if child.tag.endswith('p'):  # Обычный абзац (Paragraph)
                    p = Paragraph(child, doc)
                    if p.text:
                        lines.append(p.text)
                elif child.tag.endswith('tbl'):  # Таблица (Table)
                    table = Table(child, doc)
                    for row in table.rows:
                        # Объединяем ячейки строки через табуляцию, убираем лишние переводы строк внутри ячеек
                        row_text = "\t".join(
                            cell.text.replace("\r\n", " ").replace("\n", " ").strip() 
                            for cell in row.cells
                        )
                        if row_text.strip():
                            lines.append(row_text)

            return '\n'.join(lines)
        except Exception:
            raise ValueError(
                f"Не удалось прочитать документ '{file.filename}'. Возможно, файл поврежден или зашифрован."
            )
    # Чтение обычных текстовых файлов
    encodings = ['utf-8-sig', 'utf-8', 'cp1251', 'latin-1']
    for enc in encodings:
        try:
            return content_bytes.decode(enc)
        except UnicodeDecodeError:
            continue
        
    raise ValueError(f"Не удалось определить кодировку файла '{file.filename}'")

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

        stats = {
            "additions": 0,
            "deletions": 0,
            "modifications": 0
        }

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
                len1 = i2 - i1
                len2 = j2 - j1
                common_len = min(len1, len2)

                # Замененные (измененные) строки
                for k in range(common_len):
                    differences.append({
                        "line_number": line_num,
                        "file1": lines1[i1 + k],
                        "file2": lines2[j1 + k],
                        "type": "Modified"
                    })
                    line_num += 1
                    stats["modifications"] += 1

                # Оставшиеся удаленные строки (если файл 1 длиннее)
                for k in range(common_len, len1):
                    differences.append({
                        "line_number": line_num,
                        "file1": lines1[i1 + k],
                        "file2": None,
                        "type": "Removed"
                    })
                    line_num += 1
                    stats["deletions"] += 1

                # Оставшиеся добавленные строки (если файл 2 длиннее)
                for k in range(common_len, len2):
                    differences.append({
                        "line_number": line_num,
                        "file1": None,
                        "file2": lines2[j1 + k],
                        "type": "Added"
                    })
                    line_num += 1
                    stats["additions"] += 1

            elif tag == 'delete':
                for l1 in lines1[i1:i2]:
                    differences.append({
                        "line_number": line_num,
                        "file1": l1,
                        "file2": None,
                        "type": "Removed"
                    })
                    line_num += 1
                    stats["deletions"] += 1

            elif tag == 'insert':
                for l2 in lines2[j1:j2]:
                    differences.append({
                        "line_number": line_num,
                        "file1": None,
                        "file2": l2,
                        "type": "Added"
                    })
                    line_num += 1
                    stats["additions"] += 1

        return {
            "status": "success",
            "file1_name": file1.filename,
            "file2_name": file2.filename,
            "stats": stats,
            "differences": differences
        }

    except ValueError as err:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(err)}
        )
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Произошла внутренняя ошибка сервера при сравнении файлов."}
        )