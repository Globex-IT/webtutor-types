/**
 * Объект HttpResponse - это объект, который возвращает функция HttpRequest.
 * Т.е. Вызов функции HttpRequest - единственный способ создать объект HttpResponse,
 * в явном виде его создать нельзя. Основной атрибут этого объекта - Body,
 * все остальные используются в редких случаях.
 */
interface HttpResponse {
  /**
   * Тело Http-ответа, возвращаемое в виде объекта типа Binary.
   * Редко используется с тех пор, как строки стали поддерживать бинарные данные,
   * теперь разница между Body и BinaryBody фактически не стало.
   */
  BinaryBody: Binary;

  /**
   * Тело Http - ответа, возвращаемое в виде строки, возможно бинарной.
   */
  Body: string;

  /**
   * Содержит поле Content-Type, которое пришло в заголовке Http - ответа.
   */
  ContentType: string;

  /**
   * Возвращает содержимое заголовка HTTP-ответа в виде стандартного объекта JScript,
   * содержащего <пары имя поля> - <значение поля>.
   */
  Header: Object;

  /**
   * Код ошибки, который вернул Http-запрос. Обычно, если никакой ошибки нет, это код 200.
   * Если произошла ошибка, то соответствующий код ошибки будет сохранен в этом атрибуте.
   * В обычных ситуациях этот код ошибки не возвращается, т.к. Если произошла ошибка,
   * метод срабатывает исключением. Имеет смысл использовать атрибут RespCode,
   * только если метод HttpRequest задан с параметром Ignore-Error.
   */
  RespCode: number;

  /**
   * Этот атрибут содержит фактический url, с которого произошла закачка.
   * Обычно он совпадает с запрошенным url, но если запрос вклчает в себя redirect,
   * например по ошибке 303 или 304, то атрибут вернет фактический url,
   * c которого произошла закачка даных.
   */
  Url: string;

  /**
   * Сохраняет результат Http-запроса напрямую в файл, помогает экономить оперативную память.
   */
  SaveToFile(url: string): void;
}
