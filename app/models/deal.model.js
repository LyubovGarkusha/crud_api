const sql = require("./db.js");

// конструктор нашего дела. В нашем todo будет два задаваемых значения
// текст и внутреннее inner_id для нашего дела

const Deal = function(deal) {
  this.text = deal.text;
  this.inner_key = deal.inner_key;
};


Deal.create = (newDeal, result) => {

  const queryInsert = "INSERT INTO TODO SET ?";
  sql.query(queryInsert, newDeal, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Создано дело", { id: res.insertId, ...newDeal });
    result(null, { id: res.insertId, ...newDeal }); 
    //используем spread для отправки наших аргументов в базу данных

  });
};



//получение дела по одному inner_id
Deal.findById = (dealId, result) => {
  const queryFintbyId = `SELECT * FROM TODO WHERE inner_key = '${dealId}'`;
  sql.query(queryFintbyId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("найдено дело: ", res[0]);
      result(null, res[0]);
      return;
    }
    // когда ничего не удалось найти
    result({ kind: "not_found" }, null);
  });
};

 Deal.getAll = result => {
   // я хочу из базы данных только текст и inner_key, без id из базы данных
   const queryAll = "SELECT text, inner_key FROM TODO";
  sql.query(queryAll, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("deals: ", res);
    result(null, res);
  });
};

//мы будем обновлять дела по inner_key
Deal.updateById = (inner_key, deal, result) => {
  const queryUpdate = "UPDATE TODO SET text = ?  WHERE inner_key = ?";
  sql.query(
    queryUpdate,
    [deal.text, inner_key],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Обновлено дело ", { inner_key: inner_key, ...deal });
      result(null, { inner_key: inner_key, ...deal });
    }
  );
};


//удаление по inner_key
Deal.remove = (inner_key, result) => {
  const queryDelete = "DELETE FROM TODO WHERE inner_key = ?";
  sql.query(queryDelete, inner_key, (err, res) => {
    if (err) {
      console.log("error: ", err); 
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      //  если дело не удалось получить по inner_key
      result({ kind: "не найдено" }, null);
      return;
    }

    console.log("Удален пользователь с  ", inner_key);
    result(null, res);
  });
};

// удаление всех записей
Deal.removeAll = result => {
  sql.query("DELETE FROM TODO", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} deals`);
    result(null, res);
  });
};

module.exports = Deal;