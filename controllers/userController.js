let db = require('../models/dbconnection');
var cloudinary = require('cloudinary').v2;

let users = {
  listar(req, res) {
    let sql = "SELECT * FROM users";
    db.query(sql, function(err, result) {
      console.log(result);
      if (err) {
        req.flash('error', err);
        res.render('users', {data: result});
      } else {
        res.render('users', {data: result});
      }
    });
  },
  toStore(req, res) {
    res.render('users/add');
  },
  store(req, res) {
    console.log(req.body);
    user_name = req.body.user_name;
    user_password = req.body.user_password;
    user_real_name = req.body.user_real_name;
    user_last_name = req.body.user_last_name;
    user_profile_picture_url = req.body.user_profile_picture_url;
    user_birthday = req.body.user_birthday;

    let sql = "INSERT INTO users (user_name, user_password, user_real_name, user_last_name, user_profile_picture_url, user_birthday) values (?, ?, ?, ?, ?, ?)";
    db.query(sql, [user_name, user_password, user_real_name, user_last_name, user_profile_picture_url, user_birthday], function(err, newData) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(newData);
      }
    });
  },
  upload(req, res) {
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, function(err, result) {
      console.log("then");
      if (result) {
        res.send({
          success: true,
          result
        })
      } else {
        res.send({
          success: false,
          err
        })
      }
    });
  },
  editUserProfilePicture(req, res) {
    console.log(req.body);
    user_id = req.body.user_id;
    user_profile_picture_url = req.body.user_profile_picture_url;

    let sql = "UPDATE users set user_profile_picture_url=? WHERE user_id=?";
    db.query(sql, [user_profile_picture_url, user_id], function(err, newData) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(newData);
      }
    });
  },
  toEditUserProfilePicture(req, res) {
    user_id = req.params.user_id;
    let sql = "SELECT * FROM users where user_id = " + user_id;
    db.query(sql, function(err, result) {
      console.log("result");
      console.log(result);
      if (err) {
        req.flash('error', err);
        res.render('users/edit', {data: result});
      } else {
        res.render('users/edit', {data: result});
      }
    });
  },
  delete(req, res) {
    user_id = req.params.user_id;
    let sql = "DELETE FROM users WHERE user_id=?";
    db.query(sql, [user_id], function(err, newData) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  }
}

module.exports = users;
