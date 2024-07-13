const Post = require('../models/postModel');

exports.PostList = async (req, res) => {
    try {
        const data = await Post.findAll();
        res.json({
            success: true,
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.PostGet = async (req, res) => {
    const { postoId } = req.params;
    try {
        const data = await Post.findOne({
            where: { id: postoId }
        });

        if (data) {
            res.status(200).json({
                success: true,
                data: data,
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Posto não encontrado',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

