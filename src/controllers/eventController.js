const Event = require('../models/eventModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const EventPhoto = require('../models/eventPhotoModel');
const SignUp = require('../models/signupModel');
const Notification = require('../models/notificationModel');
const EventReview = require('../models/eventReviewModel');

exports.EventList = async (req, res) => {
    const { areaId, subareaId } = req.query;
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }

    let whereClause = { estado: true };
    if (areaId) {
        whereClause.idArea = areaId;
    }
    if (subareaId) {
        whereClause.idSubarea = subareaId;
    }
    if (idPosto) {
        whereClause.idPosto = idPosto;
    }

    try {
        const data = await Event.findAll({
            where: whereClause,
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: User, as: 'criador', attributes: ['nome'] },
                { model: User, as: 'admin', attributes: ['nome'] },
                { model: Post, as: 'posto', attributes: ['nome'] }
            ]
        });
        res.json({
            success: true,
            data: data,
        });
    } catch (err) {
        console.error('Erro ao listar eventos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};


exports.EventGet = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Event.findOne({
            where: { id: id },
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: User, as: 'criador', attributes: ['nome'] },
                { model: User, as: 'admin', attributes: ['nome'] }
            ]
        });

        if (data) {
            res.status(200).json({
                success: true,
                data: data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'O evento com o ID ' + id + ' não foi encontrado!',
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.EventCreate = async (req, res) => {
    const {
        titulo,
        descricao,
        data,
        hora,
        morada,
        telemovel,
        email,
        idArea,
        idSubarea
    } = req.body;

    const idPosto = req.user.idPosto;
    const idCriador = req.user.id;
    const foto = req.file ? req.file.filename : null;

    try {
        const newEvento = await Event.create({
            titulo,
            descricao,
            data,
            hora,
            morada,
            telemovel,
            email,
            foto,
            estado: false, 
            idArea,
            idSubarea,
            idCriador,
            idPosto
        });

        const notificacao = await Notification.create({
            idUtilizador: idCriador,
            titulo: 'Evento criado',
            descricao: `O seu evento ${titulo} foi criado e enviado para validação!`,
            estado: false, 
            data: new Date() 
        });

        res.status(200).json({
            success: true,
            message: 'Evento criado com sucesso!',
            data: newEvento,
            notificacao: notificacao 
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o evento!" });
    }
};


exports.EventEdit = async (req, res) => {
    const { id } = req.params;
    const {
        titulo,
        descricao,
        data,
        hora,
        morada,
        telemovel,
        email,
        idArea,
        idSubarea,
        idCriador,
        estado,
        idAdmin,
        inscricaoAberta
    } = req.body;

    const eventoAtual = await Event.findOne({ where: { id: id } });
    const fotoExistente = eventoAtual ? eventoAtual.foto : null;

    const foto = req.file ? req.file.filename : fotoExistente;

    let updateData = {};

    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (data !== undefined) updateData.data = data;
    if (hora !== undefined) updateData.hora = hora;
    if (morada !== undefined) updateData.morada = morada;
    if (telemovel !== undefined) updateData.telemovel = telemovel;
    if (email !== undefined) updateData.email = email;
    if (idArea !== undefined) updateData.idArea = idArea;
    if (idSubarea !== undefined) updateData.idSubarea = idSubarea;
    if (idCriador !== undefined) updateData.idCriador = idCriador;
    if (estado !== undefined) updateData.estado = estado;
    if (idAdmin !== undefined) updateData.idAdmin = idAdmin;
    if (foto !== undefined) updateData.foto = foto; 
    if (inscricaoAberta !== undefined) updateData.inscricaoAberta = inscricaoAberta;

    try {
        const [updated] = await Event.update(updateData, {
            where: { id: id }
        });

        if (updated) {
            const updatedEvento = await Event.findOne({ where: { id: id } });
            res.status(200).json({ success: true, message: 'Evento atualizado com sucesso!', data: updatedEvento });
        } else {
            res.status(404).json({ success: false, message: 'Não foi possível atualizar o evento.' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao atualizar o evento!" });
    }
};

exports.EventDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await EventReview.destroy({
            where: { idEvento: id }
        });
        await SignUp.destroy({
            where: { idEvento: id }
        });
        await EventPhoto.destroy({
            where: { idEvento: id }
        });
        const evento = await Event.destroy({
            where: { id: id }
        });

        if (evento) {
            res.status(200).json({ success: true, message: 'Evento apagado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Evento não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao apagar evento:', error);
        res.status(500).json({ success: false, message: "Erro ao apagar o evento!" });
    }
};

exports.EventPhotoGet = async (req, res) => {
    const { id } = req.params;
    try {
        const fotos = await EventPhoto.findAll({
            where: {
                idEvento: id,
                estado: true,
            },
            include: [
                {
                    model: User,
                    as: 'criador',
                    attributes: ['nome'],
                },
                {
                    model: User,
                    as: 'admin',
                    attributes: ['nome'],
                },
            ],
        });
        if (fotos.length > 0) {
            res.status(200).json({
                success: true,
                data: fotos,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma foto encontrada para o evento com o ID ' + id,
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}


exports.EventPhotoDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const [evento] = await EventPhoto.update({
            estado: false,
        }, {
            where: { id: id }
        });

        if (evento) {
            res.status(200).json({ success: true, message: 'Foto removida com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Foto não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao remover foto:', error);
        res.status(500).json({ success: false, message: "Erro ao remover a foto!" });
    }
};

exports.EventPhotoUpload = async (req, res) => {
    const { id } = req.params;
    const { idUtilizador } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
        const newFoto = await EventPhoto.create({
            foto,
            idEvento: id,
            idCriador: idUtilizador,
            estado: true,
        });

        res.status(200).json({
            success: true,
            message: 'Foto adicionada com sucesso!',
            data: newFoto
        });
    } catch (error) {
        console.error('Erro ao criar nova foto:', error); // Adicione essa linha para registrar o erro no console
        res.status(500).json({ success: false, message: "Erro ao adicionar a foto!" });
    }
};

exports.EventosPorValidar = async (req, res) => {
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }

    let whereClause = { estado: false };

    if (idPosto) {
        whereClause.idPosto = idPosto;
    }

    try {
        const data = await Event.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'criador', attributes: ['nome'] },
            ]
        });

        res.json({
            success: true,
            data: data,
            contador: data.length, 
        });
    } catch (err) {
        console.error('Erro ao listar eventos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventSubscriptionGet = async (req, res) => {
    const { id } = req.params;
    try {
        const inscricoes = await SignUp.findAll({
            where: {
                idEvento: id,
                estado: true,

            },
            include: [
                { model: User, as: 'utilizador', attributes: ['nome'] },
                { model: User, as: 'admin', attributes: ['nome'] },
            ]
        });

        if (inscricoes.length > 0) {
            res.status(200).json({
                success: true,
                data: inscricoes,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventSubscribe = async (req, res) => {
    const { id } = req.params;
    const idUtilizador = req.user.id;
    try {
        const inscricaoExistente = await SignUp.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        console.log('Inscrição existente:', inscricaoExistente);

        if (inscricaoExistente) {
            return res.status(400).json({
                success: false,
                message: 'Utilizador já inscrito no evento.'
            });
        }
        await SignUp.create({
            idEvento: id,
            idUtilizador: idUtilizador,
            estado: true
        });
        res.status(200).json({
            success: true,
            message: 'Inscrição realizada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao inscrever:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar a inscrição!'
        });
    }
};

exports.EventUnsubscribe = async (req, res) => {
    const { id } = req.params;
    const idUtilizador = req.user.id; 

    try {
        const inscricaoExistente = await SignUp.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        if (!inscricaoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }

        await SignUp.destroy({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        res.status(200).json({
            success: true,
            message: 'Inscrição removida com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao desinscrever:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar a desinscrição!'
        });
    }
};

exports.SubscriptionVerify = async (req, res) => {
    const { id } = req.params; 
    const idUtilizador = req.user.id; 
    try {
        const inscricao = await SignUp.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        if (inscricao) {
            res.status(200).json({
                success: true,
                data: inscricao,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }
    } catch (error) {
        console.error('Erro ao verificar inscrição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar a inscrição!'
        });
    }
}