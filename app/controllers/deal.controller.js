const Deal = require("../models/deal.model.js");

//Создаем и сохраняем новое дело
exports.create = (req, res) => {
  //  Валидизируем запрос
  if (!req.body) {
    res.status(400).send({
      message: "Не может не быть контента"
    });
  }

  // создание своего дела
  const deal = new Deal({
    text: req.body.text,
    inner_key: new Date().toLocaleString()//req.body.inner_key
    // у нашего дела будет текст и внутренний id, который будет использоваться как key в React
  });


  Deal.create(deal, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Произошла ошибка во время выполнения кода"
      });
    else res.send(data);
  });
};

// Получение всех пользователей из базы данных
exports.findAll = (req, res) => {
  Deal.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Что-то случилось во время получения всех пользователей"
      });
    else 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    // я оставлю заголовки, получаемые с сервера
    res.send(data);
  });
};

//  Найти одно дело по одному inner_id
exports.findOne = (req, res) => {
  Deal.findById(req.params.dealId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Нет дела с id ${req.params.dealId}.`
        });
      } else {
        res.status(500).send({
          message: "Проблема с получением пользователя по id" + req.params.dealId
        });
      }
    } else res.send(data);
  });
};

// Обновление по inner_id
exports.update = (req, res) => {
  // валидизируем запрос
  if (!req.body) {
    res.status(400).send({
      message: "Контент не может быть пустой"
    });
  }

// Обновление дела по inner_key
  Deal.updateById(
    req.params.dealId,
    new Deal(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Не найдено дело с id ${req.params.dealId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating deal with id " + req.params.dealId
          });
        }
      } else res.send(data);
    }
  );
};

// удалить дело по inner_key
exports.delete = (req, res) => {
  Deal.remove(req.params.dealId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Не найдено дело с ${req.params.dealId}.`
        });
      } else {
        res.status(500).send({
          message: "Не могу удалить дело с " + req.params.dealId
        });
      }
    } else res.send({ message: `дело было успешно удалено` });
  });
};

// Удалить все дела из таблицы
exports.deleteAll = (req, res) => {
  Deal.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Что-то пошло не так во время удаления всех дел"
      });
    else res.send({ message: `Все дела успешно удалены` });
  });
};