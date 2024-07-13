const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
require('dotenv').config();
const gerarToken = require('../middlewares/Token');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'É necessário preencher todos os campos' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: 'Utilizador inválido' });
    }

    if (!user.isAdmin) {
      return res.status(401).send({ error: 'Acesso negado' });
    }

    if (!user.estado) {
      return res.status(401).send({ error: 'Conta não verificada. Verifique o seu email para ativar a sua conta.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.palavra_passe);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Palavra Passe incorreta' });
    }

    const token = gerarToken(user);

    if (user.isPrimeiroLogin) {
      const recoveryToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30m',
      });

      await user.update({ recoveryToken, isPrimeiroLogin: false });
    }

    res.send({ message: 'Login realizado com sucesso', token, recoveryToken: user.recoveryToken });
  } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).send({ error: 'Erro do servidor' });
  }
};


exports.VerifyEmail = async (req, res) => {
  try {
    const { token } = req.body || req.query; 

    if (!token) {
      return res.status(400).send({ error: 'Token de verificação não fornecido' });
    }

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).send({ error: 'Token de verificação inválido' });
    }

    user.estado = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).send({ message: 'Email verificado com sucesso. Pode seguir para o login' });
  } catch (error) {
    console.error('Erro durante a verificação de email:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};
 
exports.AccountCreate = async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).send({ error: 'Email já está em uso' });
    }

    const password = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
 
    const novoUser = await User.create({
      nome,
      email,
      palavra_passe: hashedPassword,
      verificationToken,
      estado: false
    });

    const token = gerarToken(novoUser);

    const verificationUrl = `${process.env.REACT_APP_FRONTEND}/verificar-conta?token=${verificationToken}`;
    await enviarEmail({  
      email,
      subject: 'Verifique o seu email',
      message: `Clique no link a seguir para verificar a sua conta: ${verificationUrl}.\n\nA sua password temporária é: ${password}`
    });

    res.status(201).send({ message: 'Conta criada com sucesso. Verifique o seu email para ativar sua conta.', token });
  } catch (error) {
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.RecoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ error: 'Utilizador inválido' });
    }

    const recoveryToken = crypto.randomBytes(32).toString('hex');
    user.recoveryToken = recoveryToken; 
    await user.save();

    const resetUrl = `${process.env.REACT_APP_FRONTEND}/reset-passe?token=${recoveryToken}`;
    await enviarEmail({
      email,
      subject: 'Recuperação de Palavra Passe',
      message: `Clique no link a seguir para redefinir a sua palavra-passe: ${resetUrl}`
    });

    res.send({ message: 'Email enviado com sucesso. Verifique o seu email para recuperar a password ' });
  } catch (error) {
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, novaPass } = req.body;

    const user = await User.findOne({ where: { recoveryToken: token } });
    if (!user) {
      return res.status(400).send({ error: 'Token inválido' });
    }

    user.isPrimeiroLogin = false;
    await user.save();

    const hashedPassword = await bcrypt.hash(novaPass, 12);
    user.palavra_passe = hashedPassword;
    user.recoveryToken = null;
    await user.save();

    res.send({ message: 'A sua password foi redefinida com sucesso' });
  } catch (error) {
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

const enviarEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: 'Softinsa <softinsa@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado');
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao enviar email');
  }
};

