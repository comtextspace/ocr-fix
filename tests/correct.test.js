import { correct, correctComtext } from '../src/correct.js'

describe('correct()', () => {
  test('пустая строка остаётся пустой', () => {
    expect(correct('')).toBe('')
  })

  test('однострочный абзац без изменений', () => {
    expect(correct('один абзац')).toBe('один абзац')
  })

  test('двустрочный абзац объединяется в одну строку', () => {
    const source = 'один абзац\nиз двух строк'
    const expected = 'один абзац из двух строк'
    expect(correct(source)).toBe(expected)
  })

  test('два абзаца разделены пустой строкой — структура сохраняется', () => {
    const source = 'первый абзац\nпродолжение первого\n\nвторой абзац\nпродолжение второго'
    const expected = 'первый абзац продолжение первого\n\nвторой абзац продолжение второго'
    expect(correct(source)).toBe(expected)
  })

  test('многострочный текст с несколькими абзацами', () => {
    const source =
      'ОТ РЕДАКТОРА РУССКОГО ПЕРЕВОДА\n' +
      '\n' +
      'Воспитание творческой активности учащихся в процессе изучения\n' +
      'ими математики является одной из актуальных целей нашего школь-\n' +
      'ного преподавания. Правильно поставленное упражнение учащихся\n' +
      'в решении задач — основное средство для достижения указанной цели.\n' +
      '\n' +
      'Если обратиться, однако, к учебно-методической литературе по\n' +
      'математике, будь то отечественной или иностранной, то приходится\n' +
      'констатировать, что при наличии большого количества в своем роде\n' +
      'весьма ценных работ, посвященных методам решения отдельных\n' +
      'типов математических задач (арифметических, конструктивно-геомет-\n' +
      'рических ит. д.), до сего времени фактически отсутствовали труды.\n' +
      '\n' +
      'Третий абзац\n'

    const expected =
      'ОТ РЕДАКТОРА РУССКОГО ПЕРЕВОДА\n' +
      '\n' +
      'Воспитание творческой активности учащихся в процессе изучения ими математики является одной из актуальных целей нашего школьного преподавания. Правильно поставленное упражнение учащихся в решении задач — основное средство для достижения указанной цели.\n' +
      '\n' +
      'Если обратиться, однако, к учебно-методической литературе по математике, будь то отечественной или иностранной, то приходится констатировать, что при наличии большого количества в своем роде весьма ценных работ, посвященных методам решения отдельных типов математических задач (арифметических, конструктивно-геометрических ит. д.), до сего времени фактически отсутствовали труды.\n' +
      '\n' +
      'Третий абзац\n'

    expect(correct(source)).toBe(expected)
  })

  test('строка заканчивающаяся на \\n не теряет последний перенос', () => {
    const source = 'строка\n'
    expect(correct(source)).toBe('строка\n')
  })

  test('только пустые строки (двойные переносы) не изменяются', () => {
    const source = '\n\n\n'
    expect(correct(source)).toBe('\n\n\n')
  })

  // --- перенос слова через дефис ---

  test('перенос слова на дефисе: дефис и перенос строки удаляются', () => {
    expect(correct('школь-\nного')).toBe('школьного')
    expect(correct('конструктивно-геомет-\nрических')).toBe('конструктивно-геометрических')
  })

  test('обычная строка без дефиса соединяется с пробелом', () => {
    expect(correct('первое\nвторое')).toBe('первое второе')
  })

  test('дефис в конце абзаца (перед пустой строкой) не склеивается', () => {
    // дефис перед \n\n — не перенос слова, структура абзацев сохраняется
    const source = 'заголовок-\n\nследующий абзац'
    const expected = 'заголовок-\n\nследующий абзац'
    expect(correct(source)).toBe(expected)
  })

  test('дефис в конце последней строки не трогается', () => {
    expect(correct('слово-\n')).toBe('слово-\n')
  })

  // --- нормализация пробельных символов ---

  test('табуляция заменяется на пробел', () => {
    expect(correct('слово\tслово')).toBe('слово слово')
    expect(correct('a\t\tb')).toBe('a b')
  })

  test('неразрывный пробел (\\u00A0) заменяется на обычный', () => {
    expect(correct('слово\u00A0слово')).toBe('слово слово')
    expect(correct('a\u00A0\u00A0b')).toBe('a b')
  })

  test('узкий неразрывный пробел (\\u202F) заменяется на обычный', () => {
    expect(correct('10\u202Fкг')).toBe('10 кг')
  })

  test('перевод строки сохраняется, остальной whitespace нормализуется', () => {
    expect(correct('строка\nследующая')).toBe('строка следующая')
    expect(correct('абзац\n\nследующий')).toBe('абзац\n\nследующий')
  })

  // --- дефис в роли тире ---

  test('двойной дефис с пробелами заменяется на тире', () => {
    expect(correct('слово -- слово')).toBe('слово — слово')
    expect(correct('-- начало строки')).toBe('— начало строки')
  })

  test('двойной дефис без пробелов не заменяется', () => {
    expect(correct('слово--слово')).toBe('слово--слово')
  })

  test('--- (разделитель md) и таблицы md не затрагиваются', () => {
    expect(correct('текс\n\n---\n\nтекст')).toBe('текс\n\n---\n\nтекст')
    expect(correct('---')).toBe('---')
    expect(correct('|---|---|')).toBe('|---|---|')
    expect(correct('|--:|:--:|')).toBe('|--:|:--:|')
  })

  test('одиночный дефис между пробелами заменяется на тире', () => {
    expect(correct('это - пример')).toBe('это — пример')
    expect(correct('утро - вечер')).toBe('утро — вечер')
  })

  test('дефис после запятой заменяется на тире', () => {
    expect(correct('да,- нет')).toBe('да, — нет')
    expect(correct('да, - нет')).toBe('да, — нет')
  })

  test('дефис после точки заменяется на тире', () => {
    expect(correct('конец.- начало')).toBe('конец. — начало')
    expect(correct('конец. - начало')).toBe('конец. — начало')
  })

  test('дефис после других знаков препинания заменяется на тире', () => {
    expect(correct('да!- конечно')).toBe('да! — конечно')
    expect(correct('правда?- нет')).toBe('правда? — нет')
    expect(correct('текст»- продолжение')).toBe('текст» — продолжение')
    expect(correct('(текст)- продолжение')).toBe('(текст) — продолжение')
  })

  test('дефис в составных словах не заменяется', () => {
    expect(correct('русско-английский')).toBe('русско-английский')
    expect(correct('северо-восток')).toBe('северо-восток')
  })

  test('уже стоящее тире не изменяется', () => {
    expect(correct('это — пример')).toBe('это — пример')
  })

  // --- XX и XIX: кириллица → латиница ---

  test('ХХ с кириллическими Х заменяется на XX', () => {
    expect(correct('ХХ век')).toBe('XX век')
    expect(correct('в ХХ веке')).toBe('в XX веке')
    expect(correct('(ХХ)')).toBe('(XX)')
  })

  test('ХIХ с кириллическими символами заменяется на XIX', () => {
    expect(correct('ХIХ')).toBe('XIX')
    expect(correct('глава ХIХ.')).toBe('глава XIX.')
  })

  test('уже латинские XX и XIX не трогаются', () => {
    expect(correct('XIX')).toBe('XIX')
    expect(correct('XX')).toBe('XX')
  })

  test('другие римские цифры не затрагиваются', () => {
    expect(correct('ХХI век')).toBe('ХХI век')
    expect(correct('ХVIII')).toBe('ХVIII')
    expect(correct('МСМ')).toBe('МСМ')
  })

  test('кириллические буквы внутри слов не затрагиваются', () => {
    expect(correct('СИЛА')).toBe('СИЛА')
    expect(correct('Христос')).toBe('Христос')
    expect(correct('МАССА')).toBe('МАССА')
  })

  test('одиночные кириллические буквы-аббревиатуры не заменяются', () => {
    expect(correct('общение. М., 1978.')).toBe('общение. М., 1978.')
    expect(correct('Буева Л. П. Человек: деятельность и общение. М., 1978.')).toBe(
      'Буева Л. П. Человек: деятельность и общение. М., 1978.'
    )
  })

  // --- аббревиатуры и инициалы ---

  test('инициалы без пробелов получают пробелы после точек', () => {
    expect(correct('В.И.Ленин')).toBe('В. И. Ленин')
    expect(correct('А.С.Пушкин')).toBe('А. С. Пушкин')
  })

  test('инициалы уже с пробелами не дублируют пробелы', () => {
    expect(correct('В. И. Ленин')).toBe('В. И. Ленин')
  })

  test('аббревиатура т.д. получает пробел', () => {
    expect(correct('и т.д. и т.п.')).toBe('и т. д. и т. п.')
  })

  test('том/страница: буква + точка + цифра', () => {
    expect(correct('т.1')).toBe('т. 1')
    expect(correct('стр.15')).toBe('стр. 15')
    expect(correct('рис.5')).toBe('рис. 5')
  })

  test('десятичные числа не затрагиваются', () => {
    expect(correct('3.14')).toBe('3.14')
    expect(correct('цена 1.5 руб')).toBe('цена 1.5 руб')
  })

  test('точка в конце предложения не затрагивается', () => {
    expect(correct('конец предложения.')).toBe('конец предложения.')
    expect(correct('конец.\nНовое')).toBe('конец. Новое')
  })

  // --- URL ---

  test('http url не изменяется', () => {
    expect(correct('см. http://example.com/path')).toBe('см. http://example.com/path')
  })

  test('https url не изменяется', () => {
    expect(correct('подробнее: https://my-site.com/page--two')).toBe('подробнее: https://my-site.com/page--two')
  })

  test('url с точками в домене не получает лишних пробелов', () => {
    expect(correct('https://www.example.com/file.html')).toBe('https://www.example.com/file.html')
  })

  test('url с параметрами не изменяется', () => {
    expect(correct('https://example.com/path?a=1&b=t.d')).toBe('https://example.com/path?a=1&b=t.d')
  })

  test('текст вокруг url корректируется, url нет', () => {
    expect(correct('В.И.Ленин https://example.com/В.И.Ленин')).toBe('В. И. Ленин https://example.com/В.И.Ленин')
  })

  // --- нормализация пробелов ---

  test('несколько пробелов подряд сжимаются в один', () => {
    expect(correct('слово  слово')).toBe('слово слово')
    expect(correct('a   b    c')).toBe('a b c')
  })

  test('одиночные пробелы не трогаются', () => {
    expect(correct('один два три')).toBe('один два три')
  })

  test('лишние пробелы убираются после объединения строк', () => {
    // OCR иногда оставляет пробел перед переносом строки
    const source = 'первое предложение  \nвторое предложение'
    const expected = 'первое предложение второе предложение'
    expect(correct(source)).toBe(expected)
  })
})

describe('correctComtext()', () => {
  test('frontmatter сохраняется нетронутым, тело корректируется', () => {
    const source =
      '---\n' +
      'format: dfdf\n' +
      'field:\n' +
      '- unu\n' +
      '- du\n' +
      '---\n' +
      'первая строка\n' +
      'вторая строка'
    const expected =
      '---\n' +
      'format: dfdf\n' +
      'field:\n' +
      '- unu\n' +
      '- du\n' +
      '---\n' +
      'первая строка вторая строка'
    expect(correctComtext(source)).toBe(expected)
  })

  test('дефисы и табы внутри frontmatter не изменяются', () => {
    const source =
      '---\n' +
      'title: слово - другое\n' +
      'tags: [а,\tб]\n' +
      '---\n' +
      'текст - пример'
    const expected =
      '---\n' +
      'title: слово - другое\n' +
      'tags: [а,\tб]\n' +
      '---\n' +
      'текст — пример'
    expect(correctComtext(source)).toBe(expected)
  })

  test('перенос слова в теле корректируется, в frontmatter нет', () => {
    const source =
      '---\n' +
      'title: школь-\nного\n' +
      '---\n' +
      'наш школь-\nного преподавания'
    const expected =
      '---\n' +
      'title: школь-\nного\n' +
      '---\n' +
      'наш школьного преподавания'
    expect(correctComtext(source)).toBe(expected)
  })

  test('текст без frontmatter обрабатывается как correct()', () => {
    const source = 'первая строка\nвторая строка'
    expect(correctComtext(source)).toBe(correct(source))
  })

  test('пустая строка остаётся пустой', () => {
    expect(correctComtext('')).toBe('')
  })

  test('--- не в начале файла не считается frontmatter', () => {
    const source = 'введение\n---\nfield: value\n---\nтекст'
    expect(correctComtext(source)).toBe(correct(source))
  })

  // --- переводы строк между frontmatter и телом ---

  test('один \n между frontmatter и телом сохраняется', () => {
    const source = '---\nfield: value\n---\nтекст'
    const result = correctComtext(source)
    expect(result).toBe('---\nfield: value\n---\nтекст')
  })

  test('два \n между frontmatter и телом сохраняются', () => {
    const source = '---\nfield: value\n---\n\nтекст'
    const result = correctComtext(source)
    expect(result).toBe('---\nfield: value\n---\n\nтекст')
  })

  test('frontmatter без тела не добавляет переводов строк', () => {
    const source = '---\nfield: value\n---'
    expect(correctComtext(source)).toBe('---\nfield: value\n---')
  })

  // --- защита блоков ---

  test('блок кода не изменяется, текст вокруг корректируется', () => {
    const source =
      'текст - пример\n\n' +
      '```js\n' +
      'var x = a - b\n' +
      'В.И.Ленин\n' +
      '```\n\n' +
      'ещё текст - пример'
    const result = correctComtext(source)
    expect(result).toContain('```js\nvar x = a - b\nВ.И.Ленин\n```')
    expect(result).toContain('текст — пример')
    expect(result).toContain('ещё текст — пример')
  })

  test('строчный код не изменяется', () => {
    const source = 'используй `var x = a - b` в коде'
    expect(correctComtext(source)).toBe('используй `var x = a - b` в коде')
  })

  test('блочная формула не изменяется', () => {
    const source =
      'формула:\n\n' +
      '$$\n' +
      'x - y = z\n' +
      '$$\n\n' +
      'текст - продолжение'
    const result = correctComtext(source)
    expect(result).toContain('$$\nx - y = z\n$$')
    expect(result).toContain('текст — продолжение')
  })

  test('строчная формула не изменяется', () => {
    const source = 'уравнение $x - y = z$ в тексте - пример'
    const result = correctComtext(source)
    expect(result).toContain('$x - y = z$')
    expect(result).toContain('в тексте — пример')
  })

  test('стихи не склеиваются в одну строку и дефис в конце строки не удаляется', () => {
    const source =
      'вступление\n\n' +
      '| Первая строка стиха\n' +
      '| Вторая строка-\n' +
      '| Третья строка\n\n' +
      'продолжение'
    const result = correctComtext(source)
    expect(result).toContain('| Первая строка стиха\n| Вторая строка-\n| Третья строка')
    expect(result).toContain('вступление')
    expect(result).toContain('продолжение')
  })

  test('цитаты не склеиваются в одну строку', () => {
    const source =
      'текст\n\n' +
      '> Первая строка цитаты\n' +
      '> Вторая строка цитаты\n\n' +
      'продолжение'
    const result = correctComtext(source)
    expect(result).toContain('> Первая строка цитаты\n> Вторая строка цитаты')
  })

  test('текст внутри цитаты корректируется', () => {
    const source =
      'текст\n\n' +
      '> Строка цитаты - пример\n' +
      '> В.И.Ленин написал\n\n' +
      'продолжение'
    const result = correctComtext(source)
    // Структура сохраняется
    expect(result).toContain('> Строка цитаты — пример\n> В. И. Ленин написал')
  })

  test('список не склеивается в одну строку', () => {
    const source =
      'введение\n\n' +
      '* первый пункт\n' +
      '* второй пункт\n' +
      '* третий пункт\n\n' +
      'заключение'
    const result = correctComtext(source)
    expect(result).toContain('* первый пункт\n* второй пункт\n* третий пункт')
  })

  test('нумерованный список не склеивается', () => {
    const source =
      '1. первый\n' +
      '2. второй\n' +
      '3. третий'
    const result = correctComtext(source)
    expect(result).toContain('1. первый\n2. второй\n3. третий')
  })

  test('структура многострочной сноски сохраняется', () => {
    const source =
      'текст [^1] текст\n\n' +
      '[^1]: сноска начало\n\n' +
      '    Второй абзац сноски'
    const result = correctComtext(source)
    // 4-пробельный отступ должен остаться нетронутым
    expect(result).toContain('[^1]: сноска начало\n\n    Второй абзац сноски')
  })

  test('однострочная сноска корректируется', () => {
    const source = 'текст [^1]\n\n[^1]: просто сноска'
    const result = correctComtext(source)
    expect(result).toContain('[^1]: просто сноска')
  })

  test('текст внутри сноски корректируется, структура сохраняется', () => {
    const source =
      'до сноски - пример\n\n' +
      '[^1]: сноска - текст\n\n' +
      '    продолжение - сноски\n\n' +
      'после сноски - пример'
    const result = correctComtext(source)
    // Текст вокруг сноски корректируется
    expect(result).toContain('до сноски — пример')
    expect(result).toContain('после сноски — пример')
    // Текст внутри сноски тоже корректируется
    expect(result).toContain('[^1]: сноска — текст')
    expect(result).toContain('    продолжение — сноски')
  })

  test('список между абзацами не добавляет лишних пустых строк', () => {
    const source =
      'Первый абзац.\n\n' +
      '* первый пункт\n' +
      '* второй пункт\n\n' +
      'Второй абзац.'
    const result = correctComtext(source)
    expect(result).toBe('Первый абзац.\n\n* первый пункт\n* второй пункт\n\nВторой абзац.')
  })

  test('блок кода между абзацами не добавляет лишних пустых строк', () => {
    const source =
      'До кода.\n\n' +
      '```js\nconsole.log(1)\n```\n\n' +
      'После кода.'
    const result = correctComtext(source)
    expect(result).toBe('До кода.\n\n```js\nconsole.log(1)\n```\n\nПосле кода.')
  })

  test('url в ссылке не изменяется', () => {
    const source = '[текст ссылки](https://example.com/path?a=1&b=2)'
    const result = correctComtext(source)
    expect(result).toBe('[текст ссылки](https://example.com/path?a=1&b=2)')
  })

  test('текст ссылки корректируется, url нет', () => {
    const source = '[В.И.Ленин](https://example.com)'
    const result = correctComtext(source)
    expect(result).toBe('[В. И. Ленин](https://example.com)')
  })

  test('url с дефисами не превращается в тире', () => {
    const source = '[ссылка](https://my-site.com/path--page)'
    const result = correctComtext(source)
    expect(result).toBe('[ссылка](https://my-site.com/path--page)')
  })

  test('изображение: url не изменяется, alt корректируется', () => {
    const source = '![В.И.Ленин](https://example.com/img.png)'
    const result = correctComtext(source)
    expect(result).toBe('![В. И. Ленин](https://example.com/img.png)')
  })

  test('текст до и после блоков корректируется', () => {
    const source =
      '---\nformat: comtext\n---\n' +
      'до блока - пример\n\n' +
      '* один\n' +
      '* два\n\n' +
      'после блока - пример'
    const result = correctComtext(source)
    expect(result).toContain('до блока — пример')
    expect(result).toContain('* один\n* два')
    expect(result).toContain('после блока — пример')
  })
})
