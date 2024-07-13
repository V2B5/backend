
const gerarToken = require('../middlewares/Token');
const User = require('../models/userModel');
const Post = require('../models/postModel');
require('dotenv').config();

exports.UserGet = (req, res) => {
    res.send(req.user);
  };

exports.UserGetFull = async (req, res) => {
  const { id } = req.user;

  try {
    const utilizador = await User.findByPk(id, {
      include: [{
        model: Post,
        attributes: ['nome'] 
      }]
    });
    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    res.send(utilizador);
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.UserGetAll = async (req, res) => {
  const { idPosto } = req.query;

  try {
    let utilizadores;
    if (idPosto) {
      utilizadores = await User.findAll({ where: { idPosto } });
    } else {
      utilizadores = await User.findAll();
    }
    res.send(utilizadores);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.UserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await User.findByPk(id);
    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    res.send(utilizador);
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.UserCreate = async (req, res) => {
  const { nome, email, estado, isAdmin, idPosto } = req.body;

  try {
    const newUtilizador = await User.create({ nome, email, estado, isAdmin, idPosto });
    res.status(201).send({ message: 'Utilizador criado com sucesso', data: newUtilizador });
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.UserUpdate = async (req, res) => {
  const { id } = req.params;
  const { nome, email, estado, isAdmin, idPosto } = req.body;

  try {
    const utilizador = await User.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    if (nome !== undefined) utilizador.nome = nome;
    if (email !== undefined) utilizador.email = email;
    if (estado !== undefined) utilizador.estado = estado;
    if (isAdmin !== undefined) utilizador.isAdmin = isAdmin;
    if (idPosto !== undefined) utilizador.idPosto = idPosto;

    await utilizador.save();

    res.status(200).send({ message: 'Utilizador atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.UserDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await User.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    await utilizador.destroy();
    res.status(200).send({ message: 'Utilizador apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};


exports.associarPosto = async (req, res) => {
  const { id, idPosto } = req.body;

  try {
    const user = await User.findByPk(id);
    const posto = await Post.findByPk(idPosto);

    if (!user) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    if (!posto) {
      return res.status(404).send({ message: 'Posto não encontrado' });
    }

    user.idPosto = posto.id;
    await user.save();

    const token = gerarToken(user); 

    return res.status(200).send({ message: 'Utilizador associado ao posto com sucesso', token });
  } catch (error) {
    console.log(error); 
    return res.status(500).send({ message: 'Erro ao associar utilizador ao posto', error });
  }
};

exports.UserPhotoUpload = async (req, res) => {
  const { id } = req.params;
  const foto = req.file ? req.file.filename : null; 

  try {
    const utilizador = await User.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    utilizador.foto = foto; 
    await utilizador.save();

    res.status(200).send({ message: 'Foto do utilizador atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.UserPhotoDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await User.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    utilizador.foto = null;
    await utilizador.save();

    res.status(200).send({ message: 'Foto do utilizador apagada com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.UserPhotoGet = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await User.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    if (!utilizador.foto) {
      return res.status(404).send({ message: 'Foto não encontrada' });
    }

    res.sendFile(utilizador.foto, { root: './uploads/users' });
  } catch (error) {
    console.error('Erro ao encontrar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}