def compare_lines(lines1: list[str], lines2: list[str]) -> list[dict]:
    """
    Сравнивает два списка строк построчно.
    Возвращает список словарей с найденными различиями.
    """
    result = []
    max_length = max(len(lines1), len(lines2))

    for i in range(max_length):
        # Если в одном из файлов строк меньше, пишем заглушку
        line1 = lines1[i].strip() if i < len(lines1) else "[Строка отсутствует]"
        line2 = lines2[i].strip() if i < len(lines2) else "[Строка отсутствует]"

        if line1 != line2:
            result.append({
                "line_number": i + 1,
                "file1": line1,
                "file2": line2
            })
            
    return result