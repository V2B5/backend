const Establishment = require('../models/establishmentModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const Post = require('../models/postModel');
const EstablishmentPhoto = require('../models/establishmentPhoto');
const User = require('../models/userModel');
const EstablishmentReview = require('../models/establishmentReviewModel');
const Notification = require('../models/notificationModel');

exports.EstablishmentList = async (req, res) => {
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
        const data = await Establishment.findAll({
            where: whereClause,
            include: [
                { model: Area, attributes: ['nome'] },
                { model: Subarea, attributes: ['nome'] },
                { model: Post, attributes: ['nome'] },
            ],
        });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        console.error('Erro ao listar estabelecimentos:', err.message); // Adicionado log de erro detalhado
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EstablishmentCreate = async (req, res) => {
    const {
        nome,
        idArea,
        idSubarea,
        morada,
        descricao,
        telemovel,
        email,
    } = req.body;

    const foto = req.file ? req.file.filename : null;
    const idCriador = req.user.id;
    const idPosto = req.user.idPosto;

    try {
        const newEstabelecimento = await Establishment.create({
            nome,
            idArea,
            idSubarea,
            idPosto,
            morada,
            descricao,
            telemovel: String(telemovel),
            email: String(email),
            idCriador,
            foto
        });

        const notificacao = await Notification.create({
            idUtilizador: idCriador,
            titulo: 'Estabelecimento criado',
            descricao: `O seu estabelecimento ${nome} foi criado com sucesso!`,
            estado: false,
            data: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Estabelecimento criado com sucesso!',
            data: newEstabelecimento,
            notificacao: notificacao
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o estabelecimento!" });
    }
};


exports.EstablishmentGet = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Establishment.findOne({
            where: { id: id },
            include: [
                { model: Area, attributes: ['nome'] },
                { model: Subarea, attributes: ['nome'] },
                { model: Post, attributes: ['nome'] },
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
                message: 'O estabelecimento com o ID ' + id + ' não foi encontrado!',
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

exports.EstablishmentPhotoGet = async (req, res) => {
    const { id } = req.params;
    try {
        const fotos = await EstablishmentPhoto.findAll({
            where: {
                idEstabelecimento: id,
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
                message: 'Nenhuma foto encontrada para o estabelecimento com o ID ' + id,
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

exports.EstablishmentEdit = async (req, res) => {
    const { id } = req.params;
    const {
        nome,
        idArea,
        idSubarea,
        idPosto,
        morada,
        descricao,
        telemovel,
        email,
        estado,
        idAdmin,
        idCriador,
    } = req.body;

    const estabelecimentoAtual = await Establishment.findOne({ where: { id: id } });
    const fotoExistente = estabelecimentoAtual ? estabelecimentoAtual.foto : null;

    const foto = req.file ? req.file.filename : fotoExistente;

    let updateData = {
        nome,
        idArea,
        idSubarea,
        idPosto,
        morada,
        descricao,
        telemovel,
        email,
        estado,
        idAdmin,
        idCriador,
        foto 
    };

    try {
        const [updated] = await Establishment.update(updateData, {
            where: { id: id }
        });

        if (updated) {
            const updatedEstabelecimento = await Establishment.findOne({ where: { id: id } });
            res.status(200).json({ success: true, message: 'Estabelecimento atualizado com sucesso!', data: updatedEstabelecimento });
        } else {
            res.status(404).json({ success: false, message: 'Não foi possível atualizar o estabelecimento.' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao atualizar o estabelecimento!" });
    }
};

exports.EstablishmentPhotoUpdate = async (req, res) => {
    const { id } = req.params;
    const { idUtilizador } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
        const newFoto = await EstablishmentPhoto.create({
            foto,
            idEstabelecimento: id,
            idCriador: idUtilizador,
            estado: true,
        });

        res.status(200).json({
            success: true,
            message: 'Foto adicionada com sucesso!',
            data: newFoto
        });
    } catch (error) {
        console.error('Erro ao criar nova foto:', error);
        res.status(500).json({ success: false, message: "Erro ao adicionar a foto!" });
    }
};

exports.EstablishmentPhotoDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const [apagado] = await EstablishmentPhoto.update({
            estado: false,
        }, {
            where: { id: id }
        });

        if (apagado) {
            res.status(200).json({ success: true, message: 'Foto removida com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Foto não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao remover foto:', error);
        res.status(500).json({ success: false, message: "Erro ao remover a foto!" });
    }
};

exports.EstablishmentDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        await EstablishmentReview.destroy({
            where: { idEstabelecimento: id }
        });

        await EstablishmentPhoto.destroy({
            where: { idEstabelecimento: id }
        });

        const apagado = await Establishment.destroy({
            where: { id: id }
        });

        if (apagado) {
            res.status(200).json({ success: true, message: 'Estabelecimento apagado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Estabelecimento não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao apagar estabelecimento:', error);
        res.status(500).json({ success: false, message: "Erro ao apagar o estabelecimento!" });
    }
};

exports.EstabelecimentosPorValidar = async (req, res) => {
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }
    console.log('ID Posto:', idPosto);
    let whereClause = { estado: false };

    if (idPosto) {
        whereClause.idPosto = idPosto;
    }
    try {
        const data = await Establishment.findAll({
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
        console.error('Erro ao listar estabelecimentos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}