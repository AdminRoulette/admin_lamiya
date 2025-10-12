async function epicenterParfumeNotes(NotesList, paramArray) {
    if(!NotesList){
        return false;
    }
    let upNote_ru = [];
    let middleNote_ru = [];
    let downNote_ru = [];
    let upNote = [];
    let middleNote = [];
    let downNote = [];
    for (const note of NotesList) {
        if (note.type === 'up') {
            upNote_ru.push(note.filter_note.name_ru)
            upNote.push(note.filter_note.name)
        }else if (note.type === 'middle') {
            middleNote_ru.push(note.filter_note.name_ru)
            middleNote.push(note.filter_note.name)
        }else  if (note.type === 'down') {
            downNote_ru.push(note.filter_note.name_ru)
            downNote.push(note.filter_note.name)
        }
    }
    paramArray.push({
        '#': downNote.toString(),
            '@paramcode': '12452',
            '@name': 'Базові ноти',
            '@lang': "ua",
    })
    paramArray.push({
        '#': middleNote.toString(),
            '@paramcode': '12451',
            '@name': "Ноти серця",
            '@lang': "ua",
    })
    paramArray.push({
        '#': upNote.toString(),
            '@paramcode': '2997',
            '@name': "Верхні ноти",
            '@lang': "ua",
    })

    paramArray.push({
        '#': downNote_ru.toString(),
            '@paramcode': '12452',
            '@name': "Базовые ноты",
            '@lang': "ru",

    })
    paramArray.push({
        '#': middleNote_ru.toString(),
            '@paramcode': '12451',
            '@name': "Ноты сердца",
            '@lang': "ru",

    })
    paramArray.push({
        '#': upNote_ru.toString(),
            '@paramcode': '2997',
            '@name': "Верхние ноты",
            '@lang': "ru",

    })
    return true;
}

module.exports = epicenterParfumeNotes;
