const User = require('../models/userModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const Post = require('../models/postModel');
const Event = require('../models/eventModel');
const Establishment = require('../models/establishmentModel');
const EstablishmentReview = require('../models/establishmentReviewModel');
const EventReview = require('../models/eventReviewModel');
const EstablishmentPhoto = require('../models/establishmentPhoto');
const EventPhoto = require('../models/eventPhotoModel');
//const SignUp = require('../models/signupModel');
const Notification = require('../models/notificationModel');
const { SequelizeDB } = require('./database');

const utilizadores = [
  { nome: 'Maria Santos', nif: '123456789', localidade: 'Viseu', telemovel: '912345678', email: 'maria.santos@email.pt', estado: true, isAdmin: true, cargo: 'Gestor de Eventos', },
  { nome: 'João Oliveira', nif: '234567890', localidade: 'Tomar', telemovel: '923456789', email: 'joao.oliveira@email.pt', estado: true, isAdmin: false, cargo: 'Coordenador de Saúde' },
  { nome: 'Ana Silva', nif: '345678901', localidade: 'Fundão', telemovel: '934567890', email: 'ana.silva@email.pt', estado: true, isAdmin: false, cargo: 'Treinador Desportivo' },
  { nome: 'Pedro Costa', nif: '456789012', localidade: 'Portalegre', telemovel: '945678901', email: 'pedro.costa@email.pt', estado: true, isAdmin: true, cargo: 'Diretor de Formação' },
  { nome: 'Sofia Martins', nif: '567890123', localidade: 'Vila Real', telemovel: '956789012', email: 'sofia.martins@email.pt', estado: true, isAdmin: false, cargo: 'Chef de Cozinha' },
  { nome: 'Rui Ferreira', nif: '678901234', localidade: 'Viseu', telemovel: '967890123', email: 'rui.ferreira@email.pt', estado: true, isAdmin: false, cargo: 'Gestor de Alojamento' },
  { nome: 'Carla Rodrigues', nif: '789012345', localidade: 'Tomar', telemovel: '978901234', email: 'carla.rodrigues@email.pt', estado: true, isAdmin: false, cargo: 'Coordenador de Transportes' },
  { nome: 'Miguel Alves', nif: '890123456', localidade: 'Fundão', telemovel: '989012345', email: 'miguel.alves@email.pt', estado: true, isAdmin: true, cargo: 'Diretor de Lazer' },
  { nome: 'Teste', email: 'teste@email.com', palavra_passe: '$2a$12$IRNTeNMzdvl6NqmSCZk2MePWzptB0jR20HWnvl9XCpRWfDhUjER36', estado: true, isAdmin: true, isPrimeiroLogin: false, cargo: 'Teste'},
                                                            //17268015
  { nome: 'AAAA BBBB', nif: '126126123', localidade: 'A11A', telemovel: '966666666', email: 'AAAA.BBBB@email.pt', estado: true, isAdmin: true, cargo: 'Diretor de AAAA' },
  { nome: 'Mariana Costa', nif: '425813765', localidade: '2440-567', telemovel: '913254789', email: 'Mariana.Costa@email.pt', estado: true, isAdmin: false, cargo: 'Assistente de Marketing' },
  { nome: 'João Silva', nif: '169328574', localidade: '1357-901', telemovel: '937654321', email: 'Joao.Silva@email.pt', estado: false, isAdmin: true, cargo: 'Chefe de Vendas' },
  { nome: 'Ana Oliveira', nif: '387561420', localidade: '3721-890', telemovel: '925431678', email: 'Ana.Oliveira@email.pt', estado: true, isAdmin: false, cargo: 'Programadora Web' },
  { nome: 'Pedro Mendes', nif: '508274195', localidade: '4903-234', telemovel: '964321578', email: 'Pedro.Mendes@email.pt', estado: false, isAdmin: true, cargo: 'Especialista em Dados' },
  { nome: 'Catarina Nunes', nif: '629186350', localidade: '6135-789', telemovel: '953217654', email: 'Catarina.Nunes@email.pt', estado: true, isAdmin: false, cargo: 'Designer Gráfica' },
  { nome: 'Ricardo Pereira', nif: '740098515', localidade: '7348-123', telemovel: '942106543', email: 'Ricardo.Pereira@email.pt', estado: false, isAdmin: true, cargo: 'Engenheiro de Software' },
  { nome: 'Inês Sousa', nif: '851910670', localidade: '8567-234', telemovel: '931054321', email: 'Ines.Sousa@email.pt', estado: true, isAdmin: false, cargo: 'Auxiliar Administrativa' },
  { nome: 'Bruno Santos', nif: '962822835', localidade: '9786-345', telemovel: '926543107', email: 'Bruno.Santos@email.pt', estado: false, isAdmin: true, cargo: 'Técnico de Suporte' },
  { nome: 'Marta Lopes', nif: '073734950', localidade: '0915-456', telemovel: '913256432', email: 'Marta.Lopes@email.pt', estado: true, isAdmin: false, cargo: 'Auxiliar de Logística' },
  { nome: 'Diogo Ferreira', nif: '184647065', localidade: '1024-567', telemovel: '942175632', email: 'Diogo.Ferreira@email.pt', estado: false, isAdmin: true, cargo: 'Gerente de Operações' },
];

const areas = [
  { nome: 'Saúde' },
  { nome: 'Desporto' },
  { nome: 'Formação' },
  { nome: 'Gastronomia' },
  { nome: 'Alojamento' },
  { nome: 'Transportes' },
  { nome: 'Lazer' }
];

const subareas = [
  { idArea: 1, nome: 'Clinicas médicas e hospitais' },
  { idArea: 1, nome: 'Clínicas dentárias' },
  { idArea: 1, nome: 'Centros de bem-estar' }, 
  { idArea: 2, nome: 'Ginásios' },
  { idArea: 2, nome: 'Atividades ao ar livre' },
  { idArea: 2, nome: 'Desportos aquáticos' },
  { idArea: 3, nome: 'Centros de Formação' },
  { idArea: 3, nome: 'Escolas' },
  { idArea: 3, nome: 'Workshops e seminários' }, 
  { idArea: 4, nome: 'Restaurantes' },
  { idArea: 4, nome: 'Shoppings' },
  { idArea: 4, nome: 'Mercados locais' },
  { idArea: 5, nome: 'Quartos para arrendar' },
  { idArea: 5, nome: 'Casas para alugar' },
  { idArea: 5, nome: 'Alojamento local' }, 
  { idArea: 6, nome: 'Boleias' },
  { idArea: 6, nome: 'Transportes públicos' },
  { idArea: 6, nome: 'Aluguer de veículos' }, 
  { idArea: 7, nome: 'Cinema' },
  { idArea: 7, nome: 'Parques' },
  { idArea: 7, nome: 'Museus e galerias' } 
];

const postos = [
  { nome: 'Viseu' },
  { nome: 'Tomar' },
  { nome: 'Fundão' },
  { nome: 'Portalegre' },
  { nome: 'Vila Real' }
];

const eventos = [
  { idArea: 1, idSubarea: 1, idCriador: 1, idAdmin: 1, idPosto: 1, titulo: 'Feira de Saúde Integral', descricao: 'Feira de Saúde Integral com foco em prevenção e bem-estar em Viseu', data: '2024-09-20', hora: '09:00:00', morada: 'Parque Aquilino Ribeiro, Viseu', estado: true, foto: 'saude-viseu.jpg'},
  { idArea: 1, idSubarea: 2, idCriador: 2, idAdmin: 2, idPosto: 2, titulo: 'Semana do Yoga e Meditação', descricao: 'Semana dedicada à prática de yoga e meditação para todos os níveis em Tomar', data: '2024-06-15', hora: '07:30:00', morada: 'Mata Nacional dos Sete Montes, Tomar', estado: true },

  { idArea: 2, idSubarea: 4, idCriador: 3, idAdmin: 3, idPosto: 3, titulo: 'Corrida de Montanha do Fundão', descricao: 'Competição de corrida de montanha nas serras do Fundão', data: '2024-08-05', hora: '08:00:00', morada: 'Serra da Gardunha, Fundão', estado: true, foto: 'corrida-fundao.jpg' },
  { idArea: 2, idSubarea: 3, idCriador: 4, idAdmin: 4, idPosto: 4, titulo: 'Torneio de Futsal Interescolar', descricao: 'Torneio de futsal entre escolas de Portalegre', data: '2024-07-10', hora: '14:00:00', morada: 'Pavilhão Municipal de Portalegre', estado: true },

  { idArea: 3, idSubarea: 6, idCriador: 5, idAdmin: 5, idPosto: 5, titulo: 'Simpósio de Energias Renováveis', descricao: 'Simpósio sobre avanços em energias renováveis na Universidade de Trás-os-Montes e Alto Douro', data: '2024-10-12', hora: '09:30:00', morada: 'UTAD, Vila Real', estado: true },
  { idArea: 3, idSubarea: 5, idCriador: 6, idAdmin: 6, idPosto: 1, titulo: 'Workshop de Artes Digitais', descricao: 'Workshop prático de artes digitais e design gráfico em Viseu', data: '2024-04-18', hora: '15:00:00', morada: 'Escola Superior de Tecnologia e Gestão de Viseu', estado: true, foto: 'artes-digitais-viseu.jpg' },

  { idArea: 4, idSubarea: 7, idCriador: 7, idAdmin: 7, idPosto: 2, titulo: 'Festival da Gastronomia Templária', descricao: 'Festival gastronómico inspirado na história templária de Tomar', data: '2024-08-20', hora: '12:00:00', morada: 'Praça da República, Tomar', estado: true, foto: 'gastronomia-tomar.jpg' },
  { idArea: 4, idSubarea: 8, idCriador: 8, idAdmin: 8, idPosto: 3, titulo: 'Rota dos Sabores da Beira', descricao: 'Circuito gastronómico pelos sabores tradicionais da Beira no Fundão', data: '2024-09-25', hora: '18:00:00', morada: 'Centro Histórico, Fundão', estado: true },

  { idArea: 5, idSubarea: 9, idCriador: 1, idAdmin: 1, idPosto: 4, titulo: 'Feira de Turismo Rural', descricao: 'Feira dedicada ao turismo rural e alojamento local em Portalegre', data: '2024-07-05', hora: '10:00:00', morada: 'Parque de Feiras e Exposições de Portalegre', estado: true, foto: 'turismo-portalegre.jpg' },
  { idArea: 5, idSubarea: 10, idCriador: 2, idAdmin: 2, idPosto: 5, titulo: 'Conferência de Hotelaria Sustentável', descricao: 'Conferência sobre práticas sustentáveis na hotelaria em Vila Real', data: '2024-11-22', hora: '09:00:00', morada: 'Hotel Mira Corgo, Vila Real', estado: true },

  { idArea: 6, idSubarea: 11, idCriador: 3, idAdmin: 3, idPosto: 1, titulo: 'Exposição de Veículos Elétricos', descricao: 'Exposição e test-drive de veículos elétricos em Viseu', data: '2024-05-18', hora: '09:00:00', morada: 'Feira de São Mateus, Viseu', estado: true, foto: 'eletricos-viseu.jpg' },
  { idArea: 6, idSubarea: 12, idCriador: 4, idAdmin: 4, idPosto: 2, titulo: 'Passeio de Bicicleta Histórico', descricao: 'Passeio de bicicleta pelos pontos históricos de Tomar', data: '2024-06-25', hora: '10:00:00', morada: 'Convento de Cristo, Tomar', estado: true },

  { idArea: 7, idSubarea: 13, idCriador: 5, idAdmin: 5, idPosto: 3, titulo: 'Festival de Música da Beira', descricao: 'Festival de música com artistas nacionais e internacionais no Fundão', data: '2024-10-05', hora: '19:00:00', morada: 'Pavilhão Multiusos do Fundão', estado: true, foto: 'musica-fundao.jpg' },
  { idArea: 7, idSubarea: 14, idCriador: 6, idAdmin: 6, idPosto: 4, titulo: 'Bienal de Arte Contemporânea', descricao: 'Bienal de arte contemporânea com foco em artistas emergentes em Portalegre', data: '2024-11-10', hora: '10:00:00', morada: 'Centro de Artes do Espectáculo de Portalegre', estado: true }
];

const fotosevento = [
  { idEvento: 1, foto: 'saude-viseu.jpg', idAdmin: 1, idCriador: 1, estado: 1 },
  
  { idEvento: 3, foto: 'corrida-fundao.jpg', idAdmin: 3, idCriador: 3, estado: 1 },
  
  { idEvento: 5, foto: 'artes-digitais-viseu.jpg', idAdmin: 5, idCriador: 5, estado: 1 },
  
  { idEvento: 7, foto: 'gastronomia-tomar.jpg', idAdmin: 7, idCriador: 7, estado: 1 },
  
  { idEvento: 9, foto: 'turismo-portalegre.jpg', idAdmin: 1, idCriador: 1, estado: 1 },
 
  { idEvento: 11, foto: 'eletricos-viseu.jpg', idAdmin: 3, idCriador: 3, estado: 1 },

  { idEvento: 13, foto: 'musica-fundao.jpg', idAdmin: 6, idCriador: 5, estado: 1 },

];

const reviewevento = [
  { idUtilizador: 1, idAdmin: 1, idEvento: 1, classificacao: 5, estado: true },
  { idUtilizador: 2, idAdmin: 2, idEvento: 2, classificacao: 4, estado: true },
  { idUtilizador: 3, idAdmin: 3, idEvento: 3, classificacao: 3, estado: true },
  { idUtilizador: 4, idAdmin: 4, idEvento: 4, classificacao: 2, estado: true },
  { idUtilizador: 5, idAdmin: 5, idEvento: 5, classificacao: 1, estado: true },
  { idUtilizador: 1, idAdmin: 1, idEvento: 6, classificacao: 5, estado: true },
  { idUtilizador: 2, idAdmin: 2, idEvento: 7, classificacao: 4, estado: true },
  { idUtilizador: 6, idAdmin: 1, idEvento: 8, classificacao: 5, estado: true },
];

const estabelecimentos = [
  { idArea: 1, idSubarea: 1, idCriador: 1, idAdmin: 1, idPosto: 1, nome: 'Clínica Médica Viseu', descricao: 'Clínica especializada em medicina geral e familiar', morada: 'Rua Dr. Luís Ferreira, 3500-117 Viseu', estado: true, foto: 'clinica-viseu.jpg' },
  { idArea: 1, idSubarea: 2, idCriador: 2, idAdmin: 2, idPosto: 2, nome: 'Sorriso Perfeito Tomar', descricao: 'Clínica dentária com serviços de ortodontia e implantes', morada: 'Rua Serpa Pinto, 2300-592 Tomar', estado: true, foto: 'sorriso-perfeito.jpg' },
  { idArea: 1, idSubarea: 3, idCriador: 3, idAdmin: 3, idPosto: 3, nome: 'Spa Serenidade Fundão', descricao: 'Centro de bem-estar com massagens e tratamentos holísticos', morada: 'Avenida da Liberdade, 6230-338 Fundão', estado: true, foto: 'spa-serenidade.jpg' },
  { idArea: 2, idSubarea: 4, idCriador: 4, idAdmin: 4, idPosto: 4, nome: 'Ginásio TomarFit', descricao: 'Ginásio com aulas de grupo e personal trainers', morada: 'Avenida Norton de Matos, 2300-313 Tomar', estado: true, foto: 'tomarfit.jpg' },
  { idArea: 2, idSubarea: 5, idCriador: 5, idAdmin: 5, idPosto: 5, nome: 'Aventura Portalegre', descricao: 'Empresa de atividades outdoor e desportos radicais', morada: 'Parque Natural de São Mamede, 7300-000 Portalegre', estado: true, foto: 'aventura-portalegre.jpg' },
  { idArea: 2, idSubarea: 6, idCriador: 6, idAdmin: 6, idPosto: 1, nome: 'Escola de Surf Viseu', descricao: 'Aulas de surf e aluguer de equipamentos', morada: 'Praia da Barra, 3830-751 Gafanha da Nazaré', estado: true, foto: 'surf-viseu.jpg' },
  { idArea: 3, idSubarea: 7, idCriador: 7, idAdmin: 7, idPosto: 2, nome: 'Centro de Formação Fundão', descricao: 'Centro de formação profissional em diversas áreas', morada: 'Rua Cidade da Covilhã, 6230-346 Fundão', estado: true, foto: 'formacao-fundao.jpg' },
  { idArea: 3, idSubarea: 8, idCriador: 8, idAdmin: 8, idPosto: 3, nome: 'Escola de Línguas Portalegre', descricao: 'Escola de idiomas com cursos intensivos e regulares', morada: 'Rua 5 de Outubro, 7300-126 Portalegre', estado: true, foto: 'linguas-portalegre.jpg' },
  { idArea: 3, idSubarea: 9, idCriador: 9, idAdmin: 9, idPosto: 4, nome: 'Workshop Vila Real', descricao: 'Espaço para workshops e seminários em várias áreas', morada: 'Rua Diogo Cão, 5000-264 Vila Real', estado: true, foto: 'workshop-vilareal.jpg' },
  { idArea: 4, idSubarea: 10, idCriador: 10, idAdmin: 10, idPosto: 5, nome: 'Restaurante Gourmet', descricao: 'Restaurante de cozinha gourmet com pratos internacionais', morada: 'Largo do Mercado, 7300-150 Portalegre', estado: true, foto: 'gourmet.jpg' },
  { idArea: 4, idSubarea: 11, idCriador: 11, idAdmin: 11, idPosto: 1, nome: 'Shopping Viseu', descricao: 'Centro comercial com lojas, restaurantes e cinema', morada: 'Avenida Europa, 3510-024 Viseu', estado: true, foto: 'shopping-viseu.jpg' },
  { idArea: 4, idSubarea: 12, idCriador: 12, idAdmin: 12, idPosto: 2, nome: 'Mercado Municipal Tomar', descricao: 'Mercado tradicional com produtos locais e frescos', morada: 'Rua Marquês de Pombal, 2300-510 Tomar', estado: true, foto: 'mercado-tomar.jpg' },
  { idArea: 5, idSubarea: 13, idCriador: 13, idAdmin: 13, idPosto: 3, nome: 'Quartos Fundão', descricao: 'Quartos para arrendar no centro histórico', morada: 'Rua da Cale, 6230-366 Fundão', estado: true, foto: 'quartos-fundao.jpg' },
  { idArea: 5, idSubarea: 14, idCriador: 14, idAdmin: 14, idPosto: 4, nome: 'Casa Férias Portalegre', descricao: 'Casa de férias com piscina para alugar', morada: 'Rua dos Bombeiros Voluntários, 7300-056 Portalegre', estado: true, foto: 'casa-portalegre.jpg' },
  { idArea: 5, idSubarea: 15, idCriador: 15, idAdmin: 15, idPosto: 5, nome: 'Hostel Vila Real', descricao: 'Hostel económico no centro da cidade', morada: 'Rua do Comércio, 5000-123 Vila Real', estado: true, foto: 'hostel-vilareal.jpg' },
  { idArea: 6, idSubarea: 16, idCriador: 16, idAdmin: 16, idPosto: 1, nome: 'Boleias Viseu', descricao: 'Plataforma de partilha de boleias na região', morada: 'Viseu', estado: true, foto: 'boleias-viseu.jpg' },
  { idArea: 6, idSubarea: 17, idCriador: 17, idAdmin: 17, idPosto: 2, nome: 'Autocarros Tomar', descricao: 'Empresa de transportes públicos da cidade', morada: 'Terminal Rodoviário, 2300-522 Tomar', estado: true, foto: 'autocarros-tomar.jpg' },
  { idArea: 6, idSubarea: 18, idCriador: 18, idAdmin: 18, idPosto: 3, nome: 'Rent-a-Car Fundão', descricao: 'Empresa de aluguer de veículos ligeiros e comerciais', morada: 'Rua da Cale, 6230-346 Fundão', estado: true, foto: 'rentacar-fundao.jpg' },
  { idArea: 7, idSubarea: 19, idCriador: 19, idAdmin: 19, idPosto: 4, nome: 'Cinema Portalegre', descricao: 'Cinema com exibição de filmes nacionais e internacionais', morada: 'Rua 5 de Outubro, 7300-127 Portalegre', estado: true, foto: 'cinema-portalegre.jpg' },
  { idArea: 7, idSubarea: 20, idCriador: 20, idAdmin: 20, idPosto: 5, nome: 'Parque Natural Vila Real', descricao: 'Parque natural com trilhas e áreas de piquenique', morada: 'Parque Natural do Alvão, 5000-876 Vila Real', estado: true, foto: 'parque-vilareal.jpg' },
  { idArea: 7, idSubarea: 20, idCriador: 20, idAdmin: 20, idPosto: 1, nome: 'Museu de Arte Viseu', descricao: 'Museu com coleções de arte moderna e contemporânea', morada: 'Largo de São Miguel, 3500-210 Viseu', estado: true, foto: 'museu-viseu.jpg' }
];

const fotosestabelecimento = [
  { idEstabelecimento: 1, foto: 'clinica-viseu.jpg', idAdmin: 1, idCriador: 1, estado: 1 },
];

const reviewestabelecimento = [
  { idUtilizador: 1, idAdmin: 1, idEstabelecimento: 1, classificacao: 5, estado: true },
  { idUtilizador: 2, idAdmin: 2, idEstabelecimento: 2, classificacao: 4, estado: true },
  { idUtilizador: 3, idAdmin: 3, idEstabelecimento: 3, classificacao: 3, estado: true },
  { idUtilizador: 4, idAdmin: 4, idEstabelecimento: 4, classificacao: 2, estado: true },
  { idUtilizador: 5, idAdmin: 5, idEstabelecimento: 5, classificacao: 1, estado: true },
  { idUtilizador: 6, idAdmin: 6, idEstabelecimento: 6, classificacao: 5, estado: true },
  { idUtilizador: 7, idAdmin: 7, idEstabelecimento: 7, classificacao: 4, estado: true },
  { idUtilizador: 8, idAdmin: 8, idEstabelecimento: 1, classificacao: 4, estado: true }
  
];





const notificacoes = [
  { idUtilizador: 1, titulo: "Notif 1", descricao: 'Tem uma nova avaliação no evento "Feira de Saúde Integral"', estado: false },
  { idUtilizador: 2, titulo: "Notif 2", descricao: 'Tem uma nova inscrição no evento "Feira de Saúde Integral"', estado: true },
  { idUtilizador: 3, titulo: "Notif 3", descricao: 'Falta menos de uma semana para "Feira de Saúde Integral"', estado: false },
];


const carregarTabelas = async () => {
  try {
    await SequelizeDB.sync({ force: true });
    await User.bulkCreate(utilizadores);
    await Area.bulkCreate(areas);
    await Subarea.bulkCreate(subareas);
    await Post.bulkCreate(postos);
    await Event.bulkCreate(eventos);
    await Establishment.bulkCreate(estabelecimentos);
    await EventPhoto.bulkCreate(fotosevento);
    await EstablishmentPhoto.bulkCreate(fotosestabelecimento);
    await EventReview.bulkCreate(reviewevento);
    await EstablishmentReview.bulkCreate(reviewestabelecimento);

    await Notification.bulkCreate(notificacoes);

    console.log('Tabelas carregadas com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar tabelas:', error);
  }
};


module.exports = carregarTabelas;