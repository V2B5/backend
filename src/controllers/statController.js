const Event = require('../models/eventModel');
const Establishment = require('../models/establishmentModel');
const Post = require('../models/postModel');
const Area = require ('../models/areaModel');
const Sequelize = require('sequelize');
const EstablishmentReview = require('../models/establishmentReviewModel');
const EventReview = require('../models/eventReviewModel');

exports.EventsPerAreaCounter = async (req, res) => {
    try {
        const data = await Event.findAll({
            attributes: ['idArea', [Sequelize.fn('COUNT', Sequelize.col('idArea')), 'contador']],
            group: ['Evento.idArea', 'area.id'],
            include: [
                { 
                    model: Area,
                    as: 'area', 
                    attributes: ['id', 'nome'] 
                } 
            ]
        });
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EstablishmentsPerAreaCounter = async (req, res) => {
    try {
        const data = await Establishment.findAll({
            attributes: ['idArea', [Sequelize.fn('COUNT', Sequelize.col('idArea')), 'contador']],
            group: ['Estabelecimento.idArea', 'Area.id'],
            include: [
                { 
                    model: Area,
                    as: 'Area', 
                    attributes: ['id', 'nome'] 
                } 
            ]
        });
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventsPerAreaPost = async (req, res) => {
    try {
        const { areaId } = req.params;
        let idPosto;
        if (req.user) {
            idPosto = req.user.idPosto;
        }
        const data = await Event.findAll({
            where: { 
                idArea: areaId,
                idPosto: idPosto 
            },
            include: [
                { 
                    model: Post,
                    as: 'posto', 
                    attributes: ['nome'] 
                } 
            ]
        });
        const contador = data.length; 
        res.json({
            success: true,
            data: data,
            contador: contador 
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EstablishmentsPerAreaPost = async (req, res) => {
    try {
        const { areaId } = req.params;
        let idPosto;
        if (req.user) {
            idPosto = req.user.idPosto;
        }
        const data = await Establishment.findAll({
            where: { 
                idArea: areaId,
                idPosto: idPosto 
            },
            include: [
                { 
                    model: Post,
                    as: 'posto', 
                    attributes: ['nome'] 
                } 
            ]
        });
        const contador = data.length; 
        res.json({
            success: true,
            data: data,
            contador: contador 
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.MostReviews = async (req, res) => {
    try {
        const estabelecimentoMaisAvaliado = await EstablishmentReview.findOne({
            attributes: [
                'idEstabelecimento', 
                [Sequelize.fn('count', Sequelize.col('AvaliacaoEstabelecimento.id')), 'totalAvaliacoes']
            ],
            group: ['idEstabelecimento'],
            order: [[Sequelize.fn('count', Sequelize.col('AvaliacaoEstabelecimento.id')), 'DESC']],
            limit: 1
        });

        const eventoMaisAvaliado = await EventReview.findOne({
            attributes: [
                'idEvento', 
                [Sequelize.fn('count', Sequelize.col('AvaliacaoEvento.id')), 'totalAvaliacoes']
            ],
            group: ['idEvento'],
            order: [[Sequelize.fn('count', Sequelize.col('AvaliacaoEvento.id')), 'DESC']],
            limit: 1
        });

        let nomeEstabelecimentoMaisAvaliado = null;
        if (estabelecimentoMaisAvaliado) {
            const estabelecimento = await Establishment.findByPk(estabelecimentoMaisAvaliado.idEstabelecimento);
            if (estabelecimento) {
                nomeEstabelecimentoMaisAvaliado = estabelecimento.nome;
            }
        }

        let nomeEventoMaisAvaliado = null;
        if (eventoMaisAvaliado) {
            const evento = await Event.findByPk(eventoMaisAvaliado.idEvento);
            if (evento) {
                nomeEventoMaisAvaliado = evento.titulo;
            }
        }
        res.json({
            success: true,
            estabelecimentoMaisAvaliado: {
                idEstabelecimento: estabelecimentoMaisAvaliado ? estabelecimentoMaisAvaliado.idEstabelecimento : null,
                nome: nomeEstabelecimentoMaisAvaliado,
                totalAvaliacoes: estabelecimentoMaisAvaliado ? estabelecimentoMaisAvaliado.dataValues.totalAvaliacoes : 0
            },
            eventoMaisAvaliado: {
                idEvento: eventoMaisAvaliado ? eventoMaisAvaliado.idEvento : null,
                nome: nomeEventoMaisAvaliado,
                totalAvaliacoes: eventoMaisAvaliado ? eventoMaisAvaliado.dataValues.totalAvaliacoes : 0
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};