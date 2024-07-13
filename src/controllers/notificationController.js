const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

exports.NotificationCreate = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const idUtilizador = req.user.id;
    const notificacao = await Notification.create({
      idUtilizador,
      titulo,
      descricao,
      data: new Date(),
      estado: false
    });
    res.status(201).json({
      status: 'success',
      data: {
        notificacao
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.NotificationGet = async (req, res) => {
  try {
    const notificacoes = await Notification.findAll({
      where: {
        idUtilizador: req.user.id
      },
      include: [{ model: User, as: 'utilizador' }]
    });
    res.status(200).json({
      status: 'success',
      data: {
        notificacoes
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.NotificationDelete = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Notification.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'Notificações apagadas com sucesso.' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao apagar notificações.' });
  }
};

exports.MarkAsRead = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Notification.update({ estado: true }, { where: { id: ids } });
    res.status(200).send({ message: 'Notificações marcadas como lidas com sucesso.' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao marcar notificações como lidas.' });
  }
}

  exports.NotificationCounter = async (req, res) => {
      try {
          const contador = await Notification.count({
          where: {
              idUtilizador: req.user.id,
              estado: false  }
          });
          res.status(200).json({
          status: 'success',
          data: {
              contador
          }
          });
      } catch (err) {
          res.status(400).json({
          status: 'fail',
          message: err
          });
      }
      }


