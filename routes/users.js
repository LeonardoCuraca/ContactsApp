var express = require('express');
var router = express.Router();

let controller = require('../controllers/userController');

router.get('/listar', function(req, res, next) {
  controller.listar(req, res);
});

router.get('/add', function(req, res) {
  controller.toStore(req, res);
});

router.post('/', function(req, res) {
  controller.store(req, res);
});

router.post('/upload', function(req, res, next) {
  controller.upload(req, res)
})

router.put('/userProfilePicture', function(req, res) {
  controller.editUserProfilePicture(req, res);
});

router.get('/edit/userProfilePicture/:user_id', function(req, res) {
  controller.toEditUserProfilePicture(req, res);
});

router.delete('/:user_id', function(req, res) {
  controller.delete(req, res);
});

module.exports = router;
