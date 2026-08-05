import chardet
from docx import Document
import io

def read_file_content(file_bytes: bytes, filename: str) -> list[str]:
    """Принимает байты файла и его имя. 
    Возвращает список строк текста."""

    if filename.endswith('.docx'):
        doc = Document(io.BytesIO(file_bytes))
        
        return [p.text + '\n' for p in doc.paragraphs if p.text.strip()]
    
    detector = chardet.detect(file_bytes[:50000])
    encoding = detector['encoding'] or 'utf-8'
    
    text = file_bytes.decode(encoding, errors='ignore')
    
    return text.splitlines(keepends=True)