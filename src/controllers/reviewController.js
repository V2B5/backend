const EstablishmentReview = require('../models/establishmentReviewModel');
const EventReview = require('../models/eventReviewModel');
const Event = require('../models/eventModel');
const Establishment = require('../models/establishmentModel');
const User = require('../models/userModel');
const Vote = require('../models/voteModel');
const Sequelize = require('sequelize');

exports.EstablishmentReviewsList = async (req, res) => {
    try {
        const idEstabelecimento = req.params.id || req.query.idEstabelecimento;

        const data = await EstablishmentReview.findAll({
            where: { 
                idEstabelecimento: idEstabelecimento,
                estado: true,
                idPai: null
            }, 
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: User, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                {
                    model: User,
                    as: 'estabelecimento',
                    attributes: ['nome','idPosto']
                }
            ],
        });

        
        const media = await EstablishmentReview.findOne({
            where: { 
                idEstabelecimento: idEstabelecimento,
                estado: true,
            },
            attributes: [[Sequelize.fn('avg', Sequelize.col('classificacao')), 'media']]
        });

        res.json({
            success: true,
            data,
            media: media.get('media')
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.EstablishmentReviewsCreate = async (req, res) => {
    try {
        const { idUtilizador, classificacao, comentario } = req.body;
        const idEstabelecimento = req.params.id; 

        console.log(idUtilizador)

        if (!classificacao && !comentario) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça uma classificação ou comentário.',
            });
        }

        const user = await User.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilizador não encontrado.',
            });
        }

        const avaliacao = await EstablishmentReview.create({
            idUtilizador,
            idEstabelecimento,
            classificacao,
            comentario,
            estado: false
        });

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EstablishmentReviewsEdit = async (req, res) => {
    try {
        const { classificacao, comentario, estado } = req.body;
        const idAvaliacao = req.params.id;

        const avaliacao = await EstablishmentReview.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        if (classificacao) {
            avaliacao.classificacao = classificacao;
        }

        if (comentario) {
            avaliacao.comentario = comentario;
        }

        if (estado !== undefined) { 
            avaliacao.estado = estado;
        }

        await avaliacao.save();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EstablishmentReviewsDelete = async (req, res) => {
    try {
        const idAvaliacao = req.params.id;

        const apagarVotos = async (avaliacaoId) => {
            try {
                await Vote.destroy({
                    where: { idEstabelecimento: avaliacaoId }
                });
            } catch (err) {
                throw new Error(`Erro ao apagar votos da avaliação ${avaliacaoId}: ${err.message}`);
            }
        };

        const apagarFilhos = async (avaliacaoId) => {
            let respostas;
            try {
                respostas = await EstablishmentReview.findAll({
                    where: { idPai: avaliacaoId }
                });
            } catch (err) {
                throw new Error(`Erro ao buscar respostas da avaliação ${avaliacaoId}: ${err.message}`);
            }

            for (const resposta of respostas) {
                try {
                    await apagarFilhos(resposta.id);
                } catch (err) {
                    throw new Error(`Erro ao apagar respostas filhas da resposta ${resposta.id}: ${err.message}`);
                }
                try {
                    await resposta.destroy();
                } catch (err) {
                    throw new Error(`Erro ao apagar resposta ${resposta.id}: ${err.message}`);
                }
            }
            await apagarVotos(avaliacaoId);

            try {
                const avaliacao = await EstablishmentReview.findByPk(avaliacaoId);
                await avaliacao.destroy();
            } catch (err) {
                throw new Error(`Erro ao apagar avaliação ${avaliacaoId}: ${err.message}`);
            }
        };

        await apagarFilhos(idAvaliacao);

        res.json({
            success: true,
            message: 'Avaliação, todas as respostas e votos relacionados deletados com sucesso.',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: `Erro ao apagar avaliação, respostas e votos: ${err.message}`,
        });
    }
};



exports.EventReviewsList = async (req, res) => {
    try {
        const idEvento = req.params.id || req.query.idEvento;

        const data = await EventReview.findAll({
            where: { 
                idEvento,
                estado: true,
                idPai: null
            },
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: User, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                {
                    model: Event,
                    as: 'evento',
                    attributes: ['titulo','idPosto']
                }
            ],
        });
        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventReviewsCreate = async (req, res) => {
    try {
        const { idUtilizador, classificacao, comentario } = req.body;
        const idEvento = req.params.id; 

        if (!classificacao && !comentario) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça uma classificação ou comentário.',
            });
        }

        const user = await User.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilizador não encontrado.',
            });
        }

        const avaliacao = await EventReview.create({
            idUtilizador,
            idEvento,
            classificacao,
            comentario,
            estado: false,
        });

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventReviewsEdit = async (req, res) => {
    try {
        const { classificacao, comentario, estado } = req.body; 
        const idAvaliacao = req.params.id;

        const avaliacao = await EventReview.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        if (classificacao) {
            avaliacao.classificacao = classificacao;
        }

        if (comentario) {
            avaliacao.comentario = comentario;
        }

        if (estado !== undefined) { 
            avaliacao.estado = estado;
        }

        await avaliacao.save();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.EventReviewsDelete = async (req, res) => {
    try {
        const idAvaliacao = req.params.id;

        const avaliacao = await EventReview.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        await avaliacao.destroy();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.UserReviewsList = async (req, res) => {
    try {
        const idUtilizador = req.params.idUtilizador;
        
        const avaliacoesEstabelecimento = await EventReview.findAll({
            where: { idUtilizador, estado: true, },
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: User, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                { 
                    model: Establishment, 
                    as: 'estabelecimento', 
                    attributes: ['nome'] 
                },
            ],
        });

        const avaliacoesEvento = await EventReview.findAll({
            where: { idUtilizador, estado: true, },
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: User, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                { 
                    model: Event, 
                    as: 'evento', 
                    attributes: ['titulo'] 
                },
            ],
        });

        const data = [...avaliacoesEstabelecimento, ...avaliacoesEvento];

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}


exports.AvaliacaoEventoPorValidar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    const idPosto = req.user.idPosto;

    try {
        const avaliacoesEvento = await EventReview.findAll({
            include: [{
                model: Event,
                as: 'evento',
                where: { idPosto: idPosto }, 
            }, {
                model: User,
                as: 'utilizador',
                attributes: ['id', 'nome', 'email']
            }],
            where: { estado: false }
        });

        res.json({ success: true, data: avaliacoesEvento, contador: avaliacoesEvento.length,});
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao procurar avaliações: " + error.message });
    }
};

exports.AvaliacaoEstabelecimentoPorValidar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    const idPosto = req.user.idPosto;

    try {
        const avaliacoesEstabelecimento = await EstablishmentReview.findAll({
            include: [{
                model: Establishment,
                as: 'estabelecimento',
                where: { idPosto: idPosto }, 
            }, {
                model: User,
                as: 'utilizador',
                attributes: ['id', 'nome', 'email']
            }],
            where: { estado: false }
        });

        res.json({ success: true, data: avaliacoesEstabelecimento, contador: avaliacoesEstabelecimento.length, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao procurar avaliações: " + error.message });
    }
};

exports.Like = async (req, res) => {
    try {
        const { tipoEntidade, idEntidade } = req.body;
        const userId = req.user.id;

        const Avaliacao = tipoEntidade === 'estabelecimentos' ? EstablishmentReview : EventReview;

        let voto = await Vote.findOne({
            where: {
                idUtilizador: userId,
                ...(tipoEntidade === 'estabelecimentos' ? { idEstabelecimento: idEntidade } : { idEvento: idEntidade }),
            },
        });

        if (voto) {
            if (voto.tipo === true) {
                await voto.destroy();
                await Avaliacao.decrement('Likes', { where: { id: idEntidade } });
                res.json({ message: 'Like removido', voted: false });
            } else {
                voto.tipo = true;
                await voto.save();
                await Avaliacao.increment('likes', { where: { id: idEntidade } });
                await Avaliacao.decrement('dislikes', { where: { id: idEntidade } });
                res.json({ message: 'Alterado para like', voted: true });
            }
        } else {
            voto = await Vote.create({ idUtilizador: userId, [tipoEntidade === 'estabelecimentos' ? 'idEstabelecimento' : 'idEvento']: idEntidade, tipo: true });
            await Avaliacao.increment('likes', { where: { id: idEntidade } });
            res.json({ message: 'Like adicionado', voted: true });
        }
    } catch (error) {
        console.error('Error upvoting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.Dislike = async (req, res) => {
    try {
        const { tipoEntidade, idEntidade } = req.body;
        const userId = req.user.id;

        const Avaliacao = tipoEntidade === 'estabelecimentos' ? EstablishmentReview : EventReview;

        let voto = await Vote.findOne({
            where: {
                idUtilizador: userId,
                ...(tipoEntidade === 'estabelecimentos' ? { idEstabelecimento: idEntidade } : { idEvento: idEntidade }),
            },
        });

        if (voto) {
            if (voto.tipo === false) {
                await voto.destroy();
                await Avaliacao.decrement('dislikes', { where: { id: idEntidade } });
                res.json({ message: 'Dislike removido', voted: false });
            } else {
                voto.tipo = false;
                await voto.save();
                await Avaliacao.increment('dislikes', { where: { id: idEntidade } });
                await Avaliacao.decrement('likes', { where: { id: idEntidade } });
                res.json({ message: 'Alterado para dislike', voted: true });
            }
        } else {
            voto = await Vote.create({ idUtilizador: userId, [tipoEntidade === 'estabelecimentos' ? 'idEstabelecimento' : 'idEvento']: idEntidade, tipo: false });
            await Avaliacao.increment('dislikes', { where: { id: idEntidade } });
            res.json({ message: 'Dislike adicionado', voted: true });
        }
    } catch (error) {
        console.error('Error disliking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.responderAvaliacaoEvento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;
        const { comentario, classificacao} = req.body;
        const idUtilizador = req.user.id;
        

        const avaliacao = await EventReview.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({ success: false, message: 'Avaliação não encontrada.' });
        }

        const user = await User.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }

        const resposta = await EventReview.create({
            idUtilizador,
            idEvento: avaliacao.idEvento,
            idPai: idAvaliacao,
            comentario,
            classificacao,
            estado: true,
        });

        res.json({ success: true, data: resposta });
    } catch (error) {
        console.error('Erro ao responder ao comentário:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 

exports.getFilhosEvento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;

        const filhos = await EventReview.findAll({
            where: { idPai: idAvaliacao },
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
            ],
        });

        const contador = filhos.length;

        res.json({ success: true, data: filhos, contador });
    } catch (error) {
        console.error('Erro ao obter respostas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.responderAvaliacaoEstabelecimento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;
        const { comentario, classificacao} = req.body;
        const idUtilizador = req.user.id;

        const avaliacao = await EstablishmentReview.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({ success: false, message: 'Avaliação não encontrada.' });
        }

        const user = await User.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }

        const resposta = await EstablishmentReview.create({
            idUtilizador,
            idEstabelecimento: avaliacao.idEstabelecimento,
            idPai: idAvaliacao,
            comentario,
            classificacao,
            estado: true,
        });

        res.json({ success: true, data: resposta });
    } catch (error) {
        console.error('Erro ao responder ao comentário:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 

exports.getFilhosEstabelecimento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;

        const filhos = await EstablishmentReview.findAll({
            where: { idPai: idAvaliacao },
            include: [
                { 
                    model: User, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
            ],
        });

        res.json({ success: true, data: filhos });
    } catch (error) {
        console.error('Erro ao obter respostas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}