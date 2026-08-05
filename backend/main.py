from fastapi import FastAPI, UploadFile, File
from services.file_reader import read_file_content
from services.comparator import compare_lines

app = FastAPI(title="File Comparator API")

@app.post("/api/compare")
async def compare_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        # Читаем содержимое файлов в байты
        content1 = await file1.read()
        content2 = await file2.read()
        
        # Переводим байты в списки строк
        lines1 = read_file_content(content1, file1.filename)
        lines2 = read_file_content(content2, file2.filename)
        
        # Находим различия
        differences = compare_lines(lines1, lines2)
        
        return {
            "status": "success",
            "filename1": file1.filename,
            "filename2": file2.filename,
            "differences": differences
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}