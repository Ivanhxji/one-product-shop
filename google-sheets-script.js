// ============================================
// GOOGLE APPS SCRIPT — вставить в Google Sheets
// ============================================
//
// КАК УСТАНОВИТЬ:
// 1. Открой Google Sheets (новая таблица)
// 2. Extensions → Apps Script
// 3. Удали всё что там есть
// 4. Вставь ВЕСЬ этот код
// 5. Нажми Deploy → New Deployment
// 6. Type: Web App
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Нажми Deploy → скопируй URL
// 10. Вставь URL в файл js/orders.js (строка GOOGLE_SHEETS_URL)
//
// ГОТОВО! Заказы будут падать в таблицу автоматически.
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Создаём заголовки если таблица пустая
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Order #',
        'Date',
        'Time',
        'Name',
        'Email',
        'Phone',
        'Address',
        'City',
        'State',
        'ZIP',
        'Country',
        'Product',
        'Quantity',
        'Price',
        'Total',
        'Status',
        'Notes'
      ]);
      // Делаем заголовки жирными
      sheet.getRange(1, 1, 1, 17).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Генерируем номер заказа
    var orderNum = 'AL-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd') + '-' + (sheet.getLastRow());

    // Добавляем заказ
    sheet.appendRow([
      orderNum,
      Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'),
      Utilities.formatDate(new Date(), 'GMT', 'HH:mm:ss'),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.city || '',
      data.state || '',
      data.zip || '',
      data.country || '',
      data.product || 'AutoLink Pro',
      data.quantity || 1,
      data.price || '$59.99',
      data.total || '$59.99',
      'NEW',
      data.notes || ''
    ]);

    // Подсвечиваем новый заказ
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 16).setBackground('#fff3e0'); // Status = жёлтый

    // Отправляем уведомление на email (опционально — раскомментируй)
    // MailApp.sendEmail('YOUR_EMAIL@gmail.com', 'New Order: ' + orderNum,
    //   'New order from ' + data.name + '\nEmail: ' + data.email + '\nTotal: ' + data.total);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        orderNumber: orderNum
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Тест — можно запустить вручную чтобы проверить
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'AutoLink Orders API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
